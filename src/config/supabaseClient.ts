// Mock Supabase client (temporary)
// Will be replaced with real Supabase credentials

export const supabase = {
  from: (table: string) => ({
    select: async () => ({
      data: [],
      error: null
    })
  })
};
