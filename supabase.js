// Initialize Supabase client
// For Netlify production deployment - directly use the project URL and key
// since import.meta.env doesn't work in browser environments without a build tool

// Use ESM version of CDN for createClient
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://yzhitpxznmehcbqdppzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGl0cHh6bm1laGNicWRwcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzExMzYsImV4cCI6MjA2MzU0NzEzNn0.LLhmq5irPFUWvCr1ZC_5ntIpzA-LKr_-ud1i6-f-q5c';

console.log('Supabase script loaded. Initializing client...');

// Only create client if both URL and key are available
let supabaseInstance = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully in supabase.js');
  } catch (error) {
    console.error('Error initializing Supabase client in supabase.js:', error);
  }
} else {
  console.error('Supabase URL or Anon Key is missing in supabase.js');
}

export const supabase = supabaseInstance;

export async function addLead(leadData) {
  if (!supabase) return { data: null, error: { message: 'Supabase client not initialized.'}};

  // Zip code is the minimum requirement to create a lead.
  // Street address and city are optional for the initial creation.
  if (!leadData.zip_code || leadData.zip_code.trim() === '') {
    return { data: null, error: { message: 'Zip code is required to create a lead.' } };
  }

  try {
    const { data, error } = await supabase
      .from('user_entries') // Table name from memory
      .insert([
        {
          street_address: leadData.street_address && leadData.street_address.trim() !== '' ? leadData.street_address.trim() : null,
          city: leadData.city && leadData.city.trim() !== '' ? leadData.city.trim() : null,
          zip_code: leadData.zip_code.trim(),
          email: leadData.email && leadData.email.trim() !== '' ? leadData.email.trim() : null,
          phone: leadData.phone && leadData.phone.trim() !== '' ? leadData.phone.trim() : null,
          is_signup: true, // Mark as a signup from this form
        },
      ])
      .select() // Return the created record
      .single(); // Expect a single record

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding lead:', error);
    return { data: null, error };
  }
}

export async function updateLead(recordId, leadData) {
  if (!supabase) return { data: null, error: { message: 'Supabase client not initialized.'}};

  if (!recordId) {
     return { data: null, error: { message: 'Record ID is required to update a lead.' } };
  }

  const updateObject = {};
  // Only add fields to updateObject if they are actually provided in leadData
  if (leadData.hasOwnProperty('street_address')) {
    updateObject.street_address = leadData.street_address ? leadData.street_address.trim() : null;
  }
  if (leadData.hasOwnProperty('city')) {
    updateObject.city = leadData.city ? leadData.city.trim() : null;
  }
  if (leadData.hasOwnProperty('zip_code')) {
    updateObject.zip_code = leadData.zip_code ? leadData.zip_code.trim() : null;
  }
  if (leadData.hasOwnProperty('email')) {
    updateObject.email = leadData.email ? leadData.email.trim() : null;
  }
  if (leadData.hasOwnProperty('phone')) {
    updateObject.phone = leadData.phone ? leadData.phone.trim() : null;
  }

  if (Object.keys(updateObject).length === 0) {
      return { data: null, error: { message: 'No new information provided for update.' } };
  }
  
  try {
    const { data, error } = await supabase
      .from('user_entries') // Table name from memory
      .update(updateObject)
      .eq('id', recordId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating lead:', error);
    return { data: null, error };
  }
}

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
