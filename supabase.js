// supabase.js

// Use ESM version of CDN for createClient
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://yzhitpxznmehcbqdppzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGl0cHh6bm1laGNicWRwcHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzExMzYsImV4cCI6MjA2MzU0NzEzNn0.LLhmq5irPFUWvCr1ZC_5ntIpzA-LKr_-ud1i6-f-q5c';

console.log('Supabase script loaded. Initializing client...');

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

/**
 * Creates an initial lead entry with address information.
 * @param {object} addressData - Object containing address details.
 * @param {string} [addressData.street_address] - Street address.
 * @param {string} [addressData.city] - City.
 * @param {string} addressData.zip_code - ZIP code (required).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function addLead(addressData) {
  if (!supabase) return { data: null, error: { message: 'Supabase client not initialized.'}};

  if (!addressData.zip_code || addressData.zip_code.trim() === '') {
    return { data: null, error: { message: 'Zip code is required to create a lead.' } };
  }

  try {
    const { data, error } = await supabase
      .from('campaign_leads')
      .insert([
        {
          initial_street_address: addressData.street_address?.trim() || null,
          initial_city: addressData.city?.trim() || null,
          initial_zip_code: addressData.zip_code.trim(),
          address_submission_timestamp: new Date().toISOString(),
        },
      ])
      .select('id') // Select only the ID of the newly created lead
      .single();    // Expect a single record

    if (error) {
        console.error('Supabase error in addLead:', error);
        throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error adding initial lead:', error);
    return { data: null, error };
  }
}

/**
 * Updates an existing lead with contact information (email and/or phone).
 * @param {string} leadId - The UUID of the lead to update.
 * @param {object} contactData - Object containing contact details.
 * @param {string} [contactData.email] - Email address.
 * @param {string} [contactData.phone] - Phone number.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function updateLead(leadId, contactData) {
  if (!supabase) return { data: null, error: { message: 'Supabase client not initialized.'}};

  if (!leadId) {
     return { data: null, error: { message: 'Lead ID is required to update contact info.' } };
  }

  const emailTrimmed = contactData.email?.trim();
  const phoneTrimmed = contactData.phone?.trim();

  if (!emailTrimmed && !phoneTrimmed) {
    return { data: null, error: { message: 'Either email or phone number is required to update.' } };
  }

  const updateObject = {
    contact_submission_timestamp: new Date().toISOString(),
  };

  if (emailTrimmed) {
    updateObject.contact_email = emailTrimmed;
  }
  if (phoneTrimmed) {
    updateObject.contact_phone = phoneTrimmed; // Store raw, formatting can be done on display
  }
  
  try {
    const { data, error } = await supabase
      .from('campaign_leads')
      .update(updateObject)
      .eq('id', leadId)
      .select('id, contact_email, contact_phone') // Confirm by selecting updated fields
      .single();

    if (error) {
        console.error('Supabase error in updateLead:', error);
        throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error updating lead with contact info:', error);
    return { data: null, error };
  }
}

// Function to format phone numbers (remains the same)
export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}