'use server'

import { createClient } from './supabase-server'
import { revalidatePath } from 'next/cache'
import { checkRateLimit } from './rate-limit'
import { z } from 'zod'

const CareerSchema = z.object({
  career_id: z.string().optional(),
  career_name: z.string().min(2).max(100),
  industry: z.string().min(2).max(100),
  stream: z.string().optional(),
  salary_range_india: z.string().max(100).optional(),
  demand_trend: z.string().max(50).optional(),
  description: z.string().max(3000).optional(),
});

async function getSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // DEFENSE-IN-DEPTH: Explicit admin check
  const ADMIN_EMAILS = ['admin@moreoptions.in', 'saif@moreoptions.in']; 
  if (user && !ADMIN_EMAILS.includes(user.email || '')) {
    console.error(`Unauthorized access attempt by ${user.email}`);
    return null;
  }
  
  return user
}

export async function fetchCareers() {
  await checkRateLimit('fetch_careers')
  const user = await getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .order('career_id', { ascending: false })
    .limit(100) // Resource protection limit
  
  if (error) {
    console.error('Database fetch error:', error)
    throw new Error('Failed to fetch careers')
  }

  return data
}

export async function saveCareer(careerData: z.infer<typeof CareerSchema> | Record<string, unknown>) {
  await checkRateLimit('save_career')
  const user = await getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const supabase = await createClient()
  
  // Strict Schema Validation
  const validatedData = CareerSchema.safeParse(careerData)
  if (!validatedData.success) {
    throw new Error('Invalid input format')
  }

  const { career_id, career_name, industry, stream, salary_range_india, demand_trend, description } = validatedData.data

  const payload: Record<string, unknown> = {
    career_name,
    industry,
    stream,
    salary_range_india,
    demand_trend,
    description,
    updated_at: new Date().toISOString()
  }
  if (career_id) {
    payload.career_id = career_id
  }

  const { data, error } = await supabase
    .from('careers')
    .upsert(payload, { onConflict: 'career_id' })
    .select()

  if (error) {
    console.error('Database save error:', error)
    throw new Error('Failed to save career')
  }

  revalidatePath('/admin')
  revalidatePath('/careers')
  return data
}

export async function deleteCareer(id: string | number) {
  await checkRateLimit('delete_career')
  const user = await getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('careers')
    .delete()
    .eq('career_id', id)

  if (error) {
    console.error('Database delete error:', error)
    throw new Error('Failed to delete career')
  }

  revalidatePath('/admin')
  revalidatePath('/careers')
  return { success: true }
}
