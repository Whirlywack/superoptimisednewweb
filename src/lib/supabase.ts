import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      question_responses: {
        Row: {
          id: string;
          question_id: string;
          voter_token_id: string | null;
          user_id: string | null;
          response_data: unknown;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          voter_token_id?: string | null;
          user_id?: string | null;
          response_data: unknown;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          voter_token_id?: string | null;
          user_id?: string | null;
          response_data?: unknown;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      live_stats: {
        Row: {
          id: string;
          stat_key: string;
          stat_value: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          stat_key: string;
          stat_value: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          stat_key?: string;
          stat_value?: number;
          last_updated?: string;
        };
      };
    };
  };
};
