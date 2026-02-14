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
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      t_comment_comm: {
        Row: {
          content_comm: string;
          createdat_comm: string | null;
          id_comm: string;
          id_trip: string | null;
          id_user_author: string | null;
        };
        Insert: {
          content_comm: string;
          createdat_comm?: string | null;
          id_comm?: string;
          id_trip?: string | null;
          id_user_author?: string | null;
        };
        Update: {
          content_comm?: string;
          createdat_comm?: string | null;
          id_comm?: string;
          id_trip?: string | null;
          id_user_author?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_comm_author";
            columns: ["id_user_author"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
          {
            foreignKeyName: "fk_comm_trip";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
        ];
      };
      t_expense_expe: {
        Row: {
          amount_expe: number;
          created_by: string | null;
          createdat_expe: string | null;
          currency_expe: string;
          id_expe: string;
          id_trip: string;
          title_expe: string;
        };
        Insert: {
          amount_expe: number;
          created_by?: string | null;
          createdat_expe?: string | null;
          currency_expe: string;
          id_expe?: string;
          id_trip: string;
          title_expe: string;
        };
        Update: {
          amount_expe?: number;
          created_by?: string | null;
          createdat_expe?: string | null;
          currency_expe?: string;
          id_expe?: string;
          id_trip?: string;
          title_expe?: string;
        };
        Relationships: [
          {
            foreignKeyName: "t_expense_expe_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
          {
            foreignKeyName: "t_expense_expe_id_trip_fkey";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
        ];
      };
      t_expense_payer_expa: {
        Row: {
          id_expa: string;
          id_expe: string | null;
          id_user: string | null;
          payeramount_expa: number | null;
        };
        Insert: {
          id_expa?: string;
          id_expe?: string | null;
          id_user?: string | null;
          payeramount_expa?: number | null;
        };
        Update: {
          id_expa?: string;
          id_expe?: string | null;
          id_user?: string | null;
          payeramount_expa?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_expa_expe";
            columns: ["id_expe"];
            isOneToOne: false;
            referencedRelation: "t_expense_expe";
            referencedColumns: ["id_expe"];
          },
          {
            foreignKeyName: "fk_expa_user";
            columns: ["id_user"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
        ];
      };
      t_expense_share_exsh: {
        Row: {
          id_expe: string | null;
          id_exsh: string;
          id_user: string | null;
          shareamount_exsh: number | null;
        };
        Insert: {
          id_expe?: string | null;
          id_exsh?: string;
          id_user?: string | null;
          shareamount_exsh?: number | null;
        };
        Update: {
          id_expe?: string | null;
          id_exsh?: string;
          id_user?: string | null;
          shareamount_exsh?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_exsh_expe";
            columns: ["id_expe"];
            isOneToOne: false;
            referencedRelation: "t_expense_expe";
            referencedColumns: ["id_expe"];
          },
          {
            foreignKeyName: "fk_exsh_user";
            columns: ["id_user"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
        ];
      };
      t_file_file: {
        Row: {
          filename_file: string;
          id_file: string;
          id_trip: string | null;
          id_user_uploader: string | null;
          storagepath_file: string;
          uploadedat_file: string | null;
        };
        Insert: {
          filename_file: string;
          id_file?: string;
          id_trip?: string | null;
          id_user_uploader?: string | null;
          storagepath_file: string;
          uploadedat_file?: string | null;
        };
        Update: {
          filename_file?: string;
          id_file?: string;
          id_trip?: string | null;
          id_user_uploader?: string | null;
          storagepath_file?: string;
          uploadedat_file?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_file_trip";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
          {
            foreignKeyName: "fk_file_uploader";
            columns: ["id_user_uploader"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
        ];
      };
      t_itinerary_item_itit: {
        Row: {
          cost_itit: number | null;
          created_at_itit: string | null;
          date_itit: string | null;
          id_itit: string;
          id_loca: string | null;
          id_trip: string;
          location_itit: string | null;
          position_itit: number | null;
          time_itit: string | null;
          title_itit: string;
        };
        Insert: {
          cost_itit?: number | null;
          created_at_itit?: string | null;
          date_itit?: string | null;
          id_itit?: string;
          id_loca?: string | null;
          id_trip: string;
          location_itit?: string | null;
          position_itit?: number | null;
          time_itit?: string | null;
          title_itit: string;
        };
        Update: {
          cost_itit?: number | null;
          created_at_itit?: string | null;
          date_itit?: string | null;
          id_itit?: string;
          id_loca?: string | null;
          id_trip?: string;
          location_itit?: string | null;
          position_itit?: number | null;
          time_itit?: string | null;
          title_itit?: string;
        };
        Relationships: [
          {
            foreignKeyName: "t_itinerary_item_itit_id_loca_fkey";
            columns: ["id_loca"];
            isOneToOne: false;
            referencedRelation: "t_location_loca";
            referencedColumns: ["id_loca"];
          },
          {
            foreignKeyName: "t_itinerary_item_itit_id_trip_fkey";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
        ];
      };
      t_location_loca: {
        Row: {
          coordinates: Json | null;
          createdat_loca: string | null;
          id_loca: string;
          id_trip: string | null;
          name_loca: string | null;
        };
        Insert: {
          coordinates?: Json | null;
          createdat_loca?: string | null;
          id_loca?: string;
          id_trip?: string | null;
          name_loca?: string | null;
        };
        Update: {
          coordinates?: Json | null;
          createdat_loca?: string | null;
          id_loca?: string;
          id_trip?: string | null;
          name_loca?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "t_location_loca_id_trip_fkey";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
        ];
      };
      t_message_mssg: {
        Row: {
          content_mssg: string;
          created_at_mssg: string | null;
          id_mssg: string;
          id_trip: string;
          id_user: string;
        };
        Insert: {
          content_mssg: string;
          created_at_mssg?: string | null;
          id_mssg?: string;
          id_trip: string;
          id_user: string;
        };
        Update: {
          content_mssg?: string;
          created_at_mssg?: string | null;
          id_mssg?: string;
          id_trip?: string;
          id_user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "t_message_msg_id_trip_fkey";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
          {
            foreignKeyName: "t_message_mssg_id_user_fkey";
            columns: ["id_user"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
        ];
      };
      t_route_rout: {
        Row: {
          createdat_rout: string | null;
          id_loca_destination: string | null;
          id_loca_origin: string | null;
          id_rout: string;
          id_trip: string;
          routdata_rout: Json;
        };
        Insert: {
          createdat_rout?: string | null;
          id_loca_destination?: string | null;
          id_loca_origin?: string | null;
          id_rout?: string;
          id_trip: string;
          routdata_rout: Json;
        };
        Update: {
          createdat_rout?: string | null;
          id_loca_destination?: string | null;
          id_loca_origin?: string | null;
          id_rout?: string;
          id_trip?: string;
          routdata_rout?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "t_route_rout_id_trip_fkey";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
        ];
      };
      t_settlements_setl: {
        Row: {
          amount_setl: number | null;
          id_setl: string;
          id_trip: string | null;
          id_user_creditor: string | null;
          id_user_debtor: string | null;
          settledate_setl: string | null;
        };
        Insert: {
          amount_setl?: number | null;
          id_setl?: string;
          id_trip?: string | null;
          id_user_creditor?: string | null;
          id_user_debtor?: string | null;
          settledate_setl?: string | null;
        };
        Update: {
          amount_setl?: number | null;
          id_setl?: string;
          id_trip?: string | null;
          id_user_creditor?: string | null;
          id_user_debtor?: string | null;
          settledate_setl?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_setl_creditor";
            columns: ["id_user_creditor"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
          {
            foreignKeyName: "fk_setl_debtor";
            columns: ["id_user_debtor"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
          {
            foreignKeyName: "fk_setl_trip";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
        ];
      };
      t_trip_member_trme: {
        Row: {
          id_trip: string;
          id_trme: string;
          id_user: string;
          joinedat_trme: string | null;
          memberrole_trme: string | null;
        };
        Insert: {
          id_trip: string;
          id_trme?: string;
          id_user: string;
          joinedat_trme?: string | null;
          memberrole_trme?: string | null;
        };
        Update: {
          id_trip?: string;
          id_trme?: string;
          id_user?: string;
          joinedat_trme?: string | null;
          memberrole_trme?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "t_trip_member_trme_id_trip_fkey";
            columns: ["id_trip"];
            isOneToOne: false;
            referencedRelation: "t_trip_trip";
            referencedColumns: ["id_trip"];
          },
          {
            foreignKeyName: "t_trip_member_trme_id_user_fkey";
            columns: ["id_user"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
        ];
      };
      t_trip_trip: {
        Row: {
          createdat_trip: string | null;
          description_trip: string | null;
          enddate_trip: string;
          id_trip: string;
          id_user_creator: string;
          startdate_trip: string;
          title_trip: string;
        };
        Insert: {
          createdat_trip?: string | null;
          description_trip?: string | null;
          enddate_trip: string;
          id_trip?: string;
          id_user_creator: string;
          startdate_trip: string;
          title_trip: string;
        };
        Update: {
          createdat_trip?: string | null;
          description_trip?: string | null;
          enddate_trip?: string;
          id_trip?: string;
          id_user_creator?: string;
          startdate_trip?: string;
          title_trip?: string;
        };
        Relationships: [
          {
            foreignKeyName: "t_trip_trip_id_user_creator_fkey";
            columns: ["id_user_creator"];
            isOneToOne: false;
            referencedRelation: "t_user_user";
            referencedColumns: ["id_user"];
          },
        ];
      };
      t_user_user: {
        Row: {
          displayname_user: string;
          id_user: string;
          useravatar_user: string | null;
          usercreatedat_user: string | null;
          username_user: string;
        };
        Insert: {
          displayname_user: string;
          id_user?: string;
          useravatar_user?: string | null;
          usercreatedat_user?: string | null;
          username_user: string;
        };
        Update: {
          displayname_user?: string;
          id_user?: string;
          useravatar_user?: string | null;
          usercreatedat_user?: string | null;
          username_user?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_expense_trip_member: {
        Args: { p_expe: string; p_user: string };
        Returns: boolean;
      };
      is_shared_trip_user: {
        Args: { p_user_a: string; p_user_b: string };
        Returns: boolean;
      };
      is_trip_admin: {
        Args: { p_trip: string; p_user: string };
        Returns: boolean;
      };
      is_trip_admin_safe: {
        Args: { p_trip: string; p_uid: string };
        Returns: boolean;
      };
      is_trip_creator: { Args: { _trip: string }; Returns: boolean };
      is_trip_member:
        | { Args: { _trip: string }; Returns: boolean }
        | { Args: { p_trip: string; p_user: string }; Returns: boolean };
      is_trip_member_safe: {
        Args: { p_trip: string; p_uid: string };
        Returns: boolean;
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
