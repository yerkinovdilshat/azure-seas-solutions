// Temporary shim to satisfy legacy imports after removing Supabase.
// This prevents build-time errors while pages are migrated to REST API.
export const supabase: any = new Proxy({}, {
  get() {
    throw new Error('Supabase client is removed. Please migrate this feature to REST API.');
  }
});
