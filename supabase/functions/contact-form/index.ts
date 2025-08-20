import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting storage (in-memory for edge function)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }) // 15 minutes
    return false
  }
  
  if (limit.count >= 3) {
    return true
  }
  
  limit.count++
  return false
}

function validateContactForm(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters')
  }
  
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 5) {
    errors.push('Phone is required and must be at least 5 characters')
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters')
  }
  
  // Check honeypot field (should be empty)
  if (data._hp && data._hp.trim() !== '') {
    errors.push('Bot detected')
  }
  
  // Basic validation
  if (data.name && data.name.length > 100) {
    errors.push('Name is too long')
  }
  
  if (data.phone && data.phone.length > 20) {
    errors.push('Phone is too long')
  }
  
  if (data.message && data.message.length > 1000) {
    errors.push('Message is too long')
  }
  
  return { valid: errors.length === 0, errors }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Too many requests. Please try again in 15 minutes.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const formData = await req.json()
    console.log('Contact form submission:', { ip: clientIP, data: formData })

    // Validate form data
    const validation = validateContactForm(formData)
    if (!validation.valid) {
      console.log('Validation failed:', validation.errors)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Validation failed', 
          details: validation.errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Save to database
    const { error } = await supabase
      .from('contact_requests')
      .insert([
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          meta: {
            ip: clientIP,
            user_agent: req.headers.get('user-agent'),
            timestamp: new Date().toISOString(),
            referer: req.headers.get('referer')
          }
        }
      ])

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save contact request' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Contact form saved successfully for IP:', clientIP)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact request submitted successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})