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
    const lower = holidayName.toLowerCase();
    
    const emojiMap = [
        // Государственные, официальные, важные
        { keywords: ["новый год", "новогодние"], emoji: "🎄" },
        { keywords: ["рождество"], emoji: "⭐" },
        { keywords: ["день победы", "9 мая"], emoji: "🎖️" },
        { keywords: ["день россии", "день России"], emoji: "🇷🇺" },
        { keywords: ["день защитника отечества"], emoji: "🪖" },
        { keywords: ["8 марта", "женский день"], emoji: "🌷" },
        { keywords: ["день народного единства"], emoji: "🤝" },
        { keywords: ["день конституции"], emoji: "📜" },
        { keywords: ["день космонавтики"], emoji: "🚀" },
        { keywords: ["день знаний"], emoji: "📚" },
        { keywords: ["день учителя"], emoji: "🍎" },
        { keywords: ["день медицинского работника"], emoji: "🩺" },
        { keywords: ["день пограничника"], emoji: "🛡️" },
        { keywords: ["день флага"], emoji: "🏁" },
        
        // Профессиональные
        { keywords: ["программист", "it"], emoji: "💻" },
        { keywords: ["день бухгалтера", "экономист"], emoji: "🧾" },
        { keywords: ["день менеджера", "менеджер"], emoji: "📊" },
        { keywords: ["день маркетолога"], emoji: "📢" },
        { keywords: ["день секретаря"], emoji: "📎" },
        { keywords: ["день юриста", "адвокат"], emoji: "⚖️" },
        { keywords: ["день врача", "медик", "доктор"], emoji: "🩺" },
        { keywords: ["день учителя", "педагог"], emoji: "🍎" },
        { keywords: ["день строителя"], emoji: "🏗️" },
        { keywords: ["день шахтёра"], emoji: "⛏️" },
        { keywords: ["день металлурга"], emoji: "🔧" },
        { keywords: ["день энергетика"], emoji: "⚡" },
        { keywords: ["день железнодорожника"], emoji: "🚂" },
        { keywords: ["день моряка"], emoji: "⚓" },
        { keywords: ["день авиации"], emoji: "✈️" },
        { keywords: ["день таможенника"], emoji: "🛃" },
        { keywords: ["день полиции", "милиции"], emoji: "👮" },
        { keywords: ["день прокуратуры"], emoji: "⚖️" },
        { keywords: ["день судебного пристава"], emoji: "👨‍⚖️" },
        { keywords: ["день нотариата"], emoji: "✍️" },
        { keywords: ["день библиотек", "библиотекарь"], emoji: "📖" },
        { keywords: ["день пожарной охраны"], emoji: "🚒" },
        { keywords: ["день спасателя"], emoji: "🆘" },
        { keywords: ["день работников связи"], emoji: "📡" },
        { keywords: ["день риэлтора"], emoji: "🏠" },
        { keywords: ["день психолога"], emoji: "🧠" },
        { keywords: ["день социолога"], emoji: "📊" },
        { keywords: ["день архивиста"], emoji: "📂" },
        { keywords: ["день нотариуса"], emoji: "📝" },
        
        // Международные и всемирные
        { keywords: ["международный день", "всемирный день"], emoji: "🌍" },
        { keywords: ["всемирный день здоровья"], emoji: "🌍" },
        { keywords: ["всемирный день окружающей среды"], emoji: "🌿" },
        { keywords: ["всемирный день воды"], emoji: "💧" },
        { keywords: ["всемирный день животных"], emoji: "🐾" },
        { keywords: ["всемирный день туризма"], emoji: "🗺️" },
        { keywords: ["всемирный день улыбки"], emoji: "😊" },
        { keywords: ["всемирный день метеорологии"], emoji: "🌦️" },
        { keywords: ["всемирный день поэзии"], emoji: "📜" },
        { keywords: ["всемирный день театра"], emoji: "🎭" },
        
        // Еда и напитки
        { keywords: ["пиво", "пивной", "пивовар"], emoji: "🍺" },
        { keywords: ["вино", "винный"], emoji: "🍷" },
        { keywords: ["шоколад", "конфета"], emoji: "🍫" },
        { keywords: ["мороженое"], emoji: "🍦" },
        { keywords: ["торт", "пирог", "кекс", "десерт"], emoji: "🍰" },
        { keywords: ["сыр"], emoji: "🧀" },
        { keywords: ["хлеб"], emoji: "🍞" },
        { keywords: ["кофе"], emoji: "☕" },
        { keywords: ["чай"], emoji: "🍵" },
        { keywords: ["молоко"], emoji: "🥛" },
        { keywords: ["яйцо"], emoji: "🥚" },
        { keywords: ["мед"], emoji: "🍯" },
        { keywords: ["варенье"], emoji: "🍓" },
        { keywords: ["клубника"], emoji: "🍓" },
        { keywords: ["вишня"], emoji: "🍒" },
        { keywords: ["яблоко"], emoji: "🍎" },
        { keywords: ["банан"], emoji: "🍌" },
        { keywords: ["апельсин"], emoji: "🍊" },
        { keywords: ["арбуз"], emoji: "🍉" },
        { keywords: ["тыква"], emoji: "🎃" },
        { keywords: ["картофель"], emoji: "🥔" },
        { keywords: ["помидор"], emoji: "🍅" },
        { keywords: ["огурец"], emoji: "🥒" },
        { keywords: ["гриб"], emoji: "🍄" },
        { keywords: ["рыба"], emoji: "🐟" },
        { keywords: ["мясо", "стейк"], emoji: "🥩" },
        { keywords: ["бургер"], emoji: "🍔" },
        { keywords: ["пицца"], emoji: "🍕" },
        { keywords: ["паста"], emoji: "🍝" },
        { keywords: ["суп"], emoji: "🥣" },
        
        // Природа и животные
        { keywords: ["кот", "кошка"], emoji: "🐱" },
        { keywords: ["собака"], emoji: "🐶" },
        { keywords: ["птица", "воробей"], emoji: "🐦" },
        { keywords: ["пчела"], emoji: "🐝" },
        { keywords: ["бабочка"], emoji: "🦋" },
        { keywords: ["черепаха"], emoji: "🐢" },
        { keywords: ["змея"], emoji: "🐍" },
        { keywords: ["лиса"], emoji: "🦊" },
        { keywords: ["медведь"], emoji: "🐻" },
        { keywords: ["волк"], emoji: "🐺" },
        { keywords: ["олень"], emoji: "🦌" },
        { keywords: ["слон"], emoji: "🐘" },
        { keywords: ["жираф"], emoji: "🦒" },
        { keywords: ["обезьяна"], emoji: "🐒" },
        { keywords: ["лягушка"], emoji: "🐸" },
        { keywords: ["улитка"], emoji: "🐌" },
        { keywords: ["паук"], emoji: "🕷️" },
        { keywords: ["муравей"], emoji: "🐜" },
        { keywords: ["цветок", "роза"], emoji: "🌹" },
        { keywords: ["дерево"], emoji: "🌳" },
        { keywords: ["лист"], emoji: "🍂" },
        { keywords: ["солнце"], emoji: "☀️" },
        { keywords: ["луна"], emoji: "🌙" },
        { keywords: ["звезда"], emoji: "⭐" },
        
        // Праздники, связанные с профессиями (дополнительно)
        { keywords: ["день строителя"], emoji: "🏗️" },
        { keywords: ["день архитектора"], emoji: "🏛️" },
        { keywords: ["день дизайнера"], emoji: "🎨" },
        { keywords: ["день художника"], emoji: "🎨" },
        { keywords: ["день музыканта"], emoji: "🎵" },
        { keywords: ["день танцора"], emoji: "💃" },
        { keywords: ["день артиста"], emoji: "🎭" },
        { keywords: ["день журналиста"], emoji: "📰" },
        { keywords: ["день писателя"], emoji: "✍️" },
        { keywords: ["день поэта"], emoji: "📜" },
        { keywords: ["день фото"], emoji: "📸" },
        { keywords: ["день видео"], emoji: "🎥" },
        { keywords: ["день режиссёра"], emoji: "🎬" },
        { keywords: ["день сценариста"], emoji: "✍️" },
        { keywords: ["день продюсера"], emoji: "🎬" },
        { keywords: ["день звукорежиссёра"], emoji: "🎧" },
        { keywords: ["день оператора"], emoji: "📹" },
        { keywords: ["день монтажёра"], emoji: "✂️" },
        { keywords: ["день рекламиста"], emoji: "📢" },
        { keywords: ["день пиарщика"], emoji: "📣" },
        { keywords: ["день маркетолога"], emoji: "📈" },
        { keywords: ["день логиста"], emoji: "🚚" },
        { keywords: ["день завхоза"], emoji: "🔑" },
        { keywords: ["день уборщика"], emoji: "🧹" },
        { keywords: ["день охранника"], emoji: "🔒" },
        { keywords: ["день водителя"], emoji: "🚗" },
        { keywords: ["день таксиста"], emoji: "🚖" },
        { keywords: ["день дальнобойщика"], emoji: "🚛" },
        { keywords: ["день лётчика"], emoji: "✈️" },
        { keywords: ["день космонавта"], emoji: "👨‍🚀" },
        { keywords: ["день подводника"], emoji: "🐟" },
        { keywords: ["день десантника"], emoji: "🪂" },
        { keywords: ["день танкиста"], emoji: "🪖" },
        
        // Семейные и личные
        { keywords: ["день матери"], emoji: "👩‍👧" },
        { keywords: ["день отца"], emoji: "👨‍👦" },
        { keywords: ["день семьи"], emoji: "👪" },
        { keywords: ["день любви"], emoji: "💖" },
        { keywords: ["день влюблённых"], emoji: "💕" },
        { keywords: ["день друга"], emoji: "👫" },
        { keywords: ["день подруги"], emoji: "👯" },
        { keywords: ["день брата"], emoji: "👬" },
        { keywords: ["день сестры"], emoji: "👭" },
        { keywords: ["день бабушки"], emoji: "👵" },
        { keywords: ["день дедушки"], emoji: "👴" },
        { keywords: ["день ребёнка"], emoji: "🧒" },
        { keywords: ["день молодёжи"], emoji: "🧑‍🎓" },
        
        // Юмор и необычные праздники
        { keywords: ["день смеха"], emoji: "😂" },
        { keywords: ["день шутки"], emoji: "🤣" },
        { keywords: ["день улыбки"], emoji: "😁" },
        { keywords: ["день объятий"], emoji: "🤗" },
        { keywords: ["день поцелуев"], emoji: "😘" },
        { keywords: ["день лени"], emoji: "😴" },
        { keywords: ["день счастья"], emoji: "😊" },
        { keywords: ["день чуда"], emoji: "✨" },
        { keywords: ["день фантазии"], emoji: "🌈" },
        { keywords: ["день мечты"], emoji: "💭" },
        { keywords: ["день удивления"], emoji: "😮" },
        { keywords: ["день страха"], emoji: "😱" },
        { keywords: ["день любопытства"], emoji: "🤔" },
        
        // Технологии и интернет
        { keywords: ["интернет", "всемирная паутина"], emoji: "🌐" },
        { keywords: ["компьютер", "пк"], emoji: "💻" },
        { keywords: ["телефон"], emoji: "📱" },
        { keywords: ["планшет"], emoji: "📱" },
        { keywords: ["игра", "геймер"], emoji: "🎮" },
        { keywords: ["кино", "фильм"], emoji: "🎬" },
        { keywords: ["музыка", "песня"], emoji: "🎶" },
        { keywords: ["книга", "чтение"], emoji: "📚" },
        { keywords: ["блогер"], emoji: "📹" },
        { keywords: ["ютуб"], emoji: "▶️" },
        { keywords: ["тикток"], emoji: "🕺" },
        { keywords: ["инстаграм"], emoji: "📷" },
        
        // Погода и времена года
        { keywords: ["снег"], emoji: "❄️" },
        { keywords: ["зима"], emoji: "☃️" },
        { keywords: ["весна"], emoji: "🌸" },
        { keywords: ["лето"], emoji: "☀️" },
        { keywords: ["осень"], emoji: "🍂" },
        { keywords: ["дождь"], emoji: "☔" },
        { keywords: ["гроза"], emoji: "⛈️" },
        { keywords: ["радуга"], emoji: "🌈" },
        
        // Дополнительные ключевые слова из вашего старого списка
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
    
    // Поиск по ключевым словам
    for (const item of emojiMap) {
        if (item.keywords.some(keyword => lower.includes(keyword))) {
            return item.emoji;
        }
    }
    
    // Эмодзи по умолчанию
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
// Функция для открытия поиска праздника
function searchHoliday(holidayName) {
    // Очищаем название от эмодзи и лишних пробелов
    const cleanName = holidayName.replace(/[🍻🎉☭🏛️🐝🎂🍺...]/g, '').trim();
    // Формируем URL поиска (Google)
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanName)}`;
    // Открываем в новой вкладке
    window.open(searchUrl, '_blank');
}
// ========== ИНИЦИАЛИЗАЦИЯ ==========
loadHolidaysData();
