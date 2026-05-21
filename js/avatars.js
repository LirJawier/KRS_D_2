// ========== АВАТАРЫ ==========
const contacts = [
    { username: "makoklyuy", fallbackImage: "" },
    { username: "sokolovpeter", fallbackImage: "" },
    { username: "oldti", fallbackImage: "" },
    { username: "RNFRI", fallbackImage: "https://raw.githubusercontent.com/LirJawier/KRS_D_2/refs/heads/main/assets/Art.jpg" },
    { username: "BOSS", fallbackImage: "https://raw.githubusercontent.com/LirJawier/KRS_D_2/refs/heads/main/assets/dan.jpg" }
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

// Инициализация обработчиков модального окна (вызывается после загрузки DOM)
function initModal() {
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    });
}
