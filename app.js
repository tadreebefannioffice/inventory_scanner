// =============================================
// SUPABASE CONFIGURATION - CORRECT VERSION
// =============================================

const SUPABASE_URL = 'https://supabase.com/dashboard/project/erjyhqelweywrgrhfbba.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KmvSd5y3hYOcXVEUdzhP8w_B9-P4MTc';

// =============================================
// Test the connection first
// =============================================
async function testSupabaseConnection() {
    try {
        console.log('🔌 Testing Supabase connection...');
        console.log('URL:', SUPABASE_URL);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/items?limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('✅ Supabase connection successful!');
            return true;
        } else {
            const error = await response.text();
            console.error('❌ Connection failed:', response.status, error);
            return false;
        }
    } catch (error) {
        console.error('❌ Connection error:', error);
        return false;
    }
}

// =============================================
// SAVE ITEMS TO DATABASE - DIRECT FETCH
// =============================================
async function saveItemsToSupabase(items) {
    console.log('📦 Saving items:', items.length);
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/items`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(items)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Save error:', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Save successful:', data);
        return data;
    } catch (error) {
        console.error('❌ Save failed:', error);
        throw error;
    }
}

// =============================================
// SAVE SINGLE ITEM
// =============================================
async function saveItem(itemData) {
    return saveItemsToSupabase([itemData]);
}

// =============================================
// GET ITEM BY ID
// =============================================
async function getItemById(itemId) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/items?unique_id=eq.${itemId}`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Error fetching item:', error);
        return null;
    }
}

// =============================================
// GET ALL ITEMS
// =============================================
async function getAllItems() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/items`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

// =============================================
// UPDATE ITEM
// =============================================
async function updateItem(itemId, updateData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/items?unique_id=eq.${itemId}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
}

// =============================================
// GENERATE UNIQUE ID
// =============================================
function generateUniqueId(itemName, count) {
    const prefix = itemName.substring(0, 3).toUpperCase();
    const paddedCount = String(count).padStart(3, '0');
    return `${prefix}-${paddedCount}`;
}

// =============================================
// CHECK IF URL IS VALID
// =============================================
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// =============================================
// AUTO-TEST CONNECTION WHEN PAGE LOADS
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    testSupabaseConnection();
});

// =============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// =============================================
window.saveItemsToSupabase = saveItemsToSupabase;
window.saveItem = saveItem;
window.getItemById = getItemById;
window.getAllItems = getAllItems;
window.updateItem = updateItem;
window.generateUniqueId = generateUniqueId;
window.isValidUrl = isValidUrl;
window.testSupabaseConnection = testSupabaseConnection;
