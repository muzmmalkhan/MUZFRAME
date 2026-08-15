// Mock Firebase for local development when config is missing
export const auth: any = {
  signOut: () => Promise.resolve(),
  onAuthStateChanged: (cb: any) => {
    // We handle local auth in AuthContext manually
    return () => {};
  }
};
export const db: any = {};

