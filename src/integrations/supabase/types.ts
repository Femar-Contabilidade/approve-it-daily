export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content_items: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      custom_api_integrations: {
        Row: {
          config: Json | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          config?: Json | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          config?: Json | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      integration_evolution_api: {
        Row: {
          api_key: string | null
          api_url: string | null
          enabled: boolean | null
          id: string
        }
        Insert: {
          api_key?: string | null
          api_url?: string | null
          enabled?: boolean | null
          id?: string
        }
        Update: {
          api_key?: string | null
          api_url?: string | null
          enabled?: boolean | null
          id?: string
        }
        Relationships: []
      }
      integration_google_auth: {
        Row: {
          client_id: string | null
          client_secret: string | null
          enabled: boolean | null
          id: string
        }
        Insert: {
          client_id?: string | null
          client_secret?: string | null
          enabled?: boolean | null
          id?: string
        }
        Update: {
          client_id?: string | null
          client_secret?: string | null
          enabled?: boolean | null
          id?: string
        }
        Relationships: []
      }
      integration_mysql: {
        Row: {
          database: string | null
          enabled: boolean | null
          host: string | null
          id: string
          password: string | null
          port: number | null
          username: string | null
        }
        Insert: {
          database?: string | null
          enabled?: boolean | null
          host?: string | null
          id?: string
          password?: string | null
          port?: number | null
          username?: string | null
        }
        Update: {
          database?: string | null
          enabled?: boolean | null
          host?: string | null
          id?: string
          password?: string | null
          port?: number | null
          username?: string | null
        }
        Relationships: []
      }
      integration_notes: {
        Row: {
          api_key: string | null
          api_url: string | null
          enabled: boolean | null
          id: string
        }
        Insert: {
          api_key?: string | null
          api_url?: string | null
          enabled?: boolean | null
          id?: string
        }
        Update: {
          api_key?: string | null
          api_url?: string | null
          enabled?: boolean | null
          id?: string
        }
        Relationships: []
      }
      integration_supabase: {
        Row: {
          anon_key: string | null
          enabled: boolean | null
          id: string
          project_url: string | null
          service_role_key: string | null
        }
        Insert: {
          anon_key?: string | null
          enabled?: boolean | null
          id?: string
          project_url?: string | null
          service_role_key?: string | null
        }
        Update: {
          anon_key?: string | null
          enabled?: boolean | null
          id?: string
          project_url?: string | null
          service_role_key?: string | null
        }
        Relationships: []
      }
      integration_webhooks: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          label: string
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          label: string
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          label?: string
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      spreadsheet_columns: {
        Row: {
          column_letter: string
          column_name: string
          config_id: string
          created_at: string
          data_path: string | null
          display_order: number | null
          field_type: string
          id: string
          is_required: boolean | null
          updated_at: string
        }
        Insert: {
          column_letter: string
          column_name: string
          config_id: string
          created_at?: string
          data_path?: string | null
          display_order?: number | null
          field_type: string
          id?: string
          is_required?: boolean | null
          updated_at?: string
        }
        Update: {
          column_letter?: string
          column_name?: string
          config_id?: string
          created_at?: string
          data_path?: string | null
          display_order?: number | null
          field_type?: string
          id?: string
          is_required?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spreadsheet_columns_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "spreadsheet_config"
            referencedColumns: ["id"]
          },
        ]
      }
      spreadsheet_config: {
        Row: {
          approved_tab: string | null
          created_at: string
          evaluation_tab: string | null
          google_client_id: string | null
          google_client_secret: string | null
          id: string
          logo_url: string | null
          rejected_tab: string | null
          requires_google_auth: boolean | null
          spreadsheet_url: string
          updated_at: string
        }
        Insert: {
          approved_tab?: string | null
          created_at?: string
          evaluation_tab?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          id?: string
          logo_url?: string | null
          rejected_tab?: string | null
          requires_google_auth?: boolean | null
          spreadsheet_url: string
          updated_at?: string
        }
        Update: {
          approved_tab?: string | null
          created_at?: string
          evaluation_tab?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          id?: string
          logo_url?: string | null
          rejected_tab?: string | null
          requires_google_auth?: boolean | null
          spreadsheet_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
          user_type: string | null
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          updated_at?: string
          user_type?: string | null
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
          user_type?: string | null
          username?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
