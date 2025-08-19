export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      about_certificates: {
        Row: {
          date: string | null
          file_url: string | null
          id: string
          image_url: string | null
          issuer: string | null
          locale: string
          order: number | null
          title: string
        }
        Insert: {
          date?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          locale: string
          order?: number | null
          title: string
        }
        Update: {
          date?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          locale?: string
          order?: number | null
          title?: string
        }
        Relationships: []
      }
      about_compliance: {
        Row: {
          badge_icon: string | null
          id: string
          link_url: string | null
          locale: string
          order: number | null
          title: string
        }
        Insert: {
          badge_icon?: string | null
          id?: string
          link_url?: string | null
          locale: string
          order?: number | null
          title: string
        }
        Update: {
          badge_icon?: string | null
          id?: string
          link_url?: string | null
          locale?: string
          order?: number | null
          title?: string
        }
        Relationships: []
      }
      about_partners: {
        Row: {
          id: string
          logo: string | null
          name: string
          order: number | null
          website_url: string | null
        }
        Insert: {
          id?: string
          logo?: string | null
          name: string
          order?: number | null
          website_url?: string | null
        }
        Update: {
          id?: string
          logo?: string | null
          name?: string
          order?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      about_story: {
        Row: {
          body_rich: Json | null
          hero_image: string | null
          id: string
          locale: string
          title: string
          updated_at: string | null
        }
        Insert: {
          body_rich?: Json | null
          hero_image?: string | null
          id?: string
          locale: string
          title: string
          updated_at?: string | null
        }
        Update: {
          body_rich?: Json | null
          hero_image?: string | null
          id?: string
          locale?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      about_team: {
        Row: {
          bio: string | null
          id: string
          locale: string
          name: string
          order: number | null
          photo: string | null
          role: string | null
        }
        Insert: {
          bio?: string | null
          id?: string
          locale: string
          name: string
          order?: number | null
          photo?: string | null
          role?: string | null
        }
        Update: {
          bio?: string | null
          id?: string
          locale?: string
          name?: string
          order?: number | null
          photo?: string | null
          role?: string | null
        }
        Relationships: []
      }
      about_timeline: {
        Row: {
          description: string | null
          id: string
          image: string | null
          locale: string
          order: number | null
          title: string
          year: number
        }
        Insert: {
          description?: string | null
          id?: string
          image?: string | null
          locale: string
          order?: number | null
          title: string
          year: number
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          locale?: string
          order?: number | null
          title?: string
          year?: number
        }
        Relationships: []
      }
      about_values: {
        Row: {
          description: string | null
          icon_key: string | null
          id: string
          locale: string
          order: number | null
          title: string
        }
        Insert: {
          description?: string | null
          icon_key?: string | null
          id?: string
          locale: string
          order?: number | null
          title: string
        }
        Update: {
          description?: string | null
          icon_key?: string | null
          id?: string
          locale?: string
          order?: number | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
