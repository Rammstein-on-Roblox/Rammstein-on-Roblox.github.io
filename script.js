window.addEventListener('load', () => {
      document.getElementById('loader').style.display = 'none';
      const aboutText = "Rammstein is a German industrial metal band formed in 1994 in Berlin. Known for their heavy, guitar-driven sound, deep vocals, and theatrical live performances featuring pyrotechnics, they blend elements of metal, electronic, and classical music. Their lyrics often explore controversial and dark themes, sometimes using irony and wordplay. The band's most famous songs include Du Hast, Sonne, and Mein Herz Brennt. They primarily sing in German but have gained international success.";
      const aboutText2 = "We're a parody band that strives to be the Rammstein of the ROBLOX platform. We make no assertions of legal ownership concerning the music, rights, or IP related to Rammstein or Universal Music.";
      const aboutTextContainer = document.getElementById('aboutText');
      aboutText.split('').forEach((char, index) => {const span = document.createElement('span');span.textContent = char;span.style.setProperty('--i', index);aboutTextContainer.appendChild(span);});
      const aboutTextContainer2 = document.getElementById('aboutText2');
      const offset = aboutText.length;
      aboutText2.split('').forEach((char, index) => {const span = document.createElement('span');span.textContent = char;span.style.setProperty('--i', offset + index);aboutTextContainer2.appendChild(span);});
});

async function loadRobloxAvatars(usersToShow) {
    const BATCH_SIZE = 10;
    const DELAY_BETWEEN_BATCHES_MS = 100;
    const DEFAULT_AVATAR = 'img/1.png';
    const LOADING_IMAGE = 'img/roblox-150.png';

    const PROXY_SERVERS = [
        "https://api.codetabs.com/v1/proxy?quest="
    ];

    for (let i = 0; i < usersToShow.length; i += BATCH_SIZE) {
        const batch = usersToShow.slice(i, i + BATCH_SIZE);
      
        batch.forEach((user) => {
            const img = document.getElementById(`img-${user.originalIndex}`);
            if (img) img.src = LOADING_IMAGE;
        });

        const validUsers = batch.filter(user => user.id && !isNaN(Number(user.id)));
        if (validUsers.length === 0) continue;

        try {
            const userIds = validUsers.map(user => user.id);
            const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.join(',')}&size=150x150&format=Png&isCircular=false`;
            
            let avatarData = null;
            const proxyPromises = PROXY_SERVERS.map(proxy => 
                fetch(proxy + encodeURIComponent(apiUrl), {
                    headers: { 'Accept': 'application/json' }
                })
                .then(response => response.ok ? response.json() : null)
                .catch(e => {
                    console.error(`Proxy error (${proxy}):`, e);
                    return null;
                })
            );
            const results = await Promise.allSettled(proxyPromises);
            for (const result of results) {
                if (result.status === 'fulfilled' && result.value && result.value.data) {
                    avatarData = result.value;
                    break;
                }
            }
            batch.forEach((user) => {
                const img = document.getElementById(`img-${user.originalIndex}`);
                if (!img) return;

                if (avatarData && avatarData.data) {
                    const userAvatar = avatarData.data.find(item => item.targetId === parseInt(user.id));
                    if (userAvatar && userAvatar.imageUrl) {
                        const tempImg = new Image();
                        tempImg.onload = function() {
                            img.src = userAvatar.imageUrl;
                        };
                        tempImg.onerror = function() {
                            img.src = DEFAULT_AVATAR;
                        };
                        tempImg.src = userAvatar.imageUrl;
                        return;
                    }
                }
                
                img.src = DEFAULT_AVATAR;
            });

        } catch (error) {
            console.error('Batch avatar load error:', error);
            batch.forEach((user) => {
                const img = document.getElementById(`img-${user.originalIndex}`);
                if (img) img.src = DEFAULT_AVATAR;
            });
        }
        
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
    }
}
// ЮЗЕРОВ УКАЗЫВАТЬ ТУТ
const users = [
    { id: "7388400234", originalIndex: 0 },
    { id: "1280794069", originalIndex: 1 },
    { id: "1351405260", originalIndex: 2 },
    { id: "1775352085", originalIndex: 3 },
];

async function loadItems() {
    const groupId = 7388400234;
    const targetUrl = `https://catalog.roblox.com/v2/search/items/details?Category=3&CreatorType=user&CreatorTargetId=${groupId}`;
    const container = document.getElementById('items-container');
    
    if (!container) {
        console.error('Container not found');
        return;
    }

    const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        // Получаем данные о предметах
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            signal: controller.signal
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Expected JSON but got " + contentType);
        }
        
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            container.innerHTML = '';
            
            // Фильтруем только ассеты (одежду)
            const assetItems = data.data.filter(item => 
                item.itemType === "Asset" && 
                [8, 11, 12, 17, 18, 27, 28, 29, 30, 31, 41, 42, 43].includes(item.assetType)
            );

            if (assetItems.length > 0) {
                // Создаем карточки с плейсхолдерами
                assetItems.forEach(item => {
                    const col = document.createElement('div');
                    col.className = 'col-md-4 mb-4';
                    col.id = `item-${item.id}`;
                    col.innerHTML = `
                        <div class="card shadow-sm h-100 text-center">
                            <div class="card-img-top" style="height: 200px; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text small">Type: ${getAssetTypeName(item.assetType)}</p>
                                <p class="text-center">
                                    <a href="https://www.roblox.com/catalog/${item.id}" target="_blank" class="btn btn-primary btn-sm">View Item</a>
                                </p>
                            </div>
                        </div>
                    `;
                    container.appendChild(col);
                });

                // Загружаем изображения для каждого предмета
                const imagePromises = assetItems.map(async (item) => {
                    try {
                        // Пробуем несколько вариантов получения изображения
                        const urlsToTry = [
                            `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png`,
                            `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=150x150&format=Png`,
                            `https://www.roblox.com/asset-thumbnail/image?assetId=${item.id}&width=420&height=420&format=Png`
                        ];

                        let imageUrl = null;
                        
                        for (const url of urlsToTry) {
                            try {
                                const imageResponse = await fetch(proxyUrl + encodeURIComponent(url));
                                if (imageResponse.ok) {
                                    const imageData = await imageResponse.json();
                                    if (imageData.data && imageData.data.length > 0 && imageData.data[0].imageUrl) {
                                        imageUrl = imageData.data[0].imageUrl;
                                        break;
                                    }
                                }
                            } catch (e) {
                                continue;
                            }
                        }

                        const itemElement = document.getElementById(`item-${item.id}`);
                        if (itemElement) {
                            const imgElement = itemElement.querySelector('.card-img-top');
                            if (imgElement) {
                                imgElement.innerHTML = '';
                                imgElement.style.background = 'none';
                                
                                if (imageUrl) {
                                    const img = document.createElement('img');
                                    img.src = imageUrl;
                                    img.alt = item.name;
                                    img.className = 'w-100 h-100';
                                    img.style.objectFit = 'cover';
                                    img.onerror = () => {
                                        // Если изображение не загружается, показываем плейсхолдер
                                        showImagePlaceholder(imgElement, item.name);
                                    };
                                    imgElement.appendChild(img);
                                } else {
                                    // Если изображение не найдено, показываем плейсхолдер
                                    showImagePlaceholder(imgElement, item.name);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading image for item ${item.id}:`, error);
                        const itemElement = document.getElementById(`item-${item.id}`);
                        if (itemElement) {
                            const imgElement = itemElement.querySelector('.card-img-top');
                            if (imgElement) {
                                showImagePlaceholder(imgElement, item.name);
                            }
                        }
                    }
                });

                await Promise.allSettled(imagePromises);

            } else {
                container.innerHTML = '<p class="text-center">No clothing items found.</p>';
            }
        } else {
            container.innerHTML = '<p class="text-center">No items found.</p>';
        }
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Request timed out');
            container.innerHTML = '<p class="text-center">Request timed out. Please try again.</p>';
        } else if (error instanceof TypeError) {
            console.error('Network or JSON error:', error);
            container.innerHTML = '<p class="text-center">Network error or invalid data.</p>';
        } else {
            console.error('Error fetching items:', error);
            container.innerHTML = '<p class="text-center">Failed to load items.</p>';
        }
    } finally {
        clearTimeout(timeoutId);
    }

    // Вспомогательная функция для отображения плейсхолдера
    function showImagePlaceholder(imgElement, itemName) {
        imgElement.innerHTML = '';
        imgElement.style.background = 'none';
        
        const placeholder = document.createElement('div');
        placeholder.className = 'w-100 h-100 d-flex flex-column align-items-center justify-content-center';
        placeholder.style.background = '#e9ecef';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-image fa-3x text-muted mb-2';
        
        const text = document.createElement('small');
        text.className = 'text-muted text-center';
        text.textContent = 'No image available';
        text.style.fontSize = '12px';
        
        placeholder.appendChild(icon);
        placeholder.appendChild(text);
        imgElement.appendChild(placeholder);
    }

    // Вспомогательная функция для получения названия типа ассета
    function getAssetTypeName(assetType) {
        const assetTypes = {
            8: 'Hat', 11: 'Shirt', 12: 'Pants', 17: 'Head', 18: 'Face',
            27: 'Torso', 28: 'Right Arm', 29: 'Left Arm', 30: 'Left Leg',
            31: 'Right Leg', 41: 'Hair', 42: 'Glasses', 43: 'Accessory'
        };
        return assetTypes[assetType] || `Unknown (${assetType})`;
    }
}

function showSection(id) {
    const sections = document.querySelectorAll('.section-content');
    const loader = document.getElementById('loader');
    if (document.getElementById(id).classList.contains('active')) return;
    loader.style.display = 'flex';
    sections.forEach(section => {section.classList.remove('active');});
    const activeSection = document.getElementById(id);
    activeSection.classList.add('active');
    setTimeout(() => {loader.style.display = 'none';}, 325);
    sections.forEach(section => {section.classList.remove('active');});
    const targetSection = document.getElementById(id);
    if (targetSection) {targetSection.classList.add('active');}
    if (id === 'shop') {observeCards();loadItems();}
    if (id === 'team') {observeCards();loadRobloxAvatars(users);}
}

window.addEventListener("load", function () {const loader = document.getElementById("loader");loader.style.display = "none";});
function observeCards() {
      const cards = document.querySelectorAll("#shop .card");
      const cards2 = document.querySelectorAll("#team .card");
      const observerOptions = {root: null,rootMargin: "0px",threshold: 0.1};
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      }, observerOptions);
      cards.forEach(card => {observer.observe(card);});
      cards2.forEach(card => {observer.observe(card);});
}