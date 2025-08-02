let allLoadouts = [];
let filteredLoadouts = [];

// Load and display loadouts
async function loadLoadouts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        if (!data.loadouts || data.loadouts.length === 0) {
            showNoResults();
            return;
        }

        allLoadouts = data.loadouts;
        filteredLoadouts = [...allLoadouts];
        displayLoadouts(filteredLoadouts);

    } catch (error) {
        console.error('Error loading loadouts:', error);
        document.getElementById('loadouts-container').innerHTML =
            '<div class="loading">Error loading loadouts</div>';
    }
}

function displayLoadouts(loadouts) {
    const container = document.getElementById('loadouts-container');
    const noResults = document.getElementById('no-results');

    if (loadouts.length === 0) {
        showNoResults();
        return;
    }

    container.innerHTML = '';
    noResults.style.display = 'none';

    loadouts.forEach((loadout, index) => {
        const card = createLoadoutCard(loadout);
        container.appendChild(card);

        // Staggered entrance animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createLoadoutCard(loadout) {
    const card = document.createElement('div');
    card.className = `loadout-card ${loadout.meta ? 'meta' : ''}`;
    card.dataset.name = loadout.name.toLowerCase();
    card.dataset.category = loadout.category;
    card.dataset.meta = loadout.meta;

    // Create weapon image element
    const imageElement = loadout.image && loadout.image !== "image link"
        ? `<img src="${loadout.image}" alt="${loadout.name}" class="weapon-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="weapon-image" style="display:none;"></div>`
        : `<div class="weapon-image"></div>`;

    // Create stats section
    const statsSection = loadout.damage ? `
        <div class="weapon-stats">
            <div class="stat-item">
                <span class="stat-label">Damage:</span>
                <span class="stat-value">${loadout.damage}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Range:</span>
                <span class="stat-value">${loadout.range}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Mobility:</span>
                <span class="stat-value">${loadout.mobility}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Accuracy:</span>
                <span class="stat-value">${loadout.accuracy}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Fire Rate:</span>
                <span class="stat-value">${loadout.fireRate}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Mode:</span>
                <span class="stat-value">${loadout.mode}</span>
            </div>
        </div>
    ` : '';

    // Create attachments list
    const attachmentsList = loadout.attachments && loadout.attachments.length > 0
        ? loadout.attachments.map(attachment =>
            `<li class="attachment-item">${attachment}</li>`
        ).join('')
        : '<li class="attachment-item">No attachments</li>';

    card.innerHTML = `
        <div class="weapon-category">${loadout.category}</div>
        <h2 class="weapon-name">${loadout.name || 'Unknown Weapon'}</h2>
        ${imageElement}
        ${loadout.description ? `<div class="weapon-description">${loadout.description}</div>` : ''}
        ${statsSection}
        <div class="attachments-section">
            <h3 class="attachments-title">Attachments</h3>
            <ul class="attachments-list">
                ${attachmentsList}
            </ul>
        </div>
    `;

    // Set initial state for animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';

    return card;
}

function showNoResults() {
    const container = document.getElementById('loadouts-container');
    const noResults = document.getElementById('no-results');

    container.innerHTML = '';
    noResults.style.display = 'block';
}

function filterLoadouts() {
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const categoryFilter = document.getElementById('category-filter');
    const mobileCategoryFilter = document.getElementById('mobile-category-filter');
    const metaFilter = document.getElementById('meta-only');
    const mobileMetaFilter = document.getElementById('mobile-meta-only');

    const searchTerm = (searchInput?.value || mobileSearchInput?.value || '').toLowerCase();
    const categoryValue = categoryFilter?.value || mobileCategoryFilter?.value || 'all';
    const metaValue = metaFilter?.classList.contains('active') || mobileMetaFilter?.classList.contains('active') || false;

    filteredLoadouts = allLoadouts.filter(loadout => {
        const matchesSearch = loadout.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryValue === 'all' || loadout.category === categoryValue;
        const matchesMeta = !metaValue || loadout.meta === true;

        return matchesSearch && matchesCategory && matchesMeta;
    });

    displayLoadouts(filteredLoadouts);
}

function syncControls(sourceId, targetId) {
    const source = document.getElementById(sourceId);
    const target = document.getElementById(targetId);

    if (source && target) {
        if (source.classList && target.classList) {
            // Sync toggle states
            if (source.classList.contains('active')) {
                target.classList.add('active');
            } else {
                target.classList.remove('active');
            }
        } else {
            // Sync dropdown values
            target.value = source.value;
        }
    }
}

function toggleMetaFilter(toggleId, syncId) {
    const toggle = document.getElementById(toggleId);
    const syncToggle = document.getElementById(syncId);

    if (toggle) {
        toggle.classList.toggle('active');
        if (syncToggle) {
            if (toggle.classList.contains('active')) {
                syncToggle.classList.add('active');
            } else {
                syncToggle.classList.remove('active');
            }
        }
        filterLoadouts();
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcons = document.querySelectorAll('.theme-icon');

    body.classList.toggle('dark-mode');

    const isDarkMode = body.classList.contains('dark-mode');
    const icon = isDarkMode ? '☀️' : '🌙';

    // Add smooth transition for icon change
    themeIcons.forEach(themeIcon => {
        if (themeIcon) {
            themeIcon.style.transform = 'scale(0)';
            setTimeout(() => {
                themeIcon.textContent = icon;
                themeIcon.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // Save theme preference
    localStorage.setItem('darkMode', isDarkMode);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        const themeIcons = document.querySelectorAll('.theme-icon');
        themeIcons.forEach(icon => icon.textContent = '☀️');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadLoadouts();

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Search functionality - Desktop
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const metaFilter = document.getElementById('meta-only');

    // Search functionality - Mobile
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileCategoryFilter = document.getElementById('mobile-category-filter');
    const mobileMetaFilter = document.getElementById('mobile-meta-only');

    // Desktop event listeners
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            syncControls('search-input', 'mobile-search-input');
            filterLoadouts();
        });

        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.style.transform = 'scale(1.02)';
        });

        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.style.transform = 'scale(1)';
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            syncControls('category-filter', 'mobile-category-filter');
            filterLoadouts();
        });
    }

    if (metaFilter) {
        metaFilter.addEventListener('click', () => {
            toggleMetaFilter('meta-only', 'mobile-meta-only');
        });
    }

    // Mobile event listeners
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', () => {
            syncControls('mobile-search-input', 'search-input');
            filterLoadouts();
        });
    }

    if (mobileCategoryFilter) {
        mobileCategoryFilter.addEventListener('change', () => {
            syncControls('mobile-category-filter', 'category-filter');
            filterLoadouts();
        });
    }

    if (mobileMetaFilter) {
        mobileMetaFilter.addEventListener('click', () => {
            toggleMetaFilter('mobile-meta-only', 'meta-only');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.querySelector('.mobile-nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

        if (mobileMenu && mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});