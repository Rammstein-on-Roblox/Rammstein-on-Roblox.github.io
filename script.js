// ====================== SCRIPT.JS ======================

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    const aboutText = "Rammstein formed in Berlin in 1994, they quickly became a global force in industrial metal. Known for their powerful music and theatrical, pyrotechnic-filled live shows, their concerts have become the stuff of legend, cementing their status as one of the world's most unique and celebrated bands.";
    const aboutText2 = "Welcome to our tribute, Rammstein on Roblox! We've meticulously recreated their iconic live stage in a perfect 1:1 scale. The stage is set within a massive, highly-detailed stadium, capturing the incredible energy and scale of a real Rammstein performance. Every element has been crafted to make you feel like you're truly there.";

    const speedFactor = 0.25;
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

    // Автозагрузка магазина, если открыли сразу Shop
    if (document.getElementById('shop').classList.contains('active')) {
        loadItems();
    }
});

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

    if (id === 'shop') {
        setTimeout(() => {
            loadItems();
        }, 100);
    }
}

function loadItems() {
    const container = document.getElementById('items-container');
    if (!container) {
        console.error("❌ Контейнер #items-container не найден!");
        return;
    }

    container.innerHTML = '';

    const groupItems = [
        { id: 137673005066054, name: "Sonne Tour Shirt" },
        { id: 100485447459701, name: "Rammstein Hoodie" },
        { id: 74405350693577, name: "Stage Crew Pass" },
        { id: 131895338186507, name: "Ausländer Uniform" }
    ];

    groupItems.forEach((item) => {
        const col = document.createElement('div');
        col.className = 'col-md-3 mb-4';

        col.innerHTML = `
            <div class="card shadow-sm h-100 text-center">
                <div class="card-img-top" style="height: 220px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px 8px 0 0;">
                    <img id="thumb-${item.id}" 
                         src="img/logo.jpg" 
                         alt="${item.name}" 
                         class="w-100 h-100" 
                         style="object-fit: contain; padding: 20px;">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <a href="https://www.roblox.com/catalog/${item.id}" 
                       target="_blank" 
                       class="btn btn-outline-light btn-sm w-100 mt-2">Buy on Roblox</a>
                </div>
            </div>
        `;

        container.appendChild(col);
    });

    console.log("✅ Карточки магазина успешно добавлены");

    // Загружаем превью
    groupItems.forEach(item => {
        loadItemThumbnail(item.id);
    });
}

async function loadItemThumbnail(itemId) {
    const img = document.getElementById(`thumb-${itemId}`);
    if (!img) return;

    // Основной метод
    try {
        const response = await fetch(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${itemId}&size=420x420&format=Png`
        );
        const data = await response.json();

        if (data.data?.[0]?.imageUrl) {
            img.src = data.data[0].imageUrl;
            console.log(`✅ Превью загружено: ${itemId}`);
            return;
        }
    } catch (e) {
        console.log(`Новый API не сработал для ${itemId}, пробуем fallback...`);
    }

    // Fallback (надёжный)
    try {
        const fallbackUrl = `https://www.roblox.com/asset-thumbnail/image?assetId=${itemId}&width=420&height=420&format=png`;
        img.src = fallbackUrl;
        console.log(`✅ Fallback превью использован: ${itemId}`);
    } catch (e) {
        console.warn(`Не удалось загрузить превью для ${itemId}`);
    }
}

// Остальные функции (галерея, мобильное меню и т.д.)
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