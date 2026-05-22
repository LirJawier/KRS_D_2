// ========== НАСТРОЙКИ ==========
const BOT_API_URL = "https://kd-lirjawier.amvera.io";

// Флаги для однократного выполнения
let isUserInitialized = false;
let isVisitSent = false;

// ========== ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЯ ИЗ TELEGRAM ==========
async function getTelegramUser() {
    return new Promise((resolve) => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            resolve(window.Telegram.WebApp.initDataUnsafe.user);
            return;
        }
        let attempts = 0;
        const maxAttempts = 75;
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

// ========== ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ (один раз) ==========
let userId = localStorage.getItem('tg_user_id');
let userUsername = localStorage.getItem('tg_username');

async function initUser() {
    if (isUserInitialized) return;
    isUserInitialized = true;

    // Если ID уже есть в localStorage
    if (userId) {
        // Обновляем username, если он появился в Telegram
        const tgUser = await getTelegramUser();
        if (tgUser && tgUser.username && userUsername !== tgUser.username) {
            userUsername = tgUser.username;
            localStorage.setItem('tg_username', userUsername);
        }
        return;
    }

    // Нет ID – получаем из Telegram или создаём web_
    const tgUser = await getTelegramUser();
    if (tgUser) {
        userId = tgUser.id.toString();
        userUsername = tgUser.username || null;
        console.log('✅ Новый Telegram user:', userId, 'Username:', userUsername);
    } else {
        userId = 'web_' + Math.random().toString(36).substr(2, 9);
        userUsername = null;
        console.log('🌐 Новый Web user:', userId);
    }

    localStorage.setItem('tg_user_id', userId);
    if (userUsername) {
        localStorage.setItem('tg_username', userUsername);
    }
}

// ========== ОТПРАВКА ВИЗИТА (гарантированно один раз за сессию) ==========
async function trackVisit() {
    if (isVisitSent) return;
    if (!userId) {
        console.warn('❌ trackVisit: userId не определён');
        return;
    }
    isVisitSent = true;
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
        console.log('✅ Визит отправлен:', data);
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

function updateStatsDisplay(total, unique) {
    const totalEl = document.getElementById('total');
    const uniqueEl = document.getElementById('unique');
    if (totalEl) totalEl.innerText = total;
    if (uniqueEl) uniqueEl.innerText = unique;
}

// ========== ГЛАВНАЯ ФУНКЦИЯ ЗАПУСКА ==========
async function startCounter() {
    await initUser();          // определяем userId (один раз)
    await loadStats();         // показываем текущую статистику
    await trackVisit();        // отправляем визит (один раз)
}

// Экспортируем для app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { startCounter };
}
