// ========== ФОН ==========
const MY_BACKGROUND = "https://raw.githubusercontent.com/LirJawier/KRS_D_2/refs/heads/main/krsn6.jpeg";
document.body.style.backgroundImage = `url('${MY_BACKGROUND}')`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация аватаров и модального окна
    initModal();
    loadAvatars();
    
    // Инициализация праздников
    updateHoliday();
    document.getElementById('refreshBtn').addEventListener('click', updateHoliday);
    
    // Telegram WebApp
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
    }
    
    // Инициализация счётчика
    initCounter();
});
