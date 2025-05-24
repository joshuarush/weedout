// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log configuration status for debugging (remove in production)
console.log('Supabase configuration status:', {
  urlConfigured: !!supabaseUrl,
  keyConfigured: !!supabaseAnonKey
});

// Only create client if both URL and key are available
let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
}

export { supabase };

// Function to format phone numbers
export function formatPhoneNumber(phoneNumber) {
  // Remove all non-digit characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Check if the number has 10 digits (US format)
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // Return original if format doesn't match
  return phoneNumber;
}
