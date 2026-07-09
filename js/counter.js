<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Ну, за...</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', 'Arial', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            position: relative;
            z-index: 0;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: -1;
        }

        .content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 85vh;
            max-width: 550px;
            width: 100%;
        }

        .center-block {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
        }

        .bottom-block {
            text-align: center;
            width: 100%;
            margin-bottom: 30px;
        }

        .holiday-card {
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(12px);
            border-radius: 0;
            padding: 25px 20px;
            width: 100%;
            border: 2px solid #FFD966;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            text-align: center;
            position: relative;
            margin-top: 150px;
        }

        .holiday-card::before {
            content: "Ну, за...";
            position: absolute;
            top: 15px;
            left: 20px;
            font-size: 20px;
            font-weight: bold;
            color: #FFD966;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            opacity: 0.8;
            letter-spacing: 1px;
        }

        .holiday-card::after {
            content: attr(data-date);
            position: absolute;
            bottom: 15px;
            right: 20px;
            font-size: 12px;
            font-weight: bold;
            color: #FFD966;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            opacity: 0.7;
            letter-spacing: 0.5px;
        }

        .holiday-name {
            font-size: 26px;
            font-weight: bold;
            color: #FFD966;
            word-break: break-word;
            line-height: 1.4;
            margin-top: 20px;
        }

        .red-emoji {
            color: #ff3333;
            display: inline-block;
        }

        .refresh-btn {
            background: #2c2c2c;
            border: 2px solid #FFD966;
            border-radius: 0;
            padding: 12px 28px;
            font-weight: bold;
            font-size: 15px;
            color: #FFD966;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .refresh-btn:hover {
            background: #3a3a3a;
            border-color: #ffec80;
            transform: scale(1.02);
        }

        .avatars-container {
            display: flex;
            justify-content: center;
            gap: clamp(8px, 3vw, 15px);
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 5px 0;
        }

        .avatar-circle {
            width: clamp(40px, 10vw, 55px);
            height: clamp(40px, 10vw, 55px);
            flex-shrink: 1;
            min-width: 35px;
            border-radius: 50%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255,255,255,0.6);
            transition: transform 0.2s ease;
            cursor: pointer;
        }

        .avatar-circle:hover {
            transform: scale(1.05);
            border-color: #FFD966;
        }

        .avatar-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .avatar-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e94560;
            color: white;
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .footer-note {
            font-size: 12px;
            font-weight: bold;
            color: #FFD966;
            margin-top: 15px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            letter-spacing: 1px;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: #2c2c2c;
            border: 2px solid #FFD966;
            border-radius: 0;
            padding: 30px 40px;
            text-align: center;
            max-width: 350px;
            width: 90%;
            position: relative;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }

        .modal-text {
            font-size: 18px;
            font-weight: bold;
            color: #FFD966;
            margin-bottom: 25px;
            line-height: 1.4;
        }

        .modal-close {
            background: #2c2c2c;
            border: 2px solid #FFD966;
            border-radius: 0;
            padding: 8px 24px;
            font-weight: bold;
            font-size: 14px;
            color: #FFD966;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-block;
        }

        .modal-close:hover {
            background: #3a3a3a;
            border-color: #ffec80;
            transform: scale(1.02);
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
    </style>
</head>
<body>

    <!-- СЧЁТЧИК ЯНДЕКС МЕТРИКИ -->
    <script>
        function sendMetrikaHit() {
            if (typeof Ya !== 'undefined' && Ya.Metrika) {
                Ya.Metrika.reachGoal('PAGE_VIEW');
                console.log('[Метрика] Хит отправлен');
            } else {
                console.warn('[Метрика] Счетчик еще не загружен');
            }
        }
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(109341190, 'init', {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            trackHash:true
        });
        window.addEventListener('load', sendMetrikaHit);
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/109341190" style="position:absolute; left:-9999px;" alt="" /></div></noscript>

<div class="content">
    <div class="center-block">
        <div class="holiday-card" id="holidayCard">
            <div id="holidayContent">
                <div class="holiday-name">Загрузка...</div>
            </div>
        </div>
    </div>

    <div class="bottom-block">
        <button class="refresh-btn" id="refreshBtn">
            <span>🍺</span> Давай по новой, Гоша, все х*ня
        </button>
        <div class="avatars-container" id="avatarsContainer"></div>
        <div class="footer-note">
            5 ВСАДНИКОВ ПИВОПОКАЛИПСИСА
        </div>
    </div>
</div>

<div id="modal" class="modal">
    <div class="modal-content">
        <div class="modal-text" id="modalText">здесь могла быть реклама Всадника</div>
        <button class="modal-close" id="modalCloseBtn">Закрыть</button>
    </div>
</div>

<!-- БЛОК СТАТИСТИКИ -->
<div id="stats" style="position: fixed; bottom: 10px; left: 10px; font-size: 10px; color: white; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 5px; z-index: 999; opacity: 0.7;">
    <span id="total">0</span> | <span id="unique">0</span>
</div>

<script>
    // ========== ОСНОВНЫЕ НАСТРОЙКИ ==========
    const MY_BACKGROUND = "https://raw.githubusercontent.com/LirJawier/KRS_D_2/refs/heads/main/krsn6.jpeg";
    document.body.style.backgroundImage = `url('${MY_BACKGROUND}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    const BOT_API_URL = "https://kd-lirjawier.amvera.io";

    // ========== ФУНКЦИЯ ОЖИДАНИЯ TELEGRAM ==========
    async function getTelegramUser() {
        return new Promise((resolve) => {
            // Если уже доступно
            if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
                resolve(window.Telegram.WebApp.initDataUnsafe.user);
                return;
            }
            
            // Ждём до 3 секунд
            let attempts = 0;
            const maxAttempts = 75; // 3 секунды (по 40мс)
            const interval = setInterval(() => {
                attempts++;
                if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
                    clearInterval(interval);
                    resolve(window.Telegram.WebApp.initDataUnsafe.user);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve(null); // Не дождались — считаем, что это обычный браузер
                }
            }, 40);
        });
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ ==========
    let userId = localStorage.getItem('tg_user_id');
    let userUsername = localStorage.getItem('tg_username');

    async function initUser() {
        // Если уже есть ID в localStorage — используем его (но можем обновить username)
        if (userId) {
            // Проверим, не появился ли username в Telegram (если пользователь добавил его позже)
            const tgUser = await getTelegramUser();
            if (tgUser && tgUser.username && userUsername !== tgUser.username) {
                userUsername = tgUser.username;
                localStorage.setItem('tg_username', userUsername);
            }
            await trackVisit();
            await loadStats();
            return;
        }
        
        // Нет ID — получаем из Telegram или создаём web_
        const tgUser = await getTelegramUser();
        
        if (tgUser) {
            userId = tgUser.id.toString();
            userUsername = tgUser.username || null;
            console.log('✅ Telegram user:', userId, 'Username:', userUsername);
        } else {
            userId = 'web_' + Math.random().toString(36).substr(2, 9);
            userUsername = null;
            console.log('🌐 Web user:', userId);
        }
        
        localStorage.setItem('tg_user_id', userId);
        if (userUsername) {
            localStorage.setItem('tg_username', userUsername);
        }
        
        await trackVisit();
        await loadStats();
    }

    // ========== ОТПРАВКА ВИЗИТА ==========
    async function trackVisit() {
        try {
            const response = await fetch(`${BOT_API_URL}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_id: userId,
                    username: userUsername || null
                })
            });
            const data = await response.json();
            document.getElementById('total').innerText = data.total;
            document.getElementById('unique').innerText = data.unique;
        } catch (err) {
            console.warn('❌ Не удалось отправить визит:', err);
        }
    }

    // ========== ЗАГРУЗКА СТАТИСТИКИ ==========
    async function loadStats() {
        try {
            const response = await fetch(`${BOT_API_URL}/stats`);
            const data = await response.json();
            document.getElementById('total').innerText = data.total;
            document.getElementById('unique').innerText = data.unique;
        } catch (err) {
            console.warn('❌ Статистика не загрузилась:', err);
            document.getElementById('total').innerText = '?';
            document.getElementById('unique').innerText = '?';
        }
    }

    // ========== АВАТАРЫ ==========
    const contacts = [
        { username: "makoklyuy", fallbackImage: "" },
        { username: "sokolovpeter", fallbackImage: "" },
        { username: "oldti", fallbackImage: "" },
        { username: "RNFRI", fallbackImage: "https://raw.githubusercontent.com/LirJawier/KRS_D_2/refs/heads/main/Art.jpg" },
        { username: "BOSS", fallbackImage: "https://raw.githubusercontent.com/LirJawier/KRS_D_2/refs/heads/main/dan.jpg" }
    ];

    function getAvatarElement(contact) {
        const container = document.createElement('div');
        container.className = 'avatar-circle';
        container.style.cursor = 'pointer';

        if (contact.fallbackImage && contact.fallbackImage.trim() !== "") {
            const img = document.createElement('img');
            img.src = contact.fallbackImage;
            img.alt = contact.username;
            img.onerror = () => {
                const placeholder = document.createElement('div');
                placeholder.className = 'avatar-placeholder';
                placeholder.textContent = contact.username.charAt(0).toUpperCase();
                container.innerHTML = '';
                container.appendChild(placeholder);
            };
            container.appendChild(img);
        } else {
            const cleanName = contact.username.replace('@', '');
            const img = document.createElement('img');
            img.src = `https://unavatar.io/telegram/${cleanName}`;
            img.alt = contact.username;
            img.onerror = () => {
                const placeholder = document.createElement('div');
                placeholder.className = 'avatar-placeholder';
                placeholder.textContent = cleanName.charAt(0).toUpperCase();
                container.innerHTML = '';
                container.appendChild(placeholder);
            };
            container.appendChild(img);
        }
        container.addEventListener('click', showModal);
        return container;
    }

    function loadAvatars() {
        const container = document.getElementById('avatarsContainer');
        container.innerHTML = '';
        contacts.forEach(contact => {
            container.appendChild(getAvatarElement(contact));
        });
    }

    // ========== МОДАЛЬНОЕ ОКНО ==========
    function showModal() {
        document.getElementById('modal').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    });

    // ========== ПРАЗДНИКИ (ОЧЕРЕДЬ) ==========
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

    const holidaysData = {
        "05.18": ["Международный день музеев", "Арина Капустница (Рассадница)", "Всемирный день вакцины против СПИДа", "День памяти жертв депортации народов Крыма", "День памяти иконы «Неупиваемая чаша»", "День без грязной посуды", "День рождения майского жжжжука", "День Розовой Пантеры", "День сырного суфле"],
        "05.19": ["День пионерии", "День рождения Кубика Рубика", "Иов Горошник", "День конной авиации", "День подразделений служебно-боевой подготовки МВД РФ", "День русской печи", "День пищевой революции", "День парусов на горизонте", "Всемирный день борьбы с воспалительными заболеваниями кишечника", "Всемирный день борьбы с гепатитом С", "День торта «Devil`s Food Cake»"],
        "05.20": ["Всемирный день врача-травматолога", "Всемирный день метрологии", "День рождения джинсов", "Купальница", "Всемирный день пчел", "День Волги", "Европейский день моря", "День миллионера", "День собранной клубники", "День ветряных вертушек", "Праздник разливаний", "День пирога «Киш Лорен»"],
        "05.21": ["День военного переводчика", "День инвентаризатора (День работника БТИ)", "День полярника", "День Тихоокеанского флота ВМФ России", "Вознесение Господне", "День защиты от безработицы", "Всемирный день культурного разнообразия во имя диалога и развития", "Международный день космоса", "Иван Долгий", "День работников культуры и искусства – Казахстан", "День официантов и официанток", "День музы и вдохновения", "День обмена талисманами", "День клубники со сливками"]
    };

    let currentQueue = [];
    let queuePointer = 0;
    let lastDateKey = '';

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

    function getTodayKey() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${month}.${day}`;
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

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    (function initQueue() {
        const todayKey = getTodayKey();
        rebuildQueue(todayKey);
    })();

    // ========== ЗАПУСК ==========
    loadAvatars();
    updateHoliday();
    document.getElementById('refreshBtn').addEventListener('click', updateHoliday);

    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
    }

    initUser();
</script>
</body>
</html>
