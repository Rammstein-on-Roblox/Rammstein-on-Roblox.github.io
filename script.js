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
    const BATCH_SIZE = 10;const DELAY_BETWEEN_BATCHES_MS = 100;
    const DEFAULT_AVATAR = 'img/1.png';const LOADING_IMAGE = 'img/roblox-150.png';
    const PROXY_SERVERS = ["https://api.codetabs.com/v1/proxy?quest="];
    for (let i = 0; i < usersToShow.length; i += BATCH_SIZE) {
        const batch = usersToShow.slice(i, i + BATCH_SIZE);
        batch.forEach((user) => {const img = document.getElementById(`img-${user.originalIndex}`);if (img) img.src = LOADING_IMAGE;});
        const validUsers = batch.filter(user => user.id && !isNaN(Number(user.id)));
        if (validUsers.length === 0) continue;
        try {
            const userIds = validUsers.map(user => user.id);
            const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.join(',')}&size=420x420&format=Png&isCircular=false`;
            let avatarData = null;
            const proxyPromises = PROXY_SERVERS.map(proxy => 
                fetch(proxy + encodeURIComponent(apiUrl), {headers: { 'Accept': 'application/json' }})
                .then(response => response.ok ? response.json() : null)
                .catch(e => {console.error(`Proxy error (${proxy}):`, e);return null;})
            );
            const results = await Promise.allSettled(proxyPromises);
            for (const result of results) {if (result.status === 'fulfilled' && result.value && result.value.data) {avatarData = result.value;break;}}
            batch.forEach((user) => {const img = document.getElementById(`img-${user.originalIndex}`);
                if (!img) return;
                if (avatarData && avatarData.data) {
                    const userAvatar = avatarData.data.find(item => item.targetId === parseInt(user.id));
                    if (userAvatar && userAvatar.imageUrl) {
                        const tempImg = new Image();tempImg.onload = function() {img.src = userAvatar.imageUrl;};
                        tempImg.onerror = function() {img.src = DEFAULT_AVATAR;};tempImg.src = userAvatar.imageUrl;return;
                    }
                }img.src = DEFAULT_AVATAR;
            });
        } catch (error) {console.error('Batch avatar load error:', error);batch.forEach((user) => {const img = document.getElementById(`img-${user.originalIndex}`);if (img) img.src = DEFAULT_AVATAR;});}
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
    }
}
// ЮЗЕРОВ УКАЗЫВАТЬ ТУТ
const users = [
    { id: "7388400234", originalIndex: 0 },{ id: "1280794069", originalIndex: 1 },
    { id: "1351405260", originalIndex: 2 },{ id: "1775352085", originalIndex: 3 },
];

async function loadItems() {
    const groupId = 7388400234;
    const targetUrl = `https://catalog.roblox.com/v2/search/items/details?Category=3&CreatorType=user&CreatorTargetId=${groupId}`;
    const container = document.getElementById('items-container');
    
    if (!container) {
        console.log('Container not found');
        return;
    }
    container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-light"></div></div>';
    console.log('Started loading items...');

    try {
        console.log('Fetching items data...');
        const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=";
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('Items data request timeout');
            controller.abort();
        }, 10000);

        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            console.log('Response not OK:', response.status);
            return;
        }
        
        const data = await response.json();
        console.log('Received items data:', data);
        
        if (!data.data || data.data.length === 0) {
            console.log('No data in response');
            return;
        }

        const assetItems = data.data.filter(item => 
            item.itemType === "Asset" && [8, 11, 12, 17, 18, 27, 28, 29, 30, 31, 41, 42, 43].includes(item.assetType)
        );
        
        if (assetItems.length === 0) {
            console.log('No asset items found');
            return;
        }
        console.log('Found', assetItems.length, 'asset items');
        container.innerHTML = '';
        assetItems.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-2 mb-2';
            col.id = `item-${item.id}`;
            col.innerHTML = `
                <div class="card shadow-sm h-100 text-center">
                    <div class="card-img-top" style="height: 200px; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                        <div class="spinner-border text-primary"></div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="text-center">
                            <a href="https://www.roblox.com/catalog/${item.id}" target="_blank">Buy</a>
                        </p>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        const BATCH_SIZE = 3;
        const DELAY_BETWEEN_BATCHES_MS = 300;

        console.log('Starting image loading in batches...');
        
        for (let i = 0; i < assetItems.length; i += BATCH_SIZE) {
            const batch = assetItems.slice(i, i + BATCH_SIZE);
            const itemIds = batch.map(item => item.id).join(',');
            
            console.log('Processing batch:', batch.map(item => item.id));
            
            try {
                const imageUrls = [
                    `https://thumbnails.roblox.com/v1/assets?assetIds=${itemIds}&size=420x420&format=Png`,
                    `https://thumbnails.roblox.com/v1/assets?assetIds=${itemIds}&size=150x150&format=Png`,
                    `https://thumbnails.roblox.com/v1/assets?assetIds=${itemIds}&size=100x100&format=Png`
                ];
                let imagesData = null;
                let success = false;
                for (const url of imageUrls) {
                    try {
                        console.log('Trying image URL:', url);
                        
                        const imageController = new AbortController();
                        const imageTimeout = setTimeout(() => {
                            console.log('Image request timeout for URL:', url);
                            imageController.abort();
                        }, 5000);

                        const imageResponse = await fetch(proxyUrl + encodeURIComponent(url), {
                            signal: imageController.signal
                        });
                        
                        clearTimeout(imageTimeout);

                        if (imageResponse.ok) {
                            imagesData = await imageResponse.json();
                            console.log('Image data received:', imagesData);
                            
                            if (imagesData && imagesData.data && imagesData.data.length > 0) {
                                success = true;
                                console.log('Image batch successful');
                                break;
                            }
                        }
                    } catch (imageError) {
                        console.log('Image request failed for URL:', url, imageError);
                        continue;
                    }
                }

                if (success && imagesData) {
                    batch.forEach(item => {
                        const imgElement = document.querySelector(`#item-${item.id} .card-img-top`);
                        if (!imgElement) return;

                        const itemImage = imagesData.data.find(img => img.targetId === item.id);
                        if (itemImage && itemImage.imageUrl) {
                            console.log('Setting image for item:', item.id);
                            imgElement.innerHTML = `<img src="${itemImage.imageUrl}" alt="${item.name}" class="w-100 h-100" style="object-fit: cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-100 h-100 d-flex flex-column align-items-center justify-content-center\\' style=\\'background: #e9ecef;\\'><i class=\\'fas fa-image fa-3x text-muted mb-2\\'></i><small class=\\'text-muted\\'>No image</small></div>'">`;
                        } else {
                            imgElement.innerHTML = `
                                <div class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background: #e9ecef;">
                                    <i class="fas fa-image fa-3x text-muted mb-2"></i>
                                    <small class="text-muted">No image</small>
                                </div>
                            `;
                        }
                    });
                } else {
                    console.log('All image URLs failed for batch');
                    batch.forEach(item => {
                        const imgElement = document.querySelector(`#item-${item.id} .card-img-top`);
                        if (imgElement) {
                            imgElement.innerHTML = `
                                <div class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background: #e9ecef;">
                                    <i class="fas fa-image fa-3x text-muted mb-2"></i>
                                    <small class="text-muted">Load failed</small>
                                </div>
                            `;
                        }
                    });
                }

            } catch (batchError) {
                console.log('Batch processing error:', batchError);
            }
            if (i + BATCH_SIZE < assetItems.length) {
                console.log('Waiting before next batch...');
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
            }
        }

        console.log('All batches processed');

    } catch (error) {
        console.log('Global loading error:', error);
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
    if (id === 'shop') {loadItems().then(() => {observeCards();});}
    if (id === 'team') {loadRobloxAvatars(users).then(() => {observeCards();});}
}

window.addEventListener("load", function () {const loader = document.getElementById("loader");loader.style.display = "none";});
/*function observeCards() {
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
}*/

function observeCards() {
    const cards = document.querySelectorAll("#shop .card, #team .card");
    const observerOptions = {root: null, rootMargin: "0px", threshold: 0.1};
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {entry.target.classList.add("visible");
            } else {entry.target.classList.remove("visible");}
        });
    }, observerOptions);
    cards.forEach(card => {observer.observe(card);});
    console.log(`Observing ${cards.length} cards`);
}