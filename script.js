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
        "https://api.allorigins.win/raw?url=",
        "https://api.codetabs.com/v1/proxy?quest="
    ];

    for (let i = 0; i < usersToShow.length; i += BATCH_SIZE) {
        const batch = usersToShow.slice(i, i + BATCH_SIZE);
        
        // Показываем загрузку
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
            
            // Параллельные запросы ко всем прокси
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

            // Используем первый успешный ответ
            const results = await Promise.allSettled(proxyPromises);
            for (const result of results) {
                if (result.status === 'fulfilled' && result.value && result.value.data) {
                    avatarData = result.value;
                    break;
                }
            }

            // Обновляем изображения
            batch.forEach((user) => {
                const img = document.getElementById(`img-${user.originalIndex}`);
                if (!img) return;

                if (avatarData && avatarData.data) {
                    const userAvatar = avatarData.data.find(item => item.targetId === parseInt(user.id));
                    if (userAvatar && userAvatar.imageUrl) {
                        // Предзагрузка изображения
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
// Пример использования
const users = [
    { id: "7388400234", originalIndex: 0 },
    { id: "1280794069", originalIndex: 1 },
    { id: "1351405260", originalIndex: 2 },
    { id: "1775352085", originalIndex: 3 },
];

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
    if (id === 'shop') {observeCards();}
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