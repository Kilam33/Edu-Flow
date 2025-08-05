export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          cover_image: string | null
          user_id: string
          tags: string[] | null
          is_published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          cover_image?: string | null
          user_id: string
          tags?: string[] | null
          is_published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          cover_image?: string | null
          user_id?: string
          tags?: string[] | null
          is_published?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "courses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          course_id: string
          order: number
          video_url: string | null
          content: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          course_id: string
          order?: number
          video_url?: string | null
          content?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          course_id?: string
          order?: number
          video_url?: string | null
          content?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          id: string
          created_at: string
          content: Json
          user_id: string
          lesson_id: string
          last_updated: string
        }
        Insert: {
          id?: string
          created_at?: string
          content: Json
          user_id: string
          lesson_id: string
          last_updated?: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: Json
          user_id?: string
          lesson_id?: string
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      enrollments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          course_id: string
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          course_id: string
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          course_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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