// Initialize Supabase client
// For Netlify production deployment - directly use the project URL and key
// since import.meta.env doesn't work in browser environments without a build tool
const supabaseUrl = 'https://yzhitpxznmehcbqdppzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGl0cHh6bm1laGNicWRwcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzExMzYsImV4cCI6MjA2MzU0NzEzNn0.LLhmq5irPFUWvCr1ZC_5ntIpzA-LKr_-ud1i6-f-q5c';

console.log('Supabase client initialized with URL:', supabaseUrl.substring(0, 20) + '...');

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
