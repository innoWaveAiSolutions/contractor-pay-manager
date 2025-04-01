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
      expenses: {
        Row: {
          amount: number | null
          category: string | null
          comment: string | null
          date_of_expense: string | null
          description: string | null
          id: number
          line_item_id: number | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          comment?: string | null
          date_of_expense?: string | null
          description?: string | null
          id?: number
          line_item_id?: number | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          comment?: string | null
          date_of_expense?: string | null
          description?: string | null
          id?: number
          line_item_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_line_item_id_fkey"
            columns: ["line_item_id"]
            isOneToOne: false
            referencedRelation: "line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      line_items: {
        Row: {
          balance_to_finish: number | null
          description_of_work: string | null
          from_previous_application: number | null
          id: number
          item_number: number | null
          materials_presently_stored: number | null
          pay_application_id: number | null
          percent_complete: number | null
          retainage: number | null
          scheduled_value: number | null
          this_period: number | null
          total_completed_and_stored: number | null
        }
        Insert: {
          balance_to_finish?: number | null
          description_of_work?: string | null
          from_previous_application?: number | null
          id?: number
          item_number?: number | null
          materials_presently_stored?: number | null
          pay_application_id?: number | null
          percent_complete?: number | null
          retainage?: number | null
          scheduled_value?: number | null
          this_period?: number | null
          total_completed_and_stored?: number | null
        }
        Update: {
          balance_to_finish?: number | null
          description_of_work?: string | null
          from_previous_application?: number | null
          id?: number
          item_number?: number | null
          materials_presently_stored?: number | null
          pay_application_id?: number | null
          percent_complete?: number | null
          retainage?: number | null
          scheduled_value?: number | null
          this_period?: number | null
          total_completed_and_stored?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "line_items_pay_application_id_fkey"
            columns: ["pay_application_id"]
            isOneToOne: false
            referencedRelation: "pay_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          allow_pm_project_creation: boolean | null
          backup_director_id: number | null
          created_at: string | null
          created_by: number | null
          id: number
          name: string
          subscription_plan: string | null
          updated_at: string | null
        }
        Insert: {
          allow_pm_project_creation?: boolean | null
          backup_director_id?: number | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          name: string
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_pm_project_creation?: boolean | null
          backup_director_id?: number | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          name?: string
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_backup_director_id_fkey"
            columns: ["backup_director_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pay_applications: {
        Row: {
          contractor_id: number | null
          current_reviewer_id: number | null
          finalized_at: string | null
          id: number
          project_id: number | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          contractor_id?: number | null
          current_reviewer_id?: number | null
          finalized_at?: string | null
          id?: number
          project_id?: number | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          contractor_id?: number | null
          current_reviewer_id?: number | null
          finalized_at?: string | null
          id?: number
          project_id?: number | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pay_applications_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pay_applications_current_reviewer_id_fkey"
            columns: ["current_reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pay_applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_contractors: {
        Row: {
          contractor_id: number | null
          id: number
          project_id: number | null
        }
        Insert: {
          contractor_id?: number | null
          id?: number
          project_id?: number | null
        }
        Update: {
          contractor_id?: number | null
          id?: number
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_contractors_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_contractors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reviewers: {
        Row: {
          id: number
          project_id: number | null
          review_order: number
          reviewer_id: number | null
        }
        Insert: {
          id?: number
          project_id?: number | null
          review_order: number
          reviewer_id?: number | null
        }
        Update: {
          id?: number
          project_id?: number | null
          review_order?: number
          reviewer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reviewers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_reviewers_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_pm_id: number | null
          created_at: string | null
          created_by: number | null
          id: number
          name: string
          organization_id: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_pm_id?: number | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          name: string
          organization_id?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_pm_id?: number | null
          created_at?: string | null
          created_by?: number | null
          id?: number
          name?: string
          organization_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_pm_id_fkey"
            columns: ["assigned_pm_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          expense_id: number | null
          file_url: string | null
          id: number
          uploaded_at: string | null
        }
        Insert: {
          expense_id?: number | null
          file_url?: string | null
          id?: number
          uploaded_at?: string | null
        }
        Update: {
          expense_id?: number | null
          file_url?: string | null
          id?: number
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          is_active: boolean | null
          last_name: string | null
          organization_id: number | null
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: number
          is_active?: boolean | null
          last_name?: string | null
          organization_id?: number | null
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: number
          is_active?: boolean | null
          last_name?: string | null
          organization_id?: number | null
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
