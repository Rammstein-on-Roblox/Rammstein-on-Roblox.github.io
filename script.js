window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    const aboutText = "Rammstein formed in Berlin in 1994, they quickly became a global force in industrial metal. Known for their powerful music and theatrical, pyrotechnic-filled live shows, their concerts have become the stuff of legend, cementing their status as one of the world's most unique and celebrated bands.";
    const aboutText2 = "Welcome to our tribute, Rammstein on Roblox! We've meticulously recreated their iconic live stage in a perfect 1:1 scale. The stage is set within a massive, highly-detailed stadium, capturing the incredible energy and scale of a real Rammstein performance. Every element has been crafted to make you feel like you're truly there.";

    const speedFactor = 1.75;
    const aboutTextContainer = document.getElementById('aboutText');
    if (aboutTextContainer) {
        aboutText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', index * speedFactor);
            aboutTextContainer.appendChild(span);
        });
    }

    const aboutTextContainer2 = document.getElementById('aboutText2');
    if (aboutTextContainer2) {
        const offset = aboutText.length;
        aboutText2.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', (offset + index) * speedFactor);
            aboutTextContainer2.appendChild(span);
        });
    }

    // Auto-load the shop if it's the active section on page open
    if (document.getElementById('shop').classList.contains('active')) {
        loadItems();
    }
    setTimeout(() => {
        observeCards();
    }, 800);
});

function observeCards() {
    const cards = document.querySelectorAll("#team .card, #shop .card");
    
    console.log(`observeCards: found ${cards.length} cards`);

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("visible");
        }, 80 + index * 60);
    });
}

function showSection(id) {
    const sections = document.querySelectorAll('.section-content');
    const loader = document.getElementById('loader');

    if (document.getElementById(id).classList.contains('active')) return;

    loader.style.display = 'flex';

    sections.forEach(section => section.classList.remove('active'));

    const activeSection = document.getElementById(id);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    setTimeout(() => {
        loader.style.display = 'none';
    }, 300);

    setTimeout(() => {
        if (id === 'shop') {
            loadItems();
        }
        observeCards();
    }, 200);
}

function loadItems() {
    const container = document.getElementById('items-container');
    if (!container) {
        console.error("❌ Container items-container not found!");
        return;
    }

    container.innerHTML = '';

    const groupId = 35005739;
    
    // Оставляем cache buster, но убираем сложные заголовки, чтобы избежать OPTIONS-запроса
    const cacheBuster = new Date().getTime();
    const apiUrl = `https://catalog.roproxy.com/v1/search/items/details?Category=3&CreatorType=Group&CreatorTargetId=${groupId}&Limit=30&cb=${cacheBuster}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            // Стандартный заголовок, который НЕ вызывает CORS Preflight проверку
            "Accept-Language": "en-US,en;q=0.9"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Invalid API response");
        }

        const items = data.data.map(item => {
            let finalName = item.originalName || item.name || "Unknown Item";

            // ФИЛЬТР АВТОПЕРЕВОДА: Если RoProxy всё же подсунул русский хвостик,
            // мы просто срезаем самые частые приписки автоперевода Roblox.
            finalName = finalName
                .replace(/\s*-\s*(Рубашка|Штаны|Футболка|Одежда)/gi, '')
                .replace(/\[\s*(Рубашка|Штаны|Футболка)\s*\]/gi, '')
                .trim();

            return {
                id: item.id,
                name: finalName
            };
        });

        console.log("✅ Items loaded:", items.length);

        // Рендерим карточки
        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-3 mb-4';

            col.innerHTML = `
                <div class="card shadow-sm h-100 text-center visible">
                    <div class="card-img-top" style="height: 220px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px 8px 0 0;">
                        <img id="thumb-${item.id}" 
                             src="img/logo.jpg" 
                             alt="${item.name}" 
                             class="w-100 h-100" 
                             style="object-fit: contain; padding: 20px;">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title" id="title-${item.id}">${item.name}</h5>
                        <a href="https://www.roblox.com/catalog/${item.id}" 
                           target="_blank" 
                           class="btn btn-outline-light btn-sm w-100 mt-2">
                           Buy on Roblox
                        </a>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        items.forEach(item => loadItemThumbnail(item.id));
    })
    .catch(err => {
        console.error("❌ Failed to load group items:", err);
    });
}

function loadItemThumbnail(itemId) {
    const img = document.getElementById(`thumb-${itemId}`);
    if (!img) return;

    const apiUrl =
        `https://thumbnails.roproxy.com/v1/assets?assetIds=${itemId}&size=512x512&format=Png&isCircular=false`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {

            if (
                data.data &&
                data.data[0] &&
                data.data[0].imageUrl
            ) {

                img.src = data.data[0].imageUrl;

                console.log(`✅ Thumbnail loaded: ${itemId}`);

            } else {

                throw new Error("No image");

            }

        })
        .catch(err => {

            console.warn(`Failed to load thumbnail: ${itemId}`, err);

            img.src = "img/logo.jpg";

        });
}

// Other functions
function openPhotoModal(cardElement) {
    const img = cardElement.querySelector('.gallery-img');
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const infoWhere = document.getElementById('infoWhere');
    const infoWhen = document.getElementById('infoWhen');

    if (!img || !modal) return;

    modalImg.src = img.src;
    infoWhere.textContent = img.getAttribute('data-info-where') || 'Unknown';
    infoWhen.textContent = img.getAttribute('data-info-when') || 'Unknown';

    modal.classList.add('show');
    modal.style.display = 'flex';
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePhotoModal();
});

function toggleMobileMenu() {
    const sidebar = document.getElementById('mobileSidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

function handleMobileNav(sectionId) {
    showSection(sectionId);
    const sidebar = document.getElementById('mobileSidebar');
    if (sidebar) sidebar.classList.remove('open');
}
