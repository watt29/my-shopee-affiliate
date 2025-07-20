import { createClient } from '@supabase/supabase-js'

// ดึงค่า URL และ Key จากไฟล์ .env.local ที่เราสร้างไว้
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// สร้างการเชื่อมต่อกับ Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
