// Scanner state
let html5QrCode;
let currentItemId = null;
let scannerInitialized = false;

// Initialize scanner when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeScanner();
});

async function initializeScanner() {
    if (scannerInitialized) return;
    
    try {
        html5QrCode = new Html5Qrcode("scanner");
        scannerInitialized = true;
        startScanner();
    } catch (error) {
        console.error('Error initializing scanner:', error);
        document.getElementById('scanner').innerHTML = `
            <p style="color:red; padding:20px;">
                ❌ Camera not accessible. Please use a device with a camera.
            </p>
        `;
    }
}

function startScanner() {
    if (!html5QrCode) return;
    
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
    );
}

function restartScanner() {
    document.getElementById('result').style.display = 'none';
    if (html5QrCode) {
        html5QrCode.stop();
        setTimeout(() => {
            startScanner();
        }, 500);
    }
}

async function onScanSuccess(decodedText) {
    try {
        // Stop scanner immediately
        if (html5QrCode) {
            await html5QrCode.stop();
        }
        
        // Parse the QR code content
        let itemId = decodedText;
        
        // If it's a URL, extract the ID parameter
        if (isValidUrl(decodedText)) {
            const url = new URL(decodedText);
            itemId = url.searchParams.get('id') || decodedText;
        }
        
        // Look up the item
        await lookupItem(itemId);
        
    } catch (error) {
        console.error('Scan processing error:', error);
        showError('Error processing scan. Please try again.');
        setTimeout(() => startScanner(), 2000);
    }
}

function onScanError(error) {
    // This is called frequently, ignore it
    // Only log if it's a real error
    if (error && error.includes('Camera')) {
        console.warn('Camera error:', error);
    }
}

async function lookupItem(itemId) {
    const resultDiv = document.getElementById('result');
    const itemTitle = document.getElementById('itemTitle');
    const itemDetails = document.getElementById('itemDetails');
    const registerBtn = document.getElementById('registerBtn');
    const updateBtn = document.getElementById('updateBtn');
    
    // Show result area
    resultDiv.style.display = 'block';
    
    try {
        // Query Supabase
        const item = await getItemById(itemId);
        
        if (!item) {
            // NEW ITEM - Not in database
            itemTitle.textContent = '🔵 New Item Detected!';
            itemDetails.innerHTML = `
                <p><strong>ID:</strong> ${itemId}</p>
                <p><strong>Status:</strong> Not registered yet</p>
                <p style="color: #718096; margin-top: 10px;">Click "Register" below to add this item to your inventory.</p>
            `;
            registerBtn.style.display = 'inline-block';
            updateBtn.style.display = 'none';
            currentItemId = itemId;
            return;
        }
        
        if (item.status === 'registered' || item.status === 'active') {
            // REGISTERED ITEM - Show full details
            itemTitle.textContent = `✅ ${item.category || 'Item'}`;
            itemDetails.innerHTML = `
                <p><strong>ID:</strong> ${item.unique_id}</p>
                <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
                <p><strong>Serial Number:</strong> ${item.serial_number || 'N/A'}</p>
                <p><strong>Assigned To:</strong> ${item.assigned_to || 'Unassigned'}</p>
                <p><strong>Location:</strong> ${item.location || 'Unknown'}</p>
                <p><strong>Quantity:</strong> ${item.quantity || 1}</p>
                <p><strong>Status:</strong> <span class="status-badge status-registered">${item.status}</span></p>
                <p><strong>Registered:</strong> ${new Date(item.registered_at).toLocaleDateString()}</p>
            `;
            registerBtn.style.display = 'none';
            updateBtn.style.display = 'inline-block';
            currentItemId = itemId;
            return;
        }
        
        // UNREGISTERED ITEM - In database but not registered
        itemTitle.textContent = '📋 Item Found - Needs Registration';
        itemDetails.innerHTML = `
            <p><strong>ID:</strong> ${item.unique_id}</p>
            <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
            <p><strong>Status:</strong> <span class="status-badge status-unregistered">Unregistered</span></p>
        `;
        registerBtn.style.display = 'inline-block';
        updateBtn.style.display = 'none';
        currentItemId = itemId;
        
    } catch (error) {
        console.error('Error looking up item:', error);
        showError('Error connecting to database. Please try again.');
    }
}

async function registerItem() {
    if (!currentItemId) return;
    
    // Ask for details
    const category = prompt('Enter category (e.g., Laptop, Camera):') || 'Uncategorized';
    const serial = prompt('Enter serial number:') || 'N/A';
    const assignedTo = prompt('Assigned to (person or department):') || 'Unassigned';
    const location = prompt('Location (e.g., Office A, Warehouse 1):') || 'Unknown';
    
    try {
        await saveItem({
            unique_id: currentItemId,
            category: category,
            serial_number: serial,
            assigned_to: assignedTo,
            location: location,
            status: 'registered',
            quantity: 1,
            registered_at: new Date().toISOString()
        });
        
        alert('✅ Item registered successfully!');
        // Refresh the view
        await lookupItem(currentItemId);
        
    } catch (error) {
        alert('❌ Error registering item. Please try again.');
        console.error(error);
    }
}

async function updateItem() {
    if (!currentItemId) return;
    
    const field = prompt('What do you want to update?\nOptions: quantity, location, assigned_to, serial_number');
    if (!field) return;
    
    const value = prompt(`Enter new ${field}:`);
    if (value === null) return;
    
    try {
        await updateItem(currentItemId, { [field]: value });
        alert('✅ Item updated successfully!');
        await lookupItem(currentItemId);
    } catch (error) {
        alert('❌ Error updating item. Please try again.');
        console.error(error);
    }
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    const itemTitle = document.getElementById('itemTitle');
    const itemDetails = document.getElementById('itemDetails');
    
    resultDiv.style.display = 'block';
    resultDiv.style.borderColor = '#fc8181';
    itemTitle.textContent = '⚠️ Error';
    itemDetails.innerHTML = `<p style="color: #e53e3e;">${message}</p>`;
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'none';
}
