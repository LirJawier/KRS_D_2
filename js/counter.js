// ========== НАСТРОЙКИ ==========
const BOT_API_URL = "https://kd-lirjawier.amvera.io";

// ========== ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ИЗ TELEGRAM (с ожиданием) ==========
async function getTelegramUser() {
    return new Promise((resolve) => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            resolve(window.Telegram.WebApp.initDataUnsafe.user);
            return;
        }
        let attempts = 0;
        const maxAttempts = 75; // 3 секунды
        const interval = setInterval(() => {
            attempts++;
            if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
                clearInterval(interval);
                resolve(window.Telegram.WebApp.initDataUnsafe.user);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                resolve(null);
            }
        }, 40);
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ ==========
let userId = localStorage.getItem('tg_user_id');
let userUsername = localStorage.getItem('tg_username');

// Флаг, чтобы не инициализировать повторно
let isInitialized = false;

async function initUser() {
    if (isInitialized) return;
    isInitialized = true;

    // Если ID уже есть в localStorage – используем его (проверяем актуальность)
    if (userId) {
        // Но могли измениться username (если пользователь добавил его позже)
        const tgUser = await getTelegramUser();
        if (tgUser && tgUser.username && userUsername !== tgUser.username) {
            userUsername = tgUser.username;
            localStorage.setItem('tg_username', userUsername);
        }
        // Никакой повторной отправки визита здесь не делаем!
        return;
    }

    // Нет ID – получаем из Telegram или создаём web_
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
}

// ========== ОТПРАВКА ВИЗИТА (только после полной инициализации) ==========
async function trackVisit() {
    if (!userId) {
        console.warn('❌ trackVisit: userId не определён');
        return;
    }
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
        updateStatsDisplay(data.total, data.unique);
    } catch (err) {
        console.warn('❌ Не удалось отправить визит:', err);
    }
}

// ========== ЗАГРУЗКА СТАТИСТИКИ ==========
async function loadStats() {
    try {
        const response = await fetch(`${BOT_API_URL}/stats`);
        const data = await response.json();
        updateStatsDisplay(data.total, data.unique);
    } catch (err) {
        console.warn('❌ Статистика не загрузилась:', err);
        updateStatsDisplay('?', '?');
    }
}

// ========== ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ ==========
function updateStatsDisplay(total, unique) {
    const totalEl = document.getElementById('total');
    const uniqueEl = document.getElementById('unique');
    if (totalEl) totalEl.innerText = total;
    if (uniqueEl) uniqueEl.innerText = unique;
}

// ========== ОТДЕЛЬНЫЙ ЗАПУСК ИНИЦИАЛИЗАЦИИ И ОТПРАВКИ ВИЗИТА ==========
// Эта функция должна вызываться один раз после загрузки страницы
async function startCounter() {
    await initUser();
    // Загружаем статистику (показываем текущие цифры)
    await loadStats();
    // Отправляем визит (увеличивает счётчики)
    await trackVisit();
}

// Экспортируем функцию для вызова из app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { startCounter };
}
