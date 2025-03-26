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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
