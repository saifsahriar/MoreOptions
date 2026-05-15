/**
 * Shared type definitions for the MoreOptions career discovery platform.
 * Import from '@/lib/types' to use these types across components.
 */

/** Career object as used by the client-side components (CareersClient, SavedClient). */
export interface Career {
  id: string;
  name: string;
  industry: string;
  stream: string;
  description: string;
  salary: string;
  demand: string;
  skills: string;
  salaryNum: number;
}

/** Raw career row as returned from Supabase query. */
export interface CareerRow {
  career_id: string;
  career_name: string;
  industry: string;
  stream: string | null;
  description: string | null;
  salary_range_india: string | null;
  demand_trend: string | null;
  skills_tags: string | null;
  minimum_qualification?: string | null;
  typical_pathways?: string | null;
  nsqf_level?: number | null;
}
