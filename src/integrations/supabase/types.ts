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
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string
          location: string
          logo_url: string | null
          name: string
          posted_by: string | null
          size: string
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry: string
          location: string
          logo_url?: string | null
          name: string
          posted_by?: string | null
          size: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          location?: string
          logo_url?: string | null
          name?: string
          posted_by?: string | null
          size?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          pages: number | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          pages?: number | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          pages?: number | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          admin_notes: string | null
          applied_at: string
          cover_letter: string | null
          created_at: string
          cv_data: Json | null
          email: string
          full_name: string
          id: string
          job_id: string
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          cv_data?: Json | null
          email: string
          full_name: string
          id?: string
          job_id: string
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          cv_data?: Json | null
          email?: string
          full_name?: string
          id?: string
          job_id?: string
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string
          created_at: string
          description: string | null
          id: string
          job_type: string
          location: string
          posted_by: string | null
          requirements: string | null
          salary: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string
          location: string
          posted_by?: string | null
          requirements?: string | null
          salary?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string
          location?: string
          posted_by?: string | null
          requirements?: string | null
          salary?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: string
          application_url: string
          benefits: string[] | null
          created_at: string
          deadline: string
          description: string | null
          field: string
          id: string
          level: string
          location: string
          organization: string
          posted_by: string | null
          requirements: string[] | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: string
          application_url: string
          benefits?: string[] | null
          created_at?: string
          deadline: string
          description?: string | null
          field: string
          id?: string
          level: string
          location: string
          organization: string
          posted_by?: string | null
          requirements?: string[] | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: string
          application_url?: string
          benefits?: string[] | null
          created_at?: string
          deadline?: string
          description?: string | null
          field?: string
          id?: string
          level?: string
          location?: string
          organization?: string
          posted_by?: string | null
          requirements?: string[] | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tender_applications: {
        Row: {
          admin_notes: string | null
          applied_at: string
          bid_amount: number | null
          company_email: string
          company_name: string
          company_phone: string | null
          created_at: string
          id: string
          proposal_document_url: string | null
          proposal_summary: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          tender_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          applied_at?: string
          bid_amount?: number | null
          company_email: string
          company_name: string
          company_phone?: string | null
          created_at?: string
          id?: string
          proposal_document_url?: string | null
          proposal_summary?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tender_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          applied_at?: string
          bid_amount?: number | null
          company_email?: string
          company_name?: string
          company_phone?: string | null
          created_at?: string
          id?: string
          proposal_document_url?: string | null
          proposal_summary?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tender_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_applications_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          bid_guarantee: string
          created_at: string
          deadline: string
          description: string | null
          id: string
          organization: string
          posted_by: string | null
          region: string
          requirements: string | null
          sector: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          bid_guarantee: string
          created_at?: string
          deadline: string
          description?: string | null
          id?: string
          organization: string
          posted_by?: string | null
          region: string
          requirements?: string | null
          sector: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          bid_guarantee?: string
          created_at?: string
          deadline?: string
          description?: string | null
          id?: string
          organization?: string
          posted_by?: string | null
          region?: string
          requirements?: string | null
          sector?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_first_admin: {
        Args: { admin_email: string }
        Returns: undefined
      }
      demote_admin_to_user: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { target_user_id: string }
        Returns: undefined
      }
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
