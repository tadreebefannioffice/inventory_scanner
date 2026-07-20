document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('generateForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const itemName = document.getElementById('itemName').value.trim();
        const quantity = parseInt(document.getElementById('quantity').value);
        const category = document.getElementById('category').value.trim() || itemName;
        
        if (!itemName || quantity < 1) {
            alert('Please enter a valid item name and quantity.');
            return;
        }
        
        await generateQRCodes(itemName, quantity, category);
    });
});

async function generateQRCodes(itemName, quantity, category) {
    const outputDiv = document.getElementById('qrOutput');
    const gridDiv = document.getElementById('qrGrid');
    
    // Clear previous results
    gridDiv.innerHTML = '';
    outputDiv.style.display = 'block';
    
    const baseUrl = window.location.origin + window.location.pathname.replace('generate.html', 'index.html');
    
    // Generate QR codes
    const items = [];
    for (let i = 1; i <= quantity; i++) {
        const uniqueId = generateUniqueId(itemName, i);
        const fullUrl = `${baseUrl}?id=${uniqueId}`;
        
        // Generate QR code using API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`;
        
        // Create QR item element
        const div = document.createElement('div');
        div.className = 'qr-item';
        div.innerHTML = `
            <img src="${qrUrl}" alt="QR Code for ${uniqueId}" loading="lazy">
            <strong>${uniqueId}</strong>
            <br><small style="color:#718096;">${category}</small>
        `;
        gridDiv.appendChild(div);
        
        // Store for database insertion
        items.push({
            unique_id: uniqueId,
            category: category,
            status: 'unregistered',
            quantity: 1
        });
    }
    
    // Store items for batch save
    window.generatedItems = items;
    
    // Scroll to QR codes
    outputDiv.scrollIntoView({ behavior: 'smooth' });
}

async function saveToDatabase() {
    const items = window.generatedItems;
    if (!items || items.length === 0) {
        alert('No items to save. Generate QR codes first.');
        return;
    }
    
    const confirmSave = confirm(`Save ${items.length} items to the inventory database?`);
    if (!confirmSave) return;
    
    try {
        let saved = 0;
        for (const item of items) {
            // Check if item already exists
            const existing = await getItemById(item.unique_id);
            if (!existing) {
                await saveItem(item);
                saved++;
            }
        }
        
        alert(`✅ ${saved} items saved to inventory!\n${items.length - saved} items already existed.`);
        
        // Show success message
        document.querySelector('#qrOutput h3').textContent = '✅ QR Codes Generated and Saved!';
        
    } catch (error) {
        alert('❌ Error saving to database. Check your Supabase connection.');
        console.error(error);
    }
}
