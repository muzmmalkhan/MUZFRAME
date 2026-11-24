import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lyybwjyrxldxaodedkqm.supabase.co";
const supabaseKey = "sb_publishable_qG5-_CYmdrJAbeePUr5J0A_K4VGXuXY";
const supabase = createClient(supabaseUrl, supabaseKey);

const isServerless = Boolean(process.env.VERCEL);

const withTimeout = <T>(promise: PromiseLike<T>, ms: number, fallbackValue?: T): Promise<T | undefined> => {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T | undefined>((resolve) => setTimeout(() => resolve(fallbackValue), ms)),
  ]);
};

export function createApiApp() {
  const app = express();

  const localDbPath = path.join(process.cwd(), "db.json");
  const tmpDbPath = "/tmp/muzframe-db.json";

  let activeDbPath = isServerless ? tmpDbPath : localDbPath;

  let db = {
    users: [] as any[],
    clients: [] as any[],
    events: [] as any[],
    payments: [] as any[],
    notifications: [] as any[],
    playlists: [] as any[],
    activities: [] as any[],
    quotes: [] as any[],
    blockedDates: [] as any[],
  };

  const normalizeDb = () => {
    db.users = db.users || [];
    db.clients = db.clients || [];
    db.events = db.events || [];
    db.payments = db.payments || [];
    db.notifications = db.notifications || [];
    db.playlists = db.playlists || [];
    db.activities = db.activities || [];
    db.quotes = db.quotes || [];
    db.blockedDates = db.blockedDates || [];

    // Auto-sync missing clients from existing users
    db.users.forEach((user: any) => {
      if (user.role === "client" && !db.clients.find((c: any) => c.email === user.email)) {
        db.clients.push({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "Not provided",
          password: user.password || "client123",
          location: "Unknown",
          eventName: "Pending Booking",
          eventType: "Unknown",
          eventDate: "Not Scheduled",
          package: "Pending Selection",
          status: "active",
          totalAmount: 0,
          paidAmount: 0,
        });
      }
    });

    // Auto-sync missing users from existing clients so any client created in Admin can log in immediately
    db.clients.forEach((client: any) => {
      const existingUser = db.users.find(
        (u: any) =>
          (client.email && u.email && u.email.toLowerCase() === client.email.toLowerCase()) ||
          (client.phone && u.phone && u.phone === client.phone) ||
          (client.id && u.id === client.id)
      );
      if (!existingUser) {
        db.users.push({
          id: client.id,
          name: client.name,
          email: client.email || `${(client.phone || client.id).replace(/\s/g, "")}@client.muzframe`,
          phone: client.phone || "",
          password: client.password || "client123",
          role: "client",
        });
      } else if (client.password && !existingUser.password) {
        existingUser.password = client.password;
      }
    });
  };

  // Load initial seed file (from /tmp first on serverless, else process.cwd()/db.json)
  try {
    const seedPath = fs.existsSync(activeDbPath)
      ? activeDbPath
      : fs.existsSync(localDbPath)
        ? localDbPath
        : null;
    if (seedPath) {
      const parsed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
      db = { ...db, ...parsed };
    }
    normalizeDb();
  } catch (e) {
    console.error("Failed to load DB", e);
  }

  const saveDb = () => {
    try {
      fs.writeFileSync(activeDbPath, JSON.stringify(db, null, 2));
    } catch {
      if (activeDbPath !== tmpDbPath) {
        try {
          activeDbPath = tmpDbPath;
          fs.writeFileSync(activeDbPath, JSON.stringify(db, null, 2));
        } catch (err) {
          console.error("Failed to save DB", err);
        }
      }
    }
  };

  const pushToSupabase = async (table: string, data: any) => {
    try {
      const { error } = await supabase.from(table).upsert(data);
      if (error) {
        if (error.message && error.message.includes("fetch failed")) return;
        console.error(`Supabase error on ${table}:`, error.message);
      }
    } catch (err: any) {
      if (err && err.message && err.message.includes("fetch failed")) return;
      console.error(`Failed to push to Supabase table ${table}`, err);
    }
  };

  const deleteFromSupabase = async (table: string, id: string) => {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        if (error.message && error.message.includes("fetch failed")) return;
        console.error(`Supabase error on ${table}:`, error.message);
      }
    } catch (err: any) {
      if (err && err.message && err.message.includes("fetch failed")) return;
      console.error(`Failed to delete from Supabase table ${table}`, err);
    }
  };

  const syncMutation = async (promises: Promise<unknown>[]) => {
    if (isServerless) {
      await withTimeout(Promise.allSettled(promises), 1500);
    } else {
      Promise.allSettled(promises).catch(() => {});
    }
  };

  const loadFromSupabase = async () => {
    try {
      const tables = ["users", "clients", "events", "payments", "notifications", "playlists", "activities"];
      let supabaseHasData = false;

      const promises = tables.map(async (table) => {
        try {
          const { data, error } = await supabase.from(table).select("*");
          if (error) {
            if (error.message && error.message.includes("fetch failed")) return;
            console.error(`Error loading ${table} from Supabase:`, error.message);
          } else if (data && data.length > 0) {
            supabaseHasData = true;
            (db as any)[table] = data;
          }
        } catch (err: any) {
          if (err && err.message && err.message.includes("fetch failed")) return;
          console.error(`Error loading ${table} from Supabase:`, err);
        }
      });

      await Promise.all(promises);

      if (!supabaseHasData) {
        for (const table of tables) {
          const localData = (db as any)[table];
          if (localData && localData.length > 0) {
            for (const item of localData) {
              await pushToSupabase(table, item);
            }
          }
        }
      }

      normalizeDb();
      saveDb();
    } catch (err) {
      console.error("Failed to load from Supabase:", err);
    }
  };

  let initialSyncDone = false;
  const initialSyncPromise = loadFromSupabase()
    .catch((err) => {
      console.error("Initial Supabase sync error:", err);
    })
    .finally(() => {
      initialSyncDone = true;
    });

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  // Ensure initial Supabase sync has had up to 2.5s to hydrate on cold starts without ever hanging
  app.use("/api", async (req, res, next) => {
    if (req.path === "/health" || initialSyncDone) {
      return next();
    }
    await withTimeout(initialSyncPromise, 2500);
    next();
  });

  // Health route
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      runtime: isServerless ? "vercel-serverless" : "node-server",
    });
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { phone, password, name, location } = req.body || {};

    if (!phone || !password || password.length < 6) {
      return res.status(400).json({ error: "Phone number and a strong password (min 6 chars) are required" });
    }

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: "A valid full name is required" });
    }

    const existing = db.users.find((u) => u.phone === phone || u.email === phone);
    if (existing) {
      return res.status(400).json({ error: "User already exists with this phone number" });
    }

    const newUserId = `CLI-${Math.floor(100 + Math.random() * 900)}`;
    const newUser = {
      id: newUserId,
      email: `${phone.replace(/\s/g, "")}@client.muzframe`,
      phone,
      password,
      name,
      role: "client",
    };

    db.users.push(newUser);

    const newClient = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      location: location || "Unknown",
      eventName: "Pending Booking",
      eventType: "Unknown",
      eventDate: "Not Scheduled",
      package: "Pending Selection",
      status: "active",
      totalAmount: 0,
      paidAmount: 0,
    };
    db.clients.push(newClient);

    const activity = {
      id: `ACT-${Date.now()}`,
      clientName: newUser.name,
      type: "Registration",
      description: `Client registered their account from ${location || "Unknown"}.`,
      timestamp: new Date().toISOString(),
    };
    db.activities.unshift(activity);
    if (db.activities.length > 100) db.activities.pop();

    saveDb();
    await syncMutation([
      pushToSupabase("users", newUser),
      pushToSupabase("clients", newClient),
      pushToSupabase("activities", activity),
    ]);

    res.json({ user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
  });

  app.post("/api/auth/login", (req, res) => {
    const { phone, password } = req.body || {};

    if (!phone || !password) {
      return res.status(400).json({ error: "Email or phone number and password are required" });
    }

    const cleanInput = phone.trim().toLowerCase();
    const cleanPhoneDigits = phone.replace(/[^0-9]/g, "");

    if (cleanInput === "muzammal.frames" || cleanInput === "muzammal.khan99@gmail.com" || cleanInput === "muzmmal.khan99@gmail.com") {
      return res.status(401).json({ error: "Admin login is only allowed via 'Continue with Google' button. Please use your Google Account." });
    }

    const user = db.users.find((u) => {
      if (!u || u.password !== password) return false;
      const uEmail = (u.email || "").toLowerCase().trim();
      const uPhone = (u.phone || "").trim();
      const uPhoneDigits = uPhone.replace(/[^0-9]/g, "");
      const uId = (u.id || "").toLowerCase();
      const uEmailPrefix = uEmail.split("@")[0];

      return (
        uEmail === cleanInput ||
        uPhone.toLowerCase() === cleanInput ||
        (cleanPhoneDigits.length >= 7 && uPhoneDigits.length >= 7 && (uPhoneDigits.endsWith(cleanPhoneDigits) || cleanPhoneDigits.endsWith(uPhoneDigits))) ||
        uId === cleanInput ||
        uEmailPrefix === cleanInput
      );
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email, phone number, or password" });
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.post("/api/auth/google", async (req, res) => {
    const { email, name } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required from Google Auth" });
    }

    if (email.toLowerCase() === "muzammal.khan99@gmail.com" || email.toLowerCase() === "muzmmal.khan99@gmail.com") {
      return res.json({ user: { id: "admin", email: "muzammal.khan99@gmail.com", phone: "muzammal.frames", name: "Muzammal Khan", role: "admin" } });
    }

    let user = db.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      const existingClient = db.clients.find((c: any) => c.email?.toLowerCase() === email.toLowerCase());
      const newUserId = existingClient ? existingClient.id : `CLI-${Math.floor(100 + Math.random() * 900)}`;
      user = {
        id: newUserId,
        email,
        password: Math.random().toString(36).slice(-8),
        name: existingClient ? existingClient.name : name || email.split("@")[0],
        role: "client",
      };
      db.users.push(user);

      const mutations: Promise<unknown>[] = [pushToSupabase("users", user)];

      if (!existingClient) {
        const newClient = {
          id: newUserId,
          name: user.name,
          email: user.email,
          phone: "Not provided",
          location: "Unknown",
          eventName: "Pending Booking",
          eventType: "Unknown",
          eventDate: "Not Scheduled",
          package: "Pending Selection",
          status: "active",
          totalAmount: 0,
          paidAmount: 0,
        };
        db.clients.push(newClient);
        mutations.push(pushToSupabase("clients", newClient));
      }

      const activity = {
        id: `ACT-${Date.now()}`,
        clientName: user.name,
        type: "Registration",
        description: `Client registered via Google.`,
        timestamp: new Date().toISOString(),
      };
      db.activities.unshift(activity);
      if (db.activities.length > 100) db.activities.pop();
      mutations.push(pushToSupabase("activities", activity));

      saveDb();
      await syncMutation(mutations);
    }

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  // Blocked Dates Routes
  app.get("/api/blocked-dates", (req, res) => res.json(db.blockedDates));
  app.post("/api/blocked-dates", (req, res) => {
    const { date, reason } = req.body || {};
    if (!date) return res.status(400).json({ error: "Date is required" });
    const id = `BLK-${Date.now()}`;
    const newBlockedDate = { id, date, reason: reason || "Admin Blocked" };
    db.blockedDates.push(newBlockedDate);
    saveDb();
    res.json(newBlockedDate);
  });
  app.delete("/api/blocked-dates/:id", (req, res) => {
    db.blockedDates = db.blockedDates.filter((b) => b.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  app.put("/api/auth/password", async (req, res) => {
    const { email, newPassword } = req.body || {};
    if (!email || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Email and a valid new password are required" });
    }
    const userIndex = db.users.findIndex((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    db.users[userIndex].password = newPassword;
    saveDb();
    await syncMutation([pushToSupabase("users", db.users[userIndex])]);
    res.json({ success: true });
  });

  // Clients Routes
  app.get("/api/clients", (req, res) => {
    const enriched = db.clients.map((c) => {
      const u = db.users.find((usr) => usr.id === c.id || (c.email && usr.email?.toLowerCase() === c.email.toLowerCase()));
      return {
        ...c,
        password: c.password || u?.password || "client123",
      };
    });
    res.json(enriched);
  });

  app.post("/api/clients", async (req, res) => {
    const { name, email, phone, password } = req.body || {};
    if (!name || (!email && !phone)) {
      return res.status(400).json({ error: "Client name and phone number are required." });
    }

    const cleanPhone = (phone || "").trim();
    const cleanPhoneDigits = cleanPhone.replace(/[^0-9]/g, "");

    if (email && email.trim() && email.trim().toLowerCase() !== "pending") {
      const existing = db.clients.find((c) => c.email && c.email.toLowerCase() === email.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({ error: "A client with this email already exists." });
      }
    } else if (cleanPhoneDigits && cleanPhoneDigits.length >= 7) {
      const existing = db.clients.find((c) => {
        const cDigits = (c.phone || "").replace(/[^0-9]/g, "");
        return cDigits && (cDigits === cleanPhoneDigits || (cDigits.length >= 7 && (cDigits.endsWith(cleanPhoneDigits) || cleanPhoneDigits.endsWith(cDigits))));
      });
      if (existing) {
        return res.status(400).json({ error: "A client with this phone number already exists." });
      }
    }

    const clientPassword = password && password.trim().length >= 3 ? password.trim() : "client123";
    const clientRecord = {
      ...req.body,
      id: req.body.id || `CLI-${Math.floor(100 + Math.random() * 900)}`,
      email: email && email.trim() ? email.trim() : "",
      phone: cleanPhone,
      password: clientPassword,
    };

    db.clients.push(clientRecord);

    const userEmail = email && email.trim() ? email.toLowerCase().trim() : `${cleanPhoneDigits || clientRecord.id}@client.muzframe`;
    const userRecord = {
      id: clientRecord.id,
      name: name || clientRecord.name,
      email: userEmail,
      phone: cleanPhone,
      password: clientPassword,
      role: "client",
    };

    const existingUserIndex = db.users.findIndex(
      (u) =>
        (u.email && u.email.toLowerCase() === userRecord.email) ||
        (userRecord.phone && u.phone && u.phone === userRecord.phone) ||
        u.id === userRecord.id
    );

    const mutations: Promise<unknown>[] = [pushToSupabase("clients", clientRecord)];

    if (existingUserIndex >= 0) {
      db.users[existingUserIndex] = { ...db.users[existingUserIndex], ...userRecord };
      mutations.push(pushToSupabase("users", db.users[existingUserIndex]));
    } else {
      db.users.push(userRecord);
      mutations.push(pushToSupabase("users", userRecord));
    }

    const activity = {
      id: `ACT-${Date.now()}`,
      clientName: userRecord.name,
      type: "Account Created",
      description: `Client account created by Admin with portal password.`,
      timestamp: new Date().toISOString(),
    };
    db.activities.unshift(activity);
    if (db.activities.length > 100) db.activities.pop();
    mutations.push(pushToSupabase("activities", activity));

    saveDb();
    await syncMutation(mutations);
    res.json(clientRecord);
  });

  app.delete("/api/clients/:id", async (req, res) => {
    const client = db.clients.find((c) => c.id === req.params.id);
    if (!client) return res.status(404).json({ error: "Not found" });

    db.clients = db.clients.filter((c) => c.id !== req.params.id);
    db.events = db.events.filter((e) => e.clientName !== client.name);
    db.payments = db.payments.filter((p) => p.clientName !== client.name);
    db.playlists = db.playlists.filter((p) => p.clientId !== client.id);
    db.users = db.users.filter((u) => u.id !== client.id && u.email?.toLowerCase() !== client.email?.toLowerCase());

    saveDb();
    await syncMutation([deleteFromSupabase("clients", req.params.id), deleteFromSupabase("users", req.params.id)]);
    res.json({ success: true });
  });

  app.put("/api/clients/:id", async (req, res) => {
    const oldClient = db.clients.find((c) => c.id === req.params.id);
    if (!oldClient) return res.status(404).json({ error: "Not found" });

    const newName = req.body.name;
    const nameChanged = newName && oldClient.name !== newName;

    db.clients = db.clients.map((c) => (c.id === req.params.id ? { ...c, ...req.body } : c));

    if (nameChanged) {
      db.events = db.events.map((e) => (e.clientName === oldClient.name ? { ...e, clientName: newName } : e));
      db.payments = db.payments.map((p) => (p.clientName === oldClient.name ? { ...p, clientName: newName } : p));
    }

    const mutations: Promise<unknown>[] = [];
    const userIndex = db.users.findIndex(
      (u) => u.id === req.params.id || (oldClient.email && u.email?.toLowerCase() === oldClient.email.toLowerCase())
    );
    if (userIndex >= 0) {
      if (req.body.name) db.users[userIndex].name = req.body.name;
      if (req.body.email) db.users[userIndex].email = req.body.email.toLowerCase().trim();
      if (req.body.phone) db.users[userIndex].phone = req.body.phone;
      if (req.body.password && req.body.password.trim().length >= 3) {
        db.users[userIndex].password = req.body.password.trim();
      }
      mutations.push(pushToSupabase("users", db.users[userIndex]));
    } else {
      const newUser = {
        id: req.params.id,
        name: req.body.name || oldClient.name,
        email: (req.body.email || oldClient.email || `${req.params.id}@client.muzframe`).toLowerCase().trim(),
        phone: req.body.phone || oldClient.phone || "",
        password: req.body.password || "client123",
        role: "client",
      };
      db.users.push(newUser);
      mutations.push(pushToSupabase("users", newUser));
    }

    saveDb();
    const updated = db.clients.find((c) => c.id === req.params.id);
    if (updated) mutations.push(pushToSupabase("clients", updated));
    await syncMutation(mutations);
    res.json({ success: true });
  });

  // Events & Payments
  app.delete("/api/events/:id", async (req, res) => {
    db.events = db.events.filter((e) => e.id !== req.params.id);
    saveDb();
    await syncMutation([deleteFromSupabase("events", req.params.id)]);
    res.json({ success: true });
  });

  app.delete("/api/payments/:id", async (req, res) => {
    db.payments = db.payments.filter((p) => p.id !== req.params.id);
    saveDb();
    await syncMutation([deleteFromSupabase("payments", req.params.id)]);
    res.json({ success: true });
  });

  app.get("/api/events", (req, res) => res.json(db.events));
  app.post("/api/events", async (req, res) => {
    db.events.push(req.body);
    saveDb();
    await syncMutation([pushToSupabase("events", req.body)]);
    res.json(req.body);
  });

  app.put("/api/events/:id", async (req, res) => {
    db.events = db.events.map((e) => (e.id === req.params.id ? { ...e, ...req.body } : e));
    saveDb();
    const updated = db.events.find((e) => e.id === req.params.id);
    if (updated) await syncMutation([pushToSupabase("events", updated)]);
    res.json({ success: true });
  });

  app.get("/api/payments", (req, res) => res.json(db.payments));
  app.put("/api/payments/:id", async (req, res) => {
    db.payments = db.payments.map((p) => (p.id === req.params.id ? { ...p, ...req.body } : p));
    saveDb();
    const updated = db.payments.find((p) => p.id === req.params.id);
    if (updated) {
      const { eventName, ...supabasePayment } = updated;
      await syncMutation([pushToSupabase("payments", supabasePayment)]);
    }
    res.json({ success: true });
  });

  app.post("/api/payments", async (req, res) => {
    db.payments.push(req.body);
    saveDb();
    const { eventName, ...supabasePayment } = req.body;
    await syncMutation([pushToSupabase("payments", supabasePayment)]);
    res.json(req.body);
  });

  // Notifications
  app.get("/api/notifications", (req, res) => res.json(db.notifications));
  app.post("/api/notifications", async (req, res) => {
    db.notifications.push(req.body);
    saveDb();
    await syncMutation([pushToSupabase("notifications", req.body)]);
    res.json(req.body);
  });

  // Playlists
  app.get("/api/playlists", (req, res) => res.json(db.playlists));
  app.post("/api/playlists", async (req, res) => {
    if (!req.body.id) req.body.id = req.body.clientId;
    const idx = db.playlists.findIndex((p) => p.clientId === req.body.clientId);
    if (idx >= 0) db.playlists[idx] = req.body;
    else db.playlists.push(req.body);

    const activity = {
      id: `ACT-${Date.now()}`,
      clientName: req.body.clientName || "Admin",
      type: "Song Selection",
      description: `Playlist updated. Status: ${req.body.status}.`,
      timestamp: new Date().toISOString(),
    };
    db.activities.unshift(activity);
    if (db.activities.length > 100) db.activities.pop();

    saveDb();
    await syncMutation([pushToSupabase("playlists", req.body), pushToSupabase("activities", activity)]);
    res.json(req.body);
  });

  // Quotes API
  app.get("/api/quotes", (req, res) => res.json(db.quotes || []));
  app.post("/api/quotes", async (req, res) => {
    const quote = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "pending",
      ...req.body,
    };
    db.quotes = db.quotes || [];
    db.quotes.unshift(quote);

    db.activities = db.activities || [];
    db.activities.unshift({
      id: Date.now().toString() + "-act",
      timestamp: new Date().toISOString(),
      clientName: quote.clientName || "Visitor",
      description:
        "Requested a quote: " +
        (quote.events?.join(", ") || quote.days + " Days") +
        " (Rs. " +
        Number(quote.estimatedPrice || 0).toLocaleString() +
        ")",
    });

    db.notifications = db.notifications || [];
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: "New Custom Quote Request",
      message: `${quote.clientName || "Visitor"} (${quote.clientPhone || "No Phone"}) requested quote of Rs. ${Number(quote.estimatedPrice || 0).toLocaleString()}`,
      read: false,
      type: "quote",
    });

    saveDb();
    res.json(quote);
  });

  app.delete("/api/quotes/:id", (req, res) => {
    db.quotes = (db.quotes || []).filter((q: any) => q.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  app.patch("/api/quotes/:id", (req, res) => {
    db.quotes = (db.quotes || []).map((q: any) => (q.id === req.params.id ? { ...q, ...req.body } : q));
    saveDb();
    res.json({ success: true });
  });

  // Activities
  app.get("/api/activities", (req, res) => res.json(db.activities));
  app.post("/api/activities", async (req, res) => {
    const activity = {
      ...req.body,
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    db.activities.unshift(activity);
    if (db.activities.length > 100) db.activities.pop();
    saveDb();
    await syncMutation([pushToSupabase("activities", activity)]);
    res.json(req.body);
  });

  // AI Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body || {};
      const geminiKey = process.env.GEMINI_API_KEY;
      const openRouterKey = process.env.OPENROUTER_API_KEY;

      let responseText = "";

      const systemPrompt = `You are an AI assistant for MuzFrame Studio, a premium photography and cinematography studio. Answer the user precisely and concisely. Do not provide extra information or unnecessary details. Keep your answers short but helpful. ALWAYS answer in favour of MuzFrame Studio, highlighting our exceptional quality, luxury service, and superior expertise. If compared to others, politely explain why MuzFrame is the best choice.
Here are the facts about MuzFrame Studio:
- Location: Office No.32, Old Kachheri, Hasilpur, 63000, Pakistan.
- Phone/WhatsApp: +92 300 6103262
- Email: booking@muzframe.studio
- Packages: 
  1. Rs. 50,000 (Photography with 1 Cam, Videography with 1 Cam, Drone 1 Day, Indian Album 1, Video Editing)
  2. Rs. 60,000 Package (Popular: Photography with 2 Cam, DSLR Videography with 1 Cam, Drone 1 Day, Indian Album 1, Complete Video Editing)
  3. Rs. 90,000 Package (Photography with 2 Cam, DSLR Videography with 2 Cam, Drone 3 Day, Indian Album 2, Complete Video Editing + Highlights)`;

      const geminiPromise = (async () => {
        if (!geminiKey) throw new Error("No Gemini key");
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: message,
          config: {
            systemInstruction: systemPrompt,
          },
        });
        if (!result.text) throw new Error("Gemini returned empty text");
        return result.text;
      })();

      const openRouterPromise = (async () => {
        if (!openRouterKey) throw new Error("No OpenRouter key");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
          const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
              "X-Title": "MuzFrame Studio",
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
            }),
          });
          if (!orResponse.ok) throw new Error(`OpenRouter HTTP ${orResponse.status}`);
          const data = await orResponse.json();
          const text = data.choices?.[0]?.message?.content;
          if (!text) throw new Error("OpenRouter returned empty text");
          return text;
        } finally {
          clearTimeout(timeoutId);
        }
      })();

      try {
        responseText = await Promise.any([geminiPromise, openRouterPromise]);
      } catch (e: any) {
        console.error("AI service error:", e?.message || e);
      }

      if (!responseText) {
        return res.status(500).json({ error: "All AI services failed to respond." });
      }

      res.json({ text: responseText });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Always return JSON for unknown /api/* routes (never HTML)
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  return { app };
}
