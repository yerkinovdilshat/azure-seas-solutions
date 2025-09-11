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
      about_blocks: {
        Row: {
          block_key: string
          content_en: string | null
          content_kk: string | null
          content_ru: string | null
          gallery_images: string[] | null
          id: string
          published_at: string | null
          status: string | null
          title_en: string | null
          title_kk: string | null
          title_ru: string | null
          updated_at: string | null
        }
        Insert: {
          block_key: string
          content_en?: string | null
          content_kk?: string | null
          content_ru?: string | null
          gallery_images?: string[] | null
          id?: string
          published_at?: string | null
          status?: string | null
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
          updated_at?: string | null
        }
        Update: {
          block_key?: string
          content_en?: string | null
          content_kk?: string | null
          content_ru?: string | null
          gallery_images?: string[] | null
          id?: string
          published_at?: string | null
          status?: string | null
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      about_certificates: {
        Row: {
          date: string | null
          description_en: string | null
          description_kk: string | null
          description_ru: string | null
          file_url: string | null
          id: string
          image_url: string | null
          issuer: string | null
          issuer_en: string | null
          issuer_kk: string | null
          issuer_ru: string | null
          locale: string
          order: number | null
          published_at: string | null
          status: string | null
          title: string
          title_en: string | null
          title_kk: string | null
          title_ru: string | null
        }
        Insert: {
          date?: string | null
          description_en?: string | null
          description_kk?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          issuer_en?: string | null
          issuer_kk?: string | null
          issuer_ru?: string | null
          locale: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title: string
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
        }
        Update: {
          date?: string | null
          description_en?: string | null
          description_kk?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          issuer_en?: string | null
          issuer_kk?: string | null
          issuer_ru?: string | null
          locale?: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title?: string
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
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
          published_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          badge_icon?: string | null
          id?: string
          link_url?: string | null
          locale: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          badge_icon?: string | null
          id?: string
          link_url?: string | null
          locale?: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      about_distribution: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_kk: string | null
          description_ru: string | null
          file_url: string | null
          id: string
          image_url: string | null
          order_index: number | null
          published_at: string | null
          status: string | null
          title_en: string | null
          title_kk: string | null
          title_ru: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_kk?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          order_index?: number | null
          published_at?: string | null
          status?: string | null
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_kk?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          order_index?: number | null
          published_at?: string | null
          status?: string | null
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      about_licenses: {
        Row: {
          created_at: string | null
          date: string | null
          description_en: string | null
          description_kk: string | null
          description_ru: string | null
          file_url: string | null
          id: string
          image_url: string | null
          issuer: string | null
          issuer_en: string | null
          issuer_kk: string | null
          issuer_ru: string | null
          locale: string
          order: number | null
          published_at: string | null
          status: string | null
          title: string
          title_en: string | null
          title_kk: string | null
          title_ru: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description_en?: string | null
          description_kk?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          issuer_en?: string | null
          issuer_kk?: string | null
          issuer_ru?: string | null
          locale: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title: string
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description_en?: string | null
          description_kk?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          issuer_en?: string | null
          issuer_kk?: string | null
          issuer_ru?: string | null
          locale?: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title?: string
          title_en?: string | null
          title_kk?: string | null
          title_ru?: string | null
        }
        Relationships: []
      }
      about_partners: {
        Row: {
          id: string
          logo: string | null
          name: string
          order: number | null
          published_at: string | null
          status: string | null
          website_url: string | null
        }
        Insert: {
          id?: string
          logo?: string | null
          name: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          website_url?: string | null
        }
        Update: {
          id?: string
          logo?: string | null
          name?: string
          order?: number | null
          published_at?: string | null
          status?: string | null
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
          published_at: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body_rich?: Json | null
          hero_image?: string | null
          id?: string
          locale: string
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body_rich?: Json | null
          hero_image?: string | null
          id?: string
          locale?: string
          published_at?: string | null
          status?: string | null
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
          published_at: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          bio?: string | null
          id?: string
          locale: string
          name: string
          order?: number | null
          photo?: string | null
          published_at?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          bio?: string | null
          id?: string
          locale?: string
          name?: string
          order?: number | null
          photo?: string | null
          published_at?: string | null
          role?: string | null
          status?: string | null
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
          published_at: string | null
          status: string | null
          title: string
          year: number
        }
        Insert: {
          description?: string | null
          id?: string
          image?: string | null
          locale: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title: string
          year: number
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          locale?: string
          order?: number | null
          published_at?: string | null
          status?: string | null
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
          published_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          description?: string | null
          icon_key?: string | null
          id?: string
          locale: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          description?: string | null
          icon_key?: string | null
          id?: string
          locale?: string
          order?: number | null
          published_at?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      catalog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_featured: boolean | null
          locale: string
          name: string
          order: number | null
          parent_id: string | null
          published_at: string | null
          slug: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          locale: string
          name: string
          order?: number | null
          parent_id?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          locale?: string
          name?: string
          order?: number | null
          parent_id?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_products: {
        Row: {
          category_id: string | null
          content_rich: Json | null
          created_at: string
          description: string | null
          featured_image: string | null
          gallery_images: string[] | null
          id: string
          is_ctkz: boolean
          is_featured: boolean | null
          locale: string
          manufacturer: string | null
          order: number | null
          pdf_files: string[] | null
          published_at: string | null
          sku: string | null
          slug: string
          specifications: Json | null
          status: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          content_rich?: Json | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_ctkz?: boolean
          is_featured?: boolean | null
          locale: string
          manufacturer?: string | null
          order?: number | null
          pdf_files?: string[] | null
          published_at?: string | null
          sku?: string | null
          slug: string
          specifications?: Json | null
          status?: string | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          content_rich?: Json | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_ctkz?: boolean
          is_featured?: boolean | null
          locale?: string
          manufacturer?: string | null
          order?: number | null
          pdf_files?: string[] | null
          published_at?: string | null
          sku?: string | null
          slug?: string
          specifications?: Json | null
          status?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          created_at: string
          id: string
          message: string
          meta: Json | null
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          meta?: Json | null
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          meta?: Json | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          additional_info: Json | null
          address: string
          company_name: string
          email: string
          id: string
          locale: string
          map_link: string | null
          phone: string
          published_at: string | null
          status: string | null
          updated_at: string
          working_hours: string
        }
        Insert: {
          additional_info?: Json | null
          address: string
          company_name: string
          email: string
          id?: string
          locale: string
          map_link?: string | null
          phone: string
          published_at?: string | null
          status?: string | null
          updated_at?: string
          working_hours: string
        }
        Update: {
          additional_info?: Json | null
          address?: string
          company_name?: string
          email?: string
          id?: string
          locale?: string
          map_link?: string | null
          phone?: string
          published_at?: string | null
          status?: string | null
          updated_at?: string
          working_hours?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content_rich: Json | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          gallery_images: string[] | null
          id: string
          is_featured: boolean | null
          locale: string
          order: number | null
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content_rich?: Json | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          locale: string
          order?: number | null
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content_rich?: Json | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          locale?: string
          order?: number | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_name: string | null
          content_rich: Json | null
          created_at: string
          description: string | null
          featured_image: string | null
          gallery_images: string[] | null
          id: string
          is_featured: boolean | null
          locale: string
          order: number | null
          project_date: string | null
          project_location: string | null
          project_status: string | null
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          client_name?: string | null
          content_rich?: Json | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          locale: string
          order?: number | null
          project_date?: string | null
          project_location?: string | null
          project_status?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          client_name?: string | null
          content_rich?: Json | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          locale?: string
          order?: number | null
          project_date?: string | null
          project_location?: string | null
          project_status?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          content_rich: Json | null
          created_at: string
          description: string | null
          featured_image: string | null
          gallery_images: string[] | null
          icon_key: string | null
          id: string
          is_featured: boolean | null
          locale: string
          order: number | null
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content_rich?: Json | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          icon_key?: string | null
          id?: string
          is_featured?: boolean | null
          locale: string
          order?: number | null
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content_rich?: Json | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          icon_key?: string | null
          id?: string
          is_featured?: boolean | null
          locale?: string
          order?: number | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          content_max_width_px: number | null
          created_at: string | null
          cta1_link: string | null
          cta1_text_en: string | null
          cta1_text_kk: string | null
          cta1_text_ru: string | null
          cta2_link: string | null
          cta2_text_en: string | null
          cta2_text_kk: string | null
          cta2_text_ru: string | null
          hero_bg_url: string | null
          hero_min_height_vh: number | null
          hero_overlay_opacity: number | null
          hero_subtitle_en: string | null
          hero_subtitle_kk: string | null
          hero_subtitle_ru: string | null
          hero_title_en: string | null
          hero_title_kk: string | null
          hero_title_ru: string | null
          hero_top_padding_px: number | null
          id: string
          locale_default: string | null
          updated_at: string | null
        }
        Insert: {
          content_max_width_px?: number | null
          created_at?: string | null
          cta1_link?: string | null
          cta1_text_en?: string | null
          cta1_text_kk?: string | null
          cta1_text_ru?: string | null
          cta2_link?: string | null
          cta2_text_en?: string | null
          cta2_text_kk?: string | null
          cta2_text_ru?: string | null
          hero_bg_url?: string | null
          hero_min_height_vh?: number | null
          hero_overlay_opacity?: number | null
          hero_subtitle_en?: string | null
          hero_subtitle_kk?: string | null
          hero_subtitle_ru?: string | null
          hero_title_en?: string | null
          hero_title_kk?: string | null
          hero_title_ru?: string | null
          hero_top_padding_px?: number | null
          id?: string
          locale_default?: string | null
          updated_at?: string | null
        }
        Update: {
          content_max_width_px?: number | null
          created_at?: string | null
          cta1_link?: string | null
          cta1_text_en?: string | null
          cta1_text_kk?: string | null
          cta1_text_ru?: string | null
          cta2_link?: string | null
          cta2_text_en?: string | null
          cta2_text_kk?: string | null
          cta2_text_ru?: string | null
          hero_bg_url?: string | null
          hero_min_height_vh?: number | null
          hero_overlay_opacity?: number | null
          hero_subtitle_en?: string | null
          hero_subtitle_kk?: string | null
          hero_subtitle_ru?: string | null
          hero_title_en?: string | null
          hero_title_kk?: string | null
          hero_title_ru?: string | null
          hero_top_padding_px?: number | null
          id?: string
          locale_default?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
