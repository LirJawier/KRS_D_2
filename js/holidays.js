// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let holidaysData = {};          // будет заполнено из JSON
let currentQueue = [];
let queuePointer = 0;
let lastDateKey = '';
let dataLoaded = false;
let pendingUpdate = false;

// ========== ФУНКЦИЯ ЗАГРУЗКИ ДАННЫХ ==========
async function loadHolidaysData() {
    try {
        const response = await fetch('data/holidays.json');
        if (!response.ok) throw new Error('Ошибка загрузки holidays.json');
        holidaysData = await response.json();
        dataLoaded = true;
        console.log('✅ Данные праздников загружены');
        
        // Если было отложенное обновление — выполняем
        if (pendingUpdate) {
            rebuildQueue(getTodayKey());
            updateHoliday();
            pendingUpdate = false;
        }
    } catch (error) {
        console.error('❌ Не удалось загрузить праздники:', error);
        // Фallback: пустой объект, чтобы не ломалась очередь
        holidaysData = {};
        dataLoaded = true;
        if (pendingUpdate) {
            rebuildQueue(getTodayKey());
            updateHoliday();
            pendingUpdate = false;
        }
    }
}

// ========== ФУНКЦИЯ ПОДБОРА ЭМОДЗИ ==========
function getEmojiForHoliday(holidayName) {
    const lowerName = holidayName.toLowerCase();
    const emojiMap = [
        { keywords: ["пионерии", "пионер"], emoji: "☭" },
        { keywords: ["джинсов"], emoji: "👖" },
        { keywords: ["кубик рубика", "рубика"], emoji: "🧩" },
        { keywords: ["пчел", "пчела"], emoji: "🐝" },
        { keywords: ["музеев", "музей"], emoji: "🏛️" },
        { keywords: ["вакцины", "спид"], emoji: "💉" },
        { keywords: ["памяти"], emoji: "🕯️" },
        { keywords: ["посуды"], emoji: "🍽️" },
        { keywords: ["розовой пантеры"], emoji: "🐆" },
        { keywords: ["сырного суфле"], emoji: "🧀" },
        { keywords: ["торта", "devil's food cake"], emoji: "🍰" },
        { keywords: ["пивной", "пиво"], emoji: "🍺" },
        { keywords: ["врача-травматолога", "травматолог"], emoji: "🩺" },
        { keywords: ["метрологии"], emoji: "📏" },
        { keywords: ["волги"], emoji: "🌊" },
        { keywords: ["миллионера"], emoji: "💰" },
        { keywords: ["клубники"], emoji: "🍓" },
        { keywords: ["переводчика"], emoji: "📖" },
        { keywords: ["полярника"], emoji: "❄️" },
        { keywords: ["тихоокеанского флота"], emoji: "⚓" },
        { keywords: ["безработицы"], emoji: "📉" },
        { keywords: ["космоса"], emoji: "🚀" }
    ];
    for (const item of emojiMap) {
        if (item.keywords.some(keyword => lowerName.includes(keyword))) return item.emoji;
    }
    return "🍻";
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

function updateHoliday() {
    if (!dataLoaded) {
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
    container.innerHTML = `<div class="holiday-name">${emojiHtml} ${escapeHtml(holiday.name)}</div>`;
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    holidayCard.setAttribute('data-date', `${day}.${month}.${year}`);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
loadHolidaysData();
