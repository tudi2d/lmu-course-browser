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
      course_tree: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          path: string[]
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          path: string[]
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          path?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "course_tree_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          assessment_details: Json | null
          calendar_links: Json | null
          created_at: string | null
          degree_programs: string[] | null
          departments: string[] | null
          description: string | null
          detail_url: string | null
          error_message: string | null
          evaluation_method: string | null
          faculties: string[] | null
          has_content: boolean | null
          id: string
          institution_details: Json | null
          instructor_details: Json | null
          instructors: string[] | null
          language: string | null
          literature: string | null
          long_text: string | null
          max_participants: number | null
          module_details: Json | null
          modules: Json | null
          name: string
          number: string | null
          processing_date: string | null
          professor: string | null
          qr_code: Json | null
          registration_info: string | null
          registration_periods: Json | null
          requirements: string | null
          schedule: Json | null
          scrape_success: boolean | null
          semester: string | null
          short_comment: string | null
          study_programs: Json | null
          sws: number | null
          target_group: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          assessment_details?: Json | null
          calendar_links?: Json | null
          created_at?: string | null
          degree_programs?: string[] | null
          departments?: string[] | null
          description?: string | null
          detail_url?: string | null
          error_message?: string | null
          evaluation_method?: string | null
          faculties?: string[] | null
          has_content?: boolean | null
          id?: string
          institution_details?: Json | null
          instructor_details?: Json | null
          instructors?: string[] | null
          language?: string | null
          literature?: string | null
          long_text?: string | null
          max_participants?: number | null
          module_details?: Json | null
          modules?: Json | null
          name: string
          number?: string | null
          processing_date?: string | null
          professor?: string | null
          qr_code?: Json | null
          registration_info?: string | null
          registration_periods?: Json | null
          requirements?: string | null
          schedule?: Json | null
          scrape_success?: boolean | null
          semester?: string | null
          short_comment?: string | null
          study_programs?: Json | null
          sws?: number | null
          target_group?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          assessment_details?: Json | null
          calendar_links?: Json | null
          created_at?: string | null
          degree_programs?: string[] | null
          departments?: string[] | null
          description?: string | null
          detail_url?: string | null
          error_message?: string | null
          evaluation_method?: string | null
          faculties?: string[] | null
          has_content?: boolean | null
          id?: string
          institution_details?: Json | null
          instructor_details?: Json | null
          instructors?: string[] | null
          language?: string | null
          literature?: string | null
          long_text?: string | null
          max_participants?: number | null
          module_details?: Json | null
          modules?: Json | null
          name?: string
          number?: string | null
          processing_date?: string | null
          professor?: string | null
          qr_code?: Json | null
          registration_info?: string | null
          registration_periods?: Json | null
          requirements?: string | null
          schedule?: Json | null
          scrape_success?: boolean | null
          semester?: string | null
          short_comment?: string | null
          study_programs?: Json | null
          sws?: number | null
          target_group?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      podcasts: {
        Row: {
          audio_url: string | null
          created_at: string | null
          date: string | null
          duration: string | null
          id: string
          script: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          date?: string | null
          duration?: string | null
          id?: string
          script?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          date?: string | null
          duration?: string | null
          id?: string
          script?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "podcasts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
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
