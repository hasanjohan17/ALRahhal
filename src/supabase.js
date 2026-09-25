const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function fetchProducts() {
  if (!supabaseUrl || !supabaseKey) return null

  const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*&order=created_at.desc`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  })
  if (!response.ok) throw new Error('تعذر جلب المنتجات')
  return response.json()
}
