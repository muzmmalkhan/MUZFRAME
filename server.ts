import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://lyybwjyrxldxaodedkqm.supabase.co';
const supabaseKey = 'sb_publishable_qG5-_CYmdrJAbeePUr5J0A_K4VGXuXY';
const supabase = createClient(supabaseUrl, supabaseKey);

const pushToSupabase = async (table: string, data: any) => {
  try {
    const { error } = await supabase.from(table).upsert(data);
    if (error) {
      if (error.message && error.message.includes('fetch failed')) return;
      console.error(`Supabase error on ${table}:`, error.message);
    }
  } catch (err: any) {
    if (err && err.message && err.message.includes('fetch failed')) return;
    console.error(`Failed to push to Supabase table ${table}`, err);
  }
};

const deleteFromSupabase = async (table: string, id: string) => {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      if (error.message && error.message.includes('fetch failed')) return;
      console.error(`Supabase error on ${table}:`, error.message);
    }
  } catch (err: any) {
    if (err && err.message && err.message.includes('fetch failed')) return;
    console.error(`Failed to delete from Supabase table ${table}`, err);
  }
};

// --- Persistent fallback database for local data ---
const DB_FILE = path.join(process.cwd(), 'db.json');

let db = {
  users: [] as any[],
  clients: [] as any[],
  events: [] as any[],
  payments: [] as any[],
  notifications: [] as any[],
  playlists: [] as any[],
  activities: [] as any[],
  blockedDates: [] as any[]
};

try {
  if (fs.existsSync(DB_FILE)) {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    db = { ...db, ...parsed };
    // Ensure all arrays exist even if loading from an old db.json
    db.users = db.users || [];
    db.clients = db.clients || [];
    db.events = db.events || [];
    db.payments = db.payments || [];
    db.notifications = db.notifications || [];
    db.playlists = db.playlists || [];
    db.activities = db.activities || [];
    db.blockedDates = db.blockedDates || [];
    
    // Auto-sync missing clients from existing users (backward compatibility)
    db.users.forEach((user: any) => {
      if (user.role === 'client' && !db.clients.find((c: any) => c.email === user.email)) {
        db.clients.push({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: 'Not provided',
          location: 'Unknown',
          eventName: 'Pending Booking',
          eventType: 'Unknown',
          eventDate: 'Not Scheduled',
          package: 'Pending Selection',
          status: 'active',
          totalAmount: 0,
          paidAmount: 0
        });
      }
    });
  }
} catch (e) {
  console.error('Failed to load DB', e);
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Failed to save DB', e);
  }
};

const loadFromSupabase = async () => {
  try {
    const tables = ['users', 'clients', 'events', 'payments', 'notifications', 'playlists', 'activities'];
    let supabaseHasData = false;

    // Load existing local DB first to preserve data if Supabase is empty
    if (fs.existsSync(DB_FILE)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        db = { ...db, ...parsed };
      } catch(e) {}
    }

    const promises = tables.map(async (table) => {
      try {
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
          if (error.message && error.message.includes('fetch failed')) return;
          console.error(`Error loading ${table} from Supabase:`, error.message);
        } else if (data && data.length > 0) {
          supabaseHasData = true;
          (db as any)[table] = data;
        }
      } catch (err: any) {
        if (err && err.message && err.message.includes('fetch failed')) return;
        console.error(`Error loading ${table} from Supabase:`, err);
      }
    });
    
    await Promise.all(promises);

    // If Supabase was completely empty but we have local data, push it up
    if (!supabaseHasData) {
      console.log('Supabase is empty. Pushing local data to Supabase...');
      for (const table of tables) {
        const localData = (db as any)[table];
        if (localData && localData.length > 0) {
          for (const item of localData) {
            await pushToSupabase(table, item);
          }
        }
      }
    }

    console.log('Database sync with Supabase completed successfully.');
    saveDb();
  } catch (err) {
    console.error('Failed to load from Supabase:', err);
  }
};

// -----------------------------------------

async function startServer() {
  await loadFromSupabase();

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { phone, password, name, location } = req.body;

    if (!phone || !password || password.length < 6) {
      return res.status(400).json({ error: "Phone number and a strong password (min 6 chars) are required" });
    }

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: "A valid full name is required" });
    }

    const existing = db.users.find(u => u.phone === phone || u.email === phone);
    if (existing) {
      return res.status(400).json({ error: "User already exists with this phone number" });
    }
    
    const newUserId = `CLI-${Math.floor(100 + Math.random() * 900)}`;
    const newUser = {
      id: newUserId,
      email: `${phone.replace(/\s/g, '')}@client.muzframe`, // Fallback for email dependencies
      phone: phone,
      password, // In a real app, hash this!
      name: name,
      role: 'client'
    };
    
    db.users.push(newUser);
    pushToSupabase('users', newUser);
    
    const newClient = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      location: location || 'Unknown',
      eventName: 'Pending Booking',
      eventType: 'Unknown',
      eventDate: 'Not Scheduled',
      package: 'Pending Selection',
      status: 'active',
      totalAmount: 0,
      paidAmount: 0
    };
    db.clients.push(newClient);
    pushToSupabase('clients', newClient);

    const activity = {
      id: `ACT-${Date.now()}`,
      clientName: newUser.name,
      type: 'Registration',
      description: `Client registered their account from ${location || 'Unknown'}.`,
      timestamp: new Date().toISOString()
    };
    db.activities.unshift(activity);
    pushToSupabase('activities', activity);

    if (db.activities.length > 100) db.activities.pop();
    
    saveDb();
    res.json({ user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
  });

  app.post("/api/auth/login", (req, res) => {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(400).json({ error: "Phone number and password are required" });
    }

    // Strict hardcoded admin login
    if (phone === 'muzammal.frames' || phone === 'muzmmal.khan99@gmail.com') {
      if (password === 'muzammal.frames') {
        return res.json({ user: { id: 'admin', email: 'muzmmal.khan99@gmail.com', phone: 'muzammal.frames', name: 'Muzammal Khan', role: 'admin' } });
      } else {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
    }

    const user = db.users.find(u => (u.phone === phone || u.email === phone) && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.post("/api/auth/google", async (req, res) => {
    const { email, name, photoURL } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required from Google Auth" });
    }

    // Strict Admin verification via Google
    if (email.toLowerCase() === 'muzmmal.khan99@gmail.com') {
      return res.json({ user: { id: 'admin', email: 'muzmmal.khan99@gmail.com', phone: 'muzammal.frames', name: 'Muzammal Khan', role: 'admin' } });
    }

    let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Register new user from Google
      const newUserId = `CLI-${Math.floor(100 + Math.random() * 900)}`;
      user = {
        id: newUserId,
        email,
        password: Math.random().toString(36).slice(-8), // Random fallback password
        name: name || email.split('@')[0],
        role: 'client'
      };
      db.users.push(user);
      pushToSupabase('users', user);
      
      const newClient = {
        id: newUserId,
        name: user.name,
        email: user.email,
        phone: 'Not provided',
        location: 'Unknown',
        eventName: 'Pending Booking',
        eventType: 'Unknown',
        eventDate: 'Not Scheduled',
        package: 'Pending Selection',
        status: 'active',
        totalAmount: 0,
        paidAmount: 0
      };
      db.clients.push(newClient);
      pushToSupabase('clients', newClient);

      const activity = {
        id: `ACT-${Date.now()}`,
        clientName: user.name,
        type: 'Registration',
        description: `Client registered via Google.`,
        timestamp: new Date().toISOString()
      };
      db.activities.unshift(activity);
      pushToSupabase('activities', activity);
      if (db.activities.length > 100) db.activities.pop();
      
      saveDb();
    }
    
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  // Data Routes
  app.get("/api/blocked-dates", (req, res) => res.json(db.blockedDates));
  app.post("/api/blocked-dates", (req, res) => {
    const { date, reason } = req.body;
    if (!date) return res.status(400).json({ error: "Date is required" });
    const id = `BLK-${Date.now()}`;
    const newBlockedDate = { id, date, reason: reason || 'Admin Blocked' };
    db.blockedDates.push(newBlockedDate);
    saveDb();
    res.json(newBlockedDate);
  });
  app.delete("/api/blocked-dates/:id", (req, res) => {
    db.blockedDates = db.blockedDates.filter(b => b.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  app.get("/api/clients", (req, res) => res.json(db.clients));
  app.post("/api/clients", async (req, res) => {
    db.clients.push(req.body);
    saveDb();
    pushToSupabase('clients', req.body);
    res.json(req.body);
  });
  app.delete("/api/clients/:id", async (req, res) => {
    db.clients = db.clients.filter(c => c.id !== req.params.id);
    saveDb();
    deleteFromSupabase('clients', req.params.id);
    res.json({ success: true });
  });
  app.put("/api/clients/:id", async (req, res) => {
    db.clients = db.clients.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
    saveDb();
    const updated = db.clients.find(c => c.id === req.params.id);
    if (updated) pushToSupabase('clients', updated);
    res.json({ success: true });
  });

  app.get("/api/events", (req, res) => res.json(db.events));
  app.post("/api/events", async (req, res) => {
    db.events.push(req.body);
    saveDb();
    pushToSupabase('events', req.body);
    res.json(req.body);
  });
  app.put("/api/events/:id", async (req, res) => {
    db.events = db.events.map(e => e.id === req.params.id ? { ...e, ...req.body } : e);
    saveDb();
    const updated = db.events.find(e => e.id === req.params.id);
    if (updated) pushToSupabase('events', updated);
    res.json({ success: true });
  });

  app.get("/api/payments", (req, res) => res.json(db.payments));
  app.put("/api/payments/:id", async (req, res) => {
    db.payments = db.payments.map(p => p.id === req.params.id ? { ...p, ...req.body } : p);
    saveDb();
    const updated = db.payments.find(p => p.id === req.params.id);
    if (updated) {
      const { eventName, ...supabasePayment } = updated;
      pushToSupabase('payments', supabasePayment);
    }
    res.json({ success: true });
  });

  app.post("/api/payments", async (req, res) => {
    db.payments.push(req.body);
    saveDb();
    const { eventName, ...supabasePayment } = req.body;
    pushToSupabase('payments', supabasePayment);
    res.json(req.body);
  });

  app.get("/api/notifications", (req, res) => res.json(db.notifications));
  app.post("/api/notifications", async (req, res) => {
    db.notifications.push(req.body);
    saveDb();
    pushToSupabase('notifications', req.body);
    res.json(req.body);
  });

  app.get("/api/playlists", (req, res) => res.json(db.playlists));
  app.post("/api/playlists", async (req, res) => {
    if (!req.body.id) req.body.id = req.body.clientId;
    const idx = db.playlists.findIndex(p => p.clientId === req.body.clientId);
    if (idx >= 0) db.playlists[idx] = req.body;
    else db.playlists.push(req.body);

    pushToSupabase('playlists', req.body);

    const activity = {
      id: `ACT-${Date.now()}`,
      clientName: req.body.clientName || 'Admin',
      type: 'Song Selection',
      description: `Playlist updated. Status: ${req.body.status}.`,
      timestamp: new Date().toISOString()
    };
    db.activities.unshift(activity);
    pushToSupabase('activities', activity);

    if (db.activities.length > 100) db.activities.pop();

    saveDb();
    res.json(req.body);
  });

  app.get("/api/activities", (req, res) => res.json(db.activities));
  app.post("/api/activities", async (req, res) => {
    const activity = {
      ...req.body,
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    db.activities.unshift(activity);
    pushToSupabase('activities', activity);
    // Keep last 100
    if (db.activities.length > 100) db.activities.pop();
    saveDb();
    res.json(req.body);
  });

  // AI Chatbot using Gemini (with OpenRouter fallback)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
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

      // Strategy 1: Try Gemini API directly
      const geminiPromise = (async () => {
        if (!geminiKey) throw new Error("No Gemini key");
        
        // Add timeout to Gemini to prevent infinite hangs
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          const ai = new GoogleGenAI({ 
            apiKey: geminiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });
          const result = await ai.models.generateContent({ 
            model: 'gemini-3.5-flash',
            contents: message,
            config: {
              systemInstruction: systemPrompt 
            }
          });
          if (!result.text) throw new Error("Gemini returned empty text");
          return result.text;
        } finally {
          clearTimeout(timeoutId);
        }
      })();

      // Strategy 2: Try OpenRouter
      const openRouterPromise = (async () => {
        if (!openRouterKey) throw new Error("No OpenRouter key");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        try {
          const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openRouterKey}`,
              "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
              "X-Title": "MuzFrame Studio",
              "Content-Type": "application/json"
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
              ]
            })
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
        responseText = await Promise.any([
          geminiPromise,
          openRouterPromise
        ]);
      } catch (e: any) {
        if (e.name === 'AggregateError') {
          console.error("All AI services failed. See details below:");
          // @ts-ignore
          e.errors.forEach((err) => console.error(err));
        } else {
          console.error("AI service error:", e);
        }
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
