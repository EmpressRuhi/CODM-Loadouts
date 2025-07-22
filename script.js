// Load and display loadouts
async function loadLoadouts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const container = document.getElementById('loadouts-container');
        
        if (!data.loadouts || data.loadouts.length === 0) {
            container.innerHTML = '<div class="loading">No loadouts found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        data.loadouts.forEach(loadout => {
            const card = createLoadoutCard(loadout);
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading loadouts:', error);
        document.getElementById('loadouts-container').innerHTML = 
            '<div class="loading">Error loading loadouts</div>';
    }
}

function createLoadoutCard(loadout) {
    const card = document.createElement('div');
    card.className = 'loadout-card';
    
    // Create weapon image element
    const imageElement = loadout.image && loadout.image !== "image link" 
        ? `<img src="${loadout.image}" alt="${loadout.name}" class="weapon-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="weapon-image" style="display:none;">Weapon Image</div>`
        : `<div class="weapon-image">Weapon Image</div>`;
    
    // Create attachments list
    const attachmentsList = loadout.attachments && loadout.attachments.length > 0
        ? loadout.attachments.map(attachment => 
            `<li class="attachment-item">${attachment}</li>`
          ).join('')
        : '<li class="attachment-item">No attachments</li>';
    
    card.innerHTML = `
        <h2 class="weapon-name">${loadout.name || 'Unknown Weapon'}</h2>
        ${imageElement}
        <div class="attachments-section">
            <h3 class="attachments-title">Attachments</h3>
            <ul class="attachments-list">
                ${attachmentsList}
            </ul>
        </div>
    `;
    
    // Add entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
    
    return card;
}

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', () => {
    loadLoadouts();
    
    // Simplified hover effect - handled by CSS
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});