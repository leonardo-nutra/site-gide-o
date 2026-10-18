// Generated from the Supabase schema (supabase gen types typescript). Do not edit by hand:
// regenerate after changing the database. See docs/BACKEND.md.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      banners: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          image: string;
          link: string;
          placement: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          image: string;
          link?: string;
          placement?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          image?: string;
          link?: string;
          placement?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          address_cep: string;
          address_number: string;
          address_reference: string;
          address_street: string;
          created_at: string;
          customer_name: string;
          delivery_method: string;
          has_unpriced: boolean;
          id: string;
          items: Json;
          payment_method: string;
          status: string;
          subtotal: number;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          address_cep?: string;
          address_number?: string;
          address_reference?: string;
          address_street?: string;
          created_at?: string;
          customer_name?: string;
          delivery_method?: string;
          has_unpriced?: boolean;
          id?: string;
          items?: Json;
          payment_method?: string;
          status?: string;
          subtotal?: number;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          address_cep?: string;
          address_number?: string;
          address_reference?: string;
          address_street?: string;
          created_at?: string;
          customer_name?: string;
          delivery_method?: string;
          has_unpriced?: boolean;
          id?: string;
          items?: Json;
          payment_method?: string;
          status?: string;
          subtotal?: number;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          active: boolean;
          application_image: string;
          category: string;
          created_at: string;
          detail: string;
          featured: boolean;
          id: string;
          image: string;
          material: string;
          measure: string;
          name: string;
          price: number;
          slug: string;
          sort_order: number;
          source: string | null;
          specs: Json;
          unit: string;
          updated_at: string;
          video: string;
        };
        Insert: {
          active?: boolean;
          application_image?: string;
          category?: string;
          created_at?: string;
          detail?: string;
          featured?: boolean;
          id?: string;
          image?: string;
          material?: string;
          measure?: string;
          name: string;
          price: number;
          slug: string;
          sort_order?: number;
          source?: string | null;
          specs?: Json;
          unit?: string;
          updated_at?: string;
          video?: string;
        };
        Update: {
          active?: boolean;
          application_image?: string;
          category?: string;
          created_at?: string;
          detail?: string;
          featured?: boolean;
          id?: string;
          image?: string;
          material?: string;
          measure?: string;
          name?: string;
          price?: number;
          slug?: string;
          sort_order?: number;
          source?: string | null;
          specs?: Json;
          unit?: string;
          updated_at?: string;
          video?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [];
      };
      site_events: {
        Row: {
          created_at: string;
          device: string | null;
          event: string;
          id: number;
          path: string | null;
          product_id: string | null;
          product_name: string | null;
          query: string | null;
          session_id: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          value: number | null;
        };
        Insert: {
          created_at?: string;
          device?: string | null;
          event: string;
          id?: never;
          path?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          query?: string | null;
          session_id: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          value?: number | null;
        };
        Update: {
          created_at?: string;
          device?: string | null;
          event?: string;
          id?: never;
          path?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          query?: string | null;
          session_id?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          value?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      site_funnel_daily: {
        Args: { days?: number };
        Returns: {
          adders: number;
          cart_openers: number;
          day: string;
          mobile_visitors: number;
          product_viewers: number;
          visitors: number;
          whatsapp_clickers: number;
        }[];
      };
      site_top_products: {
        Args: { days?: number };
        Returns: {
          adds: number;
          product_id: string;
          product_name: string;
          views: number;
        }[];
      };
      site_top_searches: {
        Args: { days?: number };
        Returns: {
          avg_results: number;
          searches: number;
          term: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];
