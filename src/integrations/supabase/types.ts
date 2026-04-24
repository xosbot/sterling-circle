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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_wallets: {
        Row: {
          created_at: string
          id: string
          label: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          alias: string | null
          created_at: string
          email: string
          endorser: string | null
          full_name: string
          holdings: Database["public"]["Enums"]["holdings_range"] | null
          id: string
          jurisdiction: string
          note: string | null
          priority: boolean
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          tier_of_interest:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          alias?: string | null
          created_at?: string
          email: string
          endorser?: string | null
          full_name: string
          holdings?: Database["public"]["Enums"]["holdings_range"] | null
          id?: string
          jurisdiction: string
          note?: string | null
          priority?: boolean
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tier_of_interest?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          alias?: string | null
          created_at?: string
          email?: string
          endorser?: string | null
          full_name?: string
          holdings?: Database["public"]["Enums"]["holdings_range"] | null
          id?: string
          jurisdiction?: string
          note?: string | null
          priority?: boolean
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tier_of_interest?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      contract_calls: {
        Row: {
          address: string
          arguments: Json | null
          caller_wallet: string | null
          chain_kind: Database["public"]["Enums"]["chain_kind"]
          contract_id: string | null
          created_at: string
          error: string | null
          function_name: string
          id: string
          kind: Database["public"]["Enums"]["contract_call_kind"]
          network: string
          result: Json | null
          status: Database["public"]["Enums"]["contract_call_status"]
          tx_hash: string | null
        }
        Insert: {
          address: string
          arguments?: Json | null
          caller_wallet?: string | null
          chain_kind: Database["public"]["Enums"]["chain_kind"]
          contract_id?: string | null
          created_at?: string
          error?: string | null
          function_name: string
          id?: string
          kind: Database["public"]["Enums"]["contract_call_kind"]
          network: string
          result?: Json | null
          status?: Database["public"]["Enums"]["contract_call_status"]
          tx_hash?: string | null
        }
        Update: {
          address?: string
          arguments?: Json | null
          caller_wallet?: string | null
          chain_kind?: Database["public"]["Enums"]["chain_kind"]
          contract_id?: string | null
          created_at?: string
          error?: string | null
          function_name?: string
          id?: string
          kind?: Database["public"]["Enums"]["contract_call_kind"]
          network?: string
          result?: Json | null
          status?: Database["public"]["Enums"]["contract_call_status"]
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_calls_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "smart_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          active: boolean
          application_id: string | null
          approved_at: string
          approved_by: string | null
          created_at: string
          display_name: string | null
          id: string
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string
          wallet_address: string
        }
        Insert: {
          active?: boolean
          application_id?: string | null
          approved_at?: string
          approved_by?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          wallet_address: string
        }
        Update: {
          active?: boolean
          application_id?: string | null
          approved_at?: string
          approved_by?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          contact_email: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["order_kind"]
          notes: string | null
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_name: string
          shipping_postal_code: string | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          wallet_address: string
        }
        Insert: {
          contact_email: string
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["order_kind"]
          notes?: string | null
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_name: string
          shipping_postal_code?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          wallet_address: string
        }
        Update: {
          contact_email?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["order_kind"]
          notes?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_country?: string
          shipping_name?: string
          shipping_postal_code?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      otc_requests: {
        Row: {
          amount: number
          asset: string
          created_at: string
          id: string
          notes: string | null
          price_per_unit: number | null
          quote_currency: string
          side: Database["public"]["Enums"]["otc_side"]
          status: Database["public"]["Enums"]["otc_status"]
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount: number
          asset: string
          created_at?: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          quote_currency?: string
          side: Database["public"]["Enums"]["otc_side"]
          status?: Database["public"]["Enums"]["otc_status"]
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount?: number
          asset?: string
          created_at?: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          quote_currency?: string
          side?: Database["public"]["Enums"]["otc_side"]
          status?: Database["public"]["Enums"]["otc_status"]
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      priority_payments: {
        Row: {
          amount_paid: number
          amount_usd: number
          application_id: string
          asset: string
          chain: string
          created_at: string
          id: string
          refund_tx_hash: string | null
          refunded_at: string | null
          status: Database["public"]["Enums"]["priority_payment_status"]
          tx_hash: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount_paid: number
          amount_usd?: number
          application_id: string
          asset: string
          chain?: string
          created_at?: string
          id?: string
          refund_tx_hash?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["priority_payment_status"]
          tx_hash: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount_paid?: number
          amount_usd?: number
          application_id?: string
          asset?: string
          chain?: string
          created_at?: string
          id?: string
          refund_tx_hash?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["priority_payment_status"]
          tx_hash?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "priority_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_contracts: {
        Row: {
          abi: Json
          address: string
          bytecode: string | null
          chain_kind: Database["public"]["Enums"]["chain_kind"]
          constructor_args: Json | null
          created_at: string
          deployed_by: string | null
          deployment_tx: string | null
          description: string | null
          id: string
          label: string
          network: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          abi: Json
          address: string
          bytecode?: string | null
          chain_kind: Database["public"]["Enums"]["chain_kind"]
          constructor_args?: Json | null
          created_at?: string
          deployed_by?: string | null
          deployment_tx?: string | null
          description?: string | null
          id?: string
          label: string
          network: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          abi?: Json
          address?: string
          bytecode?: string | null
          chain_kind?: Database["public"]["Enums"]["chain_kind"]
          constructor_args?: Json | null
          created_at?: string
          deployed_by?: string | null
          deployment_tx?: string | null
          description?: string | null
          id?: string
          label?: string
          network?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_wallet: { Args: never; Returns: string }
      is_admin_wallet: { Args: { _wallet: string }; Returns: boolean }
      is_member_wallet: { Args: { _wallet: string }; Returns: boolean }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      chain_kind: "evm" | "tron"
      contract_call_kind: "read" | "write" | "deploy"
      contract_call_status: "pending" | "success" | "failed"
      holdings_range: "250k_1m" | "1m_10m" | "10m_100m" | "100m_plus"
      membership_tier: "initiate" | "sovereign" | "noir"
      order_kind: "obsidian_card" | "hardware_wallet"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      otc_side: "buy" | "sell"
      otc_status: "open" | "matched" | "closed" | "cancelled"
      priority_payment_status: "paid" | "refunded" | "consumed"
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
      application_status: ["pending", "approved", "rejected"],
      chain_kind: ["evm", "tron"],
      contract_call_kind: ["read", "write", "deploy"],
      contract_call_status: ["pending", "success", "failed"],
      holdings_range: ["250k_1m", "1m_10m", "10m_100m", "100m_plus"],
      membership_tier: ["initiate", "sovereign", "noir"],
      order_kind: ["obsidian_card", "hardware_wallet"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      otc_side: ["buy", "sell"],
      otc_status: ["open", "matched", "closed", "cancelled"],
      priority_payment_status: ["paid", "refunded", "consumed"],
    },
  },
} as const
