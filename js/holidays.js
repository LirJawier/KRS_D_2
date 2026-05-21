// ========== ДАННЫЕ ПРАЗДНИКОВ ==========
const holidaysData = {
    "05.18": ["Международный день музеев", "Арина Капустница (Рассадница)", "Всемирный день вакцины против СПИДа", "День памяти жертв депортации народов Крыма", "День памяти иконы «Неупиваемая чаша»", "День без грязной посуды", "День рождения майского жжжжука", "День Розовой Пантеры", "День сырного суфле"],
    "05.19": ["День пионерии", "День рождения Кубика Рубика", "Иов Горошник", "День конной авиации", "День подразделений служебно-боевой подготовки МВД РФ", "День русской печи", "День пищевой революции", "День парусов на горизонте", "Всемирный день борьбы с воспалительными заболеваниями кишечника", "Всемирный день борьбы с гепатитом С", "День торта «Devil`s Food Cake»"],
    "05.20": ["Всемирный день врача-травматолога", "Всемирный день метрологии", "День рождения джинсов", "Купальница", "Всемирный день пчел", "День Волги", "Европейский день моря", "День миллионера", "День собранной клубники", "День ветряных вертушек", "Праздник разливаний", "День пирога «Киш Лорен»"],
    "05.21": ["День военного переводчика", "День инвентаризатора (День работника БТИ)", "День полярника", "День Тихоокеанского флота ВМФ России", "Вознесение Господне", "День защиты от безработицы", "Всемирный день культурного разнообразия во имя диалога и развития", "Международный день космоса", "Иван Долгий", "День работников культуры и искусства – Казахстан", "День официантов и официанток", "День музы и вдохновения", "День обмена талисманами", "День клубники со сливками"]
};

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

// ========== ЛОГИКА ОЧЕРЕДИ ПРАЗДНИКОВ ==========
let currentQueue = [];
let queuePointer = 0;
let lastDateKey = '';

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

// Инициализация очереди
rebuildQueue(getTodayKey());
