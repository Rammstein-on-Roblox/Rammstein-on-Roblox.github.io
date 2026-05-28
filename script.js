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

    if (document.getElementById('shop').classList.contains('active')) {
        loadItems();
    }
    setTimeout(() => {
        observeCards();
    }, 800);

    initAboutVideo();
});

function observeCards() {
    const cards = document.querySelectorAll("#team .card, #shop .card");
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

    var aboutVideo = document.getElementById("aboutVideo");
    if (id === 'about') {
        initAboutVideo();
    } else {
        if (aboutVideo) {
            aboutVideo.pause();
            aboutVideo.removeAttribute('src');
            aboutVideo.load();
            hideAboutControlsImmediately();
        }
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
    if (!container) return;

    container.innerHTML = '';

    const groupId = 35005739;
    const cacheBuster = new Date().getTime();
    const apiUrl = `https://catalog.roproxy.com/v1/search/items/details?Category=3&CreatorType=Group&CreatorTargetId=${groupId}&Limit=30&cb=${cacheBuster}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            "Accept-Language": "en-US,en;q=0.9"
        }
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (!data.data || !Array.isArray(data.data)) return;

        const items = data.data.map(item => {
            let finalName = item.originalName || item.name || "Unknown Item";
            finalName = finalName
                .replace(/\s*-\s*(Рубашка|Штаны|Футболка|Одежда)/gi, '')
                .replace(/\[\s*(Рубашка|Штаны|Футболка)\s*\]/gi, '')
                .trim();

            let displayPrice = "Off Sale";
            if (item.price !== undefined && item.price !== null) {
                displayPrice = `${item.price} R$`;
            }

            return {
                id: item.id,
                name: finalName,
                price: displayPrice
            };
        });

        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-3 mb-5';

            col.innerHTML = `
                <div class="card store-card visible" 
                     onclick="window.open('https://www.roblox.com/catalog/${item.id}', '_blank')" 
                     style="cursor: pointer;">
                    <div class="store-img-container">
                        <img id="thumb-${item.id}" 
                             src="img/roblox-150.png" 
                             alt="${item.name}" 
                             class="store-img">
                    </div>
                    <div class="store-info">
                        <div class="store-title">${item.name.toUpperCase()}</div>
                        <div class="store-price-row">
                            <span class="price-current">${item.price}</span>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        items.forEach(item => loadItemThumbnail(item.id));
    })
    .catch(err => {
        console.error(err);
    });
}

function loadItemThumbnail(itemId) {
    const img = document.getElementById(`thumb-${itemId}`);
    if (!img) return;

    const apiUrl = `https://thumbnails.roproxy.com/v1/assets?assetIds=${itemId}&size=512x512&format=Png&isCircular=false`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.data && data.data[0] && data.data[0].imageUrl) {
                img.src = data.data[0].imageUrl;
            } else {
                throw new Error();
            }
        })
        .catch(() => {
            img.src = "img/logo.jpg";
        });
}

function openPhotoModal(cardElement) {
    const img = cardElement.querySelector('.gallery-img');
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const infoWhere = document.getElementById('infoWhere');
    const infoWhen = document.getElementById('infoWhen');
    const infoBy = document.getElementById('infoBy');

    if (!img || !modal) return;

    modalImg.src = img.src;
    infoWhere.textContent = img.getAttribute('data-info-where') || 'Unknown';
    infoWhen.textContent = img.getAttribute('data-info-when') || 'Unknown';
    if (infoBy) {
        infoBy.textContent = img.getAttribute('data-info-by') || 'Unknown Creator';
    }

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

let controlsTimer;

function resetControlsTimer() {
    var controls = document.getElementById("videoControls");
    if (controls) {
        controls.classList.remove("hide-controls");
    }
    clearTimeout(controlsTimer);
    controlsTimer = setTimeout(function() {
        if (controls) {
            controls.classList.add("hide-controls");
        }
    }, 1000);
}

function hideControlsImmediately() {
    clearTimeout(controlsTimer);
    var controls = document.getElementById("videoControls");
    if (controls) {
        controls.classList.add("hide-controls");
    }
}

function toggleMobileMenu() {
    var sidebar = document.getElementById("mobileSidebar");
    var video = document.getElementById("menuVideo");
    var muteBtn = document.getElementById("videoMuteBtn");
    var volumeSlider = document.getElementById("videoVolumeSlider");
    
    sidebar.classList.toggle("open");
    
    if (sidebar.classList.contains("open")) {
        video.src = "img/trailer.mp4";
        video.load();
        video.muted = true;
        if (volumeSlider) {
            video.volume = volumeSlider.value;
        }
        if (muteBtn) {
            muteBtn.innerText = "SOUND: OFF";
            muteBtn.style.color = "#ae1d1d";
            muteBtn.style.borderColor = "#ae1d1d";
        }
        video.play().catch(function(error) {
            console.log("Autoplay blocked:", error);
        });
        resetControlsTimer();
    } else {
        video.pause();
        video.removeAttribute('src'); 
        video.load();
        hideControlsImmediately();
    }
}

function toggleVideoPlay() {
    var video = document.getElementById("menuVideo");
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function toggleVideoSound(event) {
    event.stopPropagation();
    var video = document.getElementById("menuVideo");
    var muteBtn = document.getElementById("videoMuteBtn");
    var volumeSlider = document.getElementById("videoVolumeSlider");
    if (video.muted) {
        video.muted = false;
        if (video.volume === 0) {
            video.volume = 0.5;
            if (volumeSlider) volumeSlider.value = 0.5;
        }
        muteBtn.innerText = "SOUND: ON";
        muteBtn.style.color = "#5bb35f";
        muteBtn.style.borderColor = "#5bb35f";
    } else {
        video.muted = true;
        muteBtn.innerText = "SOUND: OFF";
        muteBtn.style.color = "#ae1d1d";
        muteBtn.style.borderColor = "#ae1d1d";
    }
}

function handleVolumeChange(value) {
    var video = document.getElementById("menuVideo");
    var muteBtn = document.getElementById("videoMuteBtn");
    video.volume = value;
    if (value > 0) {
        video.muted = false;
        muteBtn.innerText = "SOUND: ON";
        muteBtn.style.color = "#5bb35f";
        muteBtn.style.borderColor = "#5bb35f";
    } else {
        video.muted = true;
        muteBtn.innerText = "SOUND: OFF";
        muteBtn.style.color = "#ae1d1d";
        muteBtn.style.borderColor = "#ae1d1d";
    }
}

function handleMobileNav(sectionId) {
    showSection(sectionId);
    const sidebar = document.getElementById('mobileSidebar');
    if (sidebar) sidebar.classList.remove('open');
}

let aboutControlsTimer;

function initAboutVideo() {
    var video = document.getElementById("aboutVideo");
    var muteBtn = document.getElementById("aboutVideoMuteBtn");
    var volumeSlider = document.getElementById("aboutVideoVolumeSlider");
    if (!video) return;
    video.src = "img/trailer.mp4";
    video.load();
    video.muted = true;
    if (volumeSlider) {
        video.volume = volumeSlider.value;
    }
    if (muteBtn) {
        muteBtn.innerText = "SOUND: OFF";
        muteBtn.style.color = "#ae1d1d";
        muteBtn.style.borderColor = "#ae1d1d";
    }
    video.play().catch(function(error) {
        console.log("About video autoplay blocked:", error);
    });
    resetAboutControlsTimer();
}

function resetAboutControlsTimer() {
    var controls = document.getElementById("aboutVideoControls");
    if (controls) {
        controls.classList.remove("hide-controls");
    }
    clearTimeout(aboutControlsTimer);
    aboutControlsTimer = setTimeout(function() {
        if (controls) {
            controls.classList.add("hide-controls");
        }
    }, 1000);
}

function hideAboutControlsImmediately() {
    clearTimeout(aboutControlsTimer);
    var controls = document.getElementById("aboutVideoControls");
    if (controls) {
        controls.classList.add("hide-controls");
    }
}

function toggleAboutVideoPlay() {
    var video = document.getElementById("aboutVideo");
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function toggleAboutVideoSound(event) {
    event.stopPropagation();
    var video = document.getElementById("aboutVideo");
    var muteBtn = document.getElementById("aboutVideoMuteBtn");
    var volumeSlider = document.getElementById("aboutVideoVolumeSlider");
    if (video.muted) {
        video.muted = false;
        if (video.volume === 0) {
            video.volume = 0.5;
            if (volumeSlider) volumeSlider.value = 0.5;
        }
        muteBtn.innerText = "SOUND: ON";
        muteBtn.style.color = "#5bb35f";
        muteBtn.style.borderColor = "#5bb35f";
    } else {
        video.muted = true;
        muteBtn.innerText = "SOUND: OFF";
        muteBtn.style.color = "#ae1d1d";
        muteBtn.style.borderColor = "#ae1d1d";
    }
}

function handleAboutVolumeChange(value) {
    var video = document.getElementById("aboutVideo");
    var muteBtn = document.getElementById("aboutVideoMuteBtn");
    video.volume = value;
    if (value > 0) {
        video.muted = false;
        muteBtn.innerText = "SOUND: ON";
        muteBtn.style.color = "#5bb35f";
        muteBtn.style.borderColor = "#5bb35f";
    } else {
        video.muted = true;
        muteBtn.innerText = "SOUND: OFF";
        muteBtn.style.color = "#ae1d1d";
        muteBtn.style.borderColor = "#ae1d1d";
    }
}