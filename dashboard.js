document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
});

async function loadDashboard() {
    try {
        const items = await getAllItems();
        
        // Update stats
        const total = items.length;
        const registered = items.filter(item => item.status === 'registered' || item.status === 'active').length;
        const unregistered = items.filter(item => item.status === 'unregistered').length;
        
        document.getElementById('totalItems').textContent = total;
        document.getElementById('registeredItems').textContent = registered;
        document.getElementById('unregisteredItems').textContent = unregistered;
        
        // Display items table
        displayItems(items);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('itemsTable').innerHTML = `
            <p style="color: red;">Error loading inventory. Please check your database connection.</p>
        `;
    }
}

function displayItems(items) {
    const tableDiv = document.getElementById('itemsTable');
    
    if (items.length === 0) {
        tableDiv.innerHTML = `
            <p style="color: #718096; text-align: center; padding: 30px;">
                No items in inventory yet. Generate QR codes to get started!
            </p>
        `;
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Serial</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    items.forEach(item => {
        const statusClass = item.status === 'registered' || item.status === 'active' 
            ? 'status-registered' 
            : 'status-unregistered';
        
        html += `
            <tr>
                <td><strong>${item.unique_id}</strong></td>
                <td>${item.category || 'N/A'}</td>
                <td>${item.serial_number || 'N/A'}</td>
                <td>${item.assigned_to || 'Unassigned'}</td>
                <td><span class="status-badge ${statusClass}">${item.status || 'unknown'}</span></td>
                <td>
                    <a href="index.html?id=${item.unique_id}" class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;">
                        Scan
                    </a>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    tableDiv.innerHTML = html;
}

function searchItems() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#itemsTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}
