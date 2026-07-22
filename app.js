// =============================================
// SUPABASE CONFIGURATION - ABSOLUTELY CORRECT
// =============================================

const SUPABASE_URL = 'https://erjyhqelweywrgrhfbba.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KmvSd5y3hYOcXVEUdzhP8w_B9-P4MTc';
const TABLE_NAME = 'items';

// =============================================
// DO NOT CHANGE ANYTHING BELOW THIS LINE
// =============================================

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getItemById(itemId) {
    try {
        const { data, error } = await supabaseClient
            .from(TABLE_NAME)
            .select('*')
            .eq('unique_id', itemId)
            .maybeSingle();
        if (error) {
            console.error('Get item error:', error);
            return null;
        }
        return data;
    } catch (e) {
        console.error('Get item exception:', e);
        return null;
    }
}

async function saveItem(itemData) {
    try {
        const { data, error } = await supabaseClient
            .from(TABLE_NAME)
            .insert([itemData])
            .select();
        if (error) {
            console.error('Save error:', error);
            throw new Error(error.message);
        }
        return { success: true, data: data };
    } catch (e) {
        console.error('Save exception:', e);
        throw e;
    }
}

async function updateItemData(itemId, updateData) {
    try {
        const { data, error } = await supabaseClient
            .from(TABLE_NAME)
            .update(updateData)
            .eq('unique_id', itemId)
            .select();
        if (error) {
            console.error('Update error:', error);
            throw new Error(error.message);
        }
        return data;
    } catch (e) {
        console.error('Update exception:', e);
        throw e;
    }
}

async function getAllItems() {
    try {
        const { data, error } = await supabaseClient
            .from(TABLE_NAME)
            .select('*')
            .order('registered_at', { ascending: false });
        if (error) {
            console.error('Get all error:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Get all exception:', e);
        return [];
    }
}

function generateUniqueId(itemName, count) {
    const prefix = itemName.substring(0, 3).toUpperCase();
    const paddedCount = String(count).padStart(3, '0');
    return `${prefix}-${paddedCount}`;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Supabase Configured with URL:', SUPABASE_URL);
});

window.saveItem = saveItem;
window.getItemById = getItemById;
window.getAllItems = getAllItems;
window.updateItemData = updateItemData;
window.generateUniqueId = generateUniqueId;
window.isValidUrl = isValidUrl;
