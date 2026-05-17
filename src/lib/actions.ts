'use server'

import { createClient } from './supabase-server'
import { revalidatePath } from 'next/cache'
import { checkRateLimit } from './rate-limit'
import { z } from 'zod'
import { headers } from 'next/headers'

const CareerSchema = z.object({
  career_id: z.string().optional(),
  career_name: z.string().min(2).max(100).transform(s => s.trim()),
  industry: z.string().min(2).max(100).transform(s => s.trim()),
  stream: z.string().transform(s => s.trim()).optional(),
  salary_range_india: z.string().max(100).transform(s => s.trim()).optional(),
  demand_trend: z.string().max(50).transform(s => s.trim()).optional(),
  description: z.string().max(3000).transform(s => s.trim()).optional(),
});

async function verifyCsrf() {
  const headersList = await headers()
  const origin = headersList.get('origin')
  const host = headersList.get('host')
  
  if (origin && host) {
    const originHost = new URL(origin).host
    if (originHost !== host) {
      console.error(`CSRF validation failed: Origin ${originHost} does not match Host ${host}`)
      throw new Error('CSRF validation failed')
    }
  }
}

async function getSession() {
  await verifyCsrf()
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Check admin role from Supabase user metadata (set via dashboard or SQL)
  // This is future-proof: when public users are added, only users with role='admin' get access
  const isAdmin = user.app_metadata?.role === 'admin'
  if (!isAdmin) {
    console.error(`Non-admin access attempt by ${user.email}`)
    return null
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
  
  if (error) {
    console.error('Database fetch error:', error)
    throw new Error('Failed to fetch careers')
  }

  return data
}

export async function fetchBlogs() {
  await checkRateLimit('fetch_blogs')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Database fetch error:', error)
    throw new Error('Failed to fetch blogs')
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

const BlogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().optional(),
  status: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image_url: z.string().optional(),
  read_time_minutes: z.number().optional()
});

export async function saveBlog(blogData: z.infer<typeof BlogSchema> | Record<string, unknown>) {
  await checkRateLimit('save_blog')
  const user = await getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const supabase = await createClient()
  
  const validatedData = BlogSchema.safeParse(blogData)
  if (!validatedData.success) {
    throw new Error('Invalid input format')
  }

  const payload: Record<string, unknown> = {
    ...validatedData.data,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('blogs')
    .upsert(payload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Database save error:', error)
    throw new Error('Failed to save blog')
  }

  revalidatePath('/admin')
  revalidatePath('/blog')
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
