// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let holidaysData = {};
let emojiMapData = [];        // будет заполнено из emojis.json
let currentQueue = [];
let queuePointer = 0;
let lastDateKey = '';
let dataLoaded = false;
let emojiLoaded = false;
let pendingUpdate = false;

// ========== ЗАГРУЗКА ЭМОДЗИ ==========
async function loadEmojis() {
    try {
        const response = await fetch('data/emojis.json');
        if (!response.ok) throw new Error('Ошибка загрузки emojis.json');
        emojiMapData = await response.json();
        emojiLoaded = true;
        console.log('✅ Данные эмодзи загружены');
    } catch (error) {
        console.error('❌ Не удалось загрузить эмодзи:', error);
        emojiLoaded = true; // чтобы не блокировать работу
    }
}

// ========== ФУНКЦИЯ ПОДБОРА ЭМОДЗИ (использует загруженные данные) ==========
function getEmojiForHoliday(holidayName) {
    const lower = holidayName.toLowerCase();
    if (emojiMapData.length === 0) return "🍻"; // fallback, если ещё не загружено
    for (const item of emojiMapData) {
        if (item.keywords.some(keyword => lower.includes(keyword))) {
            return item.emoji;
        }
    }
    return "🍻";
}

// ========== ЗАГРУЗКА ПРАЗДНИКОВ ==========
async function loadHolidaysData() {
    try {
        const response = await fetch('data/holidays.json');
        if (!response.ok) throw new Error('Ошибка загрузки holidays.json');
        holidaysData = await response.json();
        dataLoaded = true;
        console.log('✅ Данные праздников загружены');
        if (pendingUpdate) {
            rebuildQueue(getTodayKey());
            updateHoliday();
            pendingUpdate = false;
        }
    } catch (error) {
        console.error('❌ Не удалось загрузить праздники:', error);
        holidaysData = {};
        dataLoaded = true;
        if (pendingUpdate) {
            rebuildQueue(getTodayKey());
            updateHoliday();
            pendingUpdate = false;
        }
    }
}

// ========== ЛОГИКА ОЧЕРЕДИ ==========
function getTodayKey() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}.${day}`;
}

function rebuildQueue(dateKey) {
    const holidaysList = holidaysData[dateKey];
    if (!holidaysList || holidaysList.length === 0) {
        currentQueue = [{
            name: "Сегодня особенных праздников нет, но пиво всегда есть!",
            emoji: "🍺"
        }];
    } else {
        currentQueue = holidaysList.map(name => ({
            name: name,
            emoji: getEmojiForHoliday(name)
        }));
    }
    queuePointer = 0;
    lastDateKey = dateKey;
}

function getNextHoliday() {
    const todayKey = getTodayKey();
    if (todayKey !== lastDateKey) {
        rebuildQueue(todayKey);
    }
    if (currentQueue.length === 0) {
        return { name: "Нет данных", emoji: "🍺" };
    }
    const holiday = currentQueue[queuePointer];
    queuePointer = (queuePointer + 1) % currentQueue.length;
    return holiday;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== ФУНКЦИЯ ПОИСКА ==========
function searchHoliday(holidayName) {
    const cleanName = holidayName.replace(/[🍻🎉☭🏛️🐝🎂🍺]/g, '').trim();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanName)}`;
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.openLink(searchUrl);
    } else {
        window.open(searchUrl, '_blank');
    }
}

// ========== ОБНОВЛЕНИЕ КАРТОЧКИ ==========
function updateHoliday() {
    if (!dataLoaded || !emojiLoaded) {
        pendingUpdate = true;
        return;
    }
    const holiday = getNextHoliday();
    const container = document.getElementById('holidayContent');
    const holidayCard = document.getElementById('holidayCard');
    
    let emojiHtml = holiday.emoji;
    if (holiday.emoji === "☭") {
        emojiHtml = '<span class="red-emoji">☭</span>';
    }
    container.innerHTML = `<div class="holiday-name" data-holiday-name="${escapeHtml(holiday.name)}">${emojiHtml} ${escapeHtml(holiday.name)}</div>`;
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    holidayCard.setAttribute('data-date', `${day}.${month}.${year}`);
    
    const holidayNameDiv = document.querySelector('.holiday-name');
    if (holidayNameDiv) {
        holidayNameDiv.style.cursor = 'pointer';
        holidayNameDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = holidayNameDiv.getAttribute('data-holiday-name');
            searchHoliday(name);
        });
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ (параллельная загрузка) ==========
Promise.all([loadEmojis(), loadHolidaysData()]).then(() => {
    if (dataLoaded && emojiLoaded) {
        rebuildQueue(getTodayKey());
        updateHoliday();
    }
});
