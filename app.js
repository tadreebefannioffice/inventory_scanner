// Supabase Configuration
// REPLACE THESE WITH YOUR SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://tadreebefanniofficesproject.supabase.co';
const SUPABASE_ANON_KEY = 'sb_pub1ishable_KmvSd5y3hY0cXVEudzhP8w_B9-P4_';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table name
const TABLE_NAME = 'items';

// Helper function to get item by ID
async function getItemById(itemId) {
    const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .select('*')
        .eq('unique_id', itemId)
        .maybeSingle();
    
    if (error) {
        console.error('Error fetching item:', error);
        return null;
    }
    return data;
}

// Helper function to save new item
async function saveItem(itemData) {
    const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .insert([itemData]);
    
    if (error) {
        console.error('Error saving item:', error);
        throw error;
    }
    return data;
}

// Helper function to update item
async function updateItem(itemId, updateData) {
    const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .update(updateData)
        .eq('unique_id', itemId);
    
    if (error) {
        console.error('Error updating item:', error);
        throw error;
    }
    return data;
}

// Helper function to get all items
async function getAllItems() {
    const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching items:', error);
        return [];
    }
    return data;
}

// Generate a unique ID based on item name and count
function generateUniqueId(itemName, count) {
    const prefix = itemName.substring(0, 3).toUpperCase();
    const paddedCount = String(count).padStart(3, '0');
    return `${prefix}-${paddedCount}`;
}

// Check if string is a URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
