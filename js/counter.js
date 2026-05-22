// ========== НАСТРОЙКИ ==========
const BOT_API_URL = "https://kd-lirjawier.amvera.io";

// ========== ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ИЗ TELEGRAM ==========
function getTelegramUser() {
    return new Promise((resolve) => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            resolve(window.Telegram.WebApp.initDataUnsafe.user);
            return;
        }
        let attempts = 0;
        const maxAttempts = 75; // 3 секунды (40 мс * 75)
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
let userId = null;
let userUsername = null;
let isTrackSent = false;      // флаг, чтобы отправить визит только один раз
let initPromise = null;       // чтобы не инициализировать несколько раз

async function initUser() {
    if (initPromise) return initPromise; // предотвращаем параллельные вызовы
    initPromise = (async () => {
        // Пытаемся получить данные из Telegram (ждём до 3 сек)
        const tgUser = await getTelegramUser();
        if (tgUser) {
            userId = tgUser.id.toString();
            userUsername = tgUser.username || null;
            console.log('✅ Telegram user:', userId, 'Username:', userUsername);
        } else {
            // Если не Telegram (или не дождались) – генерируем web_ ID
            userId = 'web_' + Math.random().toString(36).substr(2, 9);
            userUsername = null;
            console.log('🌐 Web user:', userId);
        }
        // Сохраняем в localStorage (на случай обновления страницы)
        localStorage.setItem('tg_user_id', userId);
        if (userUsername) localStorage.setItem('tg_username', userUsername);
    })();
    return initPromise;
}

// ========== ОТПРАВКА ВИЗИТА (только один раз) ==========
async function trackVisit() {
    if (!userId) {
        console.warn('❌ trackVisit: userId не определён');
        return;
    }
    if (isTrackSent) {
        console.log('🔄 Визит уже отправлен, пропускаем повторную отправку');
        return;
    }
    isTrackSent = true;
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
        console.log('📊 Визит отправлен, total:', data.total, 'unique:', data.unique);
    } catch (err) {
        console.warn('❌ Не удалось отправить визит:', err);
        isTrackSent = false; // сбрасываем флаг, чтобы можно было повторить при ошибке
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

// ========== ГЛАВНАЯ ФУНКЦИЯ (вызывается из app.js один раз) ==========
async function startCounter() {
    await initUser();
    // Загружаем статистику (показываем текущие цифры)
    await loadStats();
    // Отправляем визит (увеличивает счётчики)
    await trackVisit();
}

// Экспортируем для использования в app.js (если используется модульная система, иначе просто вызываем)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { startCounter };
}
