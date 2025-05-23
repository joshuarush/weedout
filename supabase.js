// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL' || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseAnonKey
);

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
