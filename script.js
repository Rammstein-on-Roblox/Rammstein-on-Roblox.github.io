let lastScrollTop = 0; // Переменная для отслеживания последней позиции скролла

// Переводы
const translations = {
    ru: {
        home: "Главная",
        news: "Новости",
        tour: "Туры",
        crew: "Команда проекта",
        shop: "Магазин",
        "home-title": "Добро пожаловать на официальный сайт группы Rammstein on Roblox",
        "home-desc": "Новости, концерты и музыка от самых жестоких рокеров на планете.",
        "news-title": "Новости",
        "news-desc": "Ознакомьтесь с последними новостями о группе, релизах и турне.",
        "tour-title": "Туры",
        "tour-desc": "Следите за датами концертов и не пропустите шанс увидеть Rammstein on Roblox вживую!",
        "crew-title": "Команда проекта",
        "crew-desc": "Тут вы можете узнать о команде группы Rammstein on Roblox.",
        "shop-title": "Магазин",
        "shop-desc": "Оформите заказ на эксклюзивные товары Rammstein on Roblox прямо здесь.",
        "tour-title-text": "Europe Stadium Tour 2025",
        "tour-desc": "Rammstein on Roblox Europe Stadium Tour 2025 году! Список наших концертов приведен ниже. Члены LIFAD получат доступ к эксклюзивным билетам на наши концерты и репетиции.",
        "tour-details": "Rammstein on Roblox Europe Stadium Tour 2025",
        "bottom-image": "Нашы спонсоры",
        copyright: "© 2025 Rammstein on Roblox. Все права защищены лицензией CC BY-NC-ND 4.0.",
        
        // Перевод для членов команды
        "danchik3422-name": "danchik3422",
        "danchik3422-desc": "Основатель проекта Rammstein on Roblox Tribute на Roblox.",
        "dmitriy-name": "Дмитрий Ландсберг",
        "dmitriy-desc": "Разработчик проекта Rammstein on Roblox",
        "martixlo-name": "MartixloIndex",
        "martixlo-desc": "Разработчик проекта Rammstein on Roblox",
        "ghbbhhw2265-name": "ghbbhhw2265",
        "ghbbhhw2265-desc": "Технический руководитель Rammstein on Roblox и SFX",
        "arseniy-name": "Fuchles (Arseniy_Cenalox)",
        "arseniy-desc": "Создатель идей, менеджмент туров Rammstein on Roblox",
        
        // Добавленные переводы для секции новостей
        "newsTitle": "Релиз сайта Rammstein on Roblox",
        "newsDescription": "Добро пожаловать на официальный релиз сайта Rammstein on Roblox! Исследуйте новые функции, новости и обновления.",
        
        // Переводы для товаров в магазине
        "shirt-was-ich-liebe": 'Футболка "Was Ich Liebe"',
        "shirt-angst": 'Футболка "Angst"',
        "shirt-Rammstein on Roblox": 'Футболка Rammstein on Roblox',
        "buy": "Купить",
    },
    en: {
        home: "Home",
        news: "News",
        tour: "Tours",
        crew: "Crew team",
        shop: "Shop",
        "home-title": "Welcome to the official Rammstein on Roblox website",
        "home-desc": "News, concerts, and music from the most brutal rockers on the planet.",
        "news-title": "News",
        "news-desc": "Check out the latest news about the band, releases, and tours.",
        "tour-title": "Tours",
        "tour-desc": "Follow concert dates and don't miss your chance to see Rammstein on Roblox live!",
        "crew-title": "Crew team",
        "crew-desc": "This is where you can learn about the Rammstein on Roblox group team.",
        "shop-title": "Shop",
        "shop-desc": "Place an order for exclusive Rammstein on Roblox merchandise right here.",
        "tour-title-text": "Europe Stadium Tour 2025",
        "tour-details": "Rammstein on Roblox Europe Stadium Tour 2025",
        "tour-desc": "Rammstein on Roblox Europe Stadium Tour goes into a new round in 2025! Our concert list is below. LIFAD members will get access to exclusive tickets for our concerts and rehearsals.",
        "bottom-image": "Our sponsors",
        copyright: "© 2025 Rammstein on Roblox. All rights reserved licensed under CC BY-NC-ND 4.0.",
        
        // Translation for crew members
        "danchik3422-name": "danchik3422",
        "danchik3422-desc": "Founder of this Rammstein on Roblox Tribute on Roblox project.",
        "dmitriy-name": "Dmitriy Landsberg",
        "dmitriy-desc": "Rammstein on Roblox project developer",
        "martixlo-name": "MartixloIndex",
        "martixlo-desc": "Rammstein on Roblox project developer",
        "ghbbhhw2265-name": "ghbbhhw2265",
        "ghbbhhw2265-desc": "Rammstein on Roblox Technical Supervisor and SFX",
        "arseniy-name": "Fuchles (Arseniy_Cenalox)",
        "arseniy-desc": "Rammstein on Roblox Idea maker, Tour management",
        
        // Added translations for news section
        
        
        
        // Translations for shop items
        "shirt-was-ich-liebe": 'Shirt "Was Ich Liebe"',
        "shirt-angst": 'Shirt "Angst"',
        "Shirt-Rammstein on Roblox": 'Shirt Rammstein on Roblox',
        "buy": "BUY",
    }
};

// Функция для проверки, когда элемент попадает в область видимости
function handleScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3; // Когда элемент близок к видимой части экрана

        if (elementPosition < screenPosition) {
            element.classList.add('visible');
        }
    });
}

// Добавляем обработчик события при прокрутке страницы
window.addEventListener('scroll', handleScroll);

// Вызываем функцию сразу, чтобы элементы были видимы сразу при загрузке (если они видны)
handleScroll();


// Функция для проверки видимости секций
function checkVisibility() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + window.innerHeight;

    sections.forEach(section => {
        if (section.offsetTop < scrollPosition) {
            section.classList.add('visible'); // Добавляем класс, когда секция становится видимой
            section.classList.remove('hidden'); // Убираем класс скрытия, если секция видна
        } else {
            section.classList.add('hidden'); // Добавляем класс скрытия, если секция не видна
            section.classList.remove('visible'); // Убираем класс видимости
        }
    });
}

function handleScroll() {
    let currentScrollTop = window.scrollY;

    // Проверяем, если пользователь прокручивает вниз
    if (currentScrollTop > lastScrollTop) {
        // Скроллим вниз, делаем секции видимыми
        checkVisibility();
    } else {
        // Скроллим вверх, скрываем секции с плавной анимацией
        checkVisibility();
    }

    // Обновляем последнюю позицию прокрутки
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Prevent negative scroll
}

// Слайд-шоу (смена фона)
const backgrounds = [
    'https://i.postimg.cc/qqG21Dp0/image.png', 
    'https://i.postimg.cc/HspwrmtL/image.png',
    'https://i.postimg.cc/xTtKHZs3/image.png',
    'https://i.postimg.cc/GpWbBVkp/image.png'
];

let currentBackgroundIndex = 0;
let isTransitioning = false;

function changeBackground() {
    if (isTransitioning) return; // Не менять фон, если идет переход

    isTransitioning = true;

    // Применяем новый фоновый цвет (создаём эффект перехода)
    const newBackground = backgrounds[currentBackgroundIndex];
    const body = document.body;

    // Применяем начальное состояние фона
    body.style.backgroundImage = `url(${newBackground})`;
    body.style.transition = "background-image 1s ease-in-out"; // Плавный переход

    // Через секунду отключаем анимацию, чтобы фон стабилизировался
    setTimeout(() => {
        body.style.transition = "";
        isTransitioning = false; // Разрешаем смену фона
    }, 1000);

    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
}

// Проверяем, если это главная страница (index.html)
if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    // Инициализация слайд-шоу (каждые 5 секунд)
    setInterval(changeBackground, 5000);
}

// Отслеживание прокрутки
window.addEventListener('scroll', handleScroll);

// Изначальный запуск функции для проверки видимости при загрузке страницы
window.addEventListener('load', checkVisibility);

// Обработчик события для выбора языка
document.getElementById('language-select').addEventListener('change', (e) => {
    const selectedLanguage = e.target.value;
    changeLanguage(selectedLanguage);
});

// Изначальная установка языка
changeLanguage('en');

// Обработчик клика по кнопке "BUY"
function handleClick(event) {
    event.preventDefault(); // предотвращаем немедленный переход по ссылке

    const overlay = document.getElementById("dark-overlay");
    overlay.style.display = "block"; // Показать затемняющий фон

    // Небольшая задержка перед переходом
    setTimeout(function() {
        window.location.href = event.target.href; // Переход по ссылке через 3 секунды
    }, 5000); // задержка 3 секунды для завершения анимации
}

// Добавляем обработчик клика по затемняющему фону для его скрытия
document.getElementById("dark-overlay").addEventListener("click", function() {
    this.style.display = "none";
});

function changeLanguage(language) {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        const translationKey = element.getAttribute('data-translate');
        // Если перевода нет, оставить старое значение
        element.innerText = translations[language][translationKey] || element.innerText;
    });
}

// Убираем анимацию и прокрутку, просто показываем элементы
window.addEventListener('load', () => {
    const products = document.querySelectorAll('.product');
    const titles = document.querySelectorAll('.category-title');

    // Делаем все элементы видимыми сразу
    products.forEach(product => {
        product.style.display = 'block'; // Убедитесь, что элементы видны
    });

    titles.forEach(title => {
        title.style.display = 'block'; // Убедитесь, что заголовки видны
    });
});
