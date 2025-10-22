// API Base URL
const API_BASE_URL = '/api';

// Auth kontrol ve dropdown
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (token && user.username) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userMenu').style.display = 'block';
        document.getElementById('headerUsername').textContent = user.firstName || user.username;
        
        // Admin kontrolü
        if (user.role === 'admin') {
            const adminLink = document.getElementById('adminLink');
            if (adminLink) adminLink.style.display = 'flex';
        }
        
        // Hero sign up butonunu gizle
        const heroSignUpBtn = document.getElementById('heroSignUpBtn');
        if (heroSignUpBtn) {
            heroSignUpBtn.style.display = 'none';
        }
    } else {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userMenu').style.display = 'none';
        
        // Hero sign up butonunu göster
        const heroSignUpBtn = document.getElementById('heroSignUpBtn');
        if (heroSignUpBtn) {
            heroSignUpBtn.style.display = 'inline-block';
        }
    }
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    }
}

// Dropdown dışına tıklandığında kapat
window.addEventListener('click', function(event) {
    if (!event.target.closest('#userMenu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});

// Sayfa yüklendiğinde auth kontrol et
document.addEventListener('DOMContentLoaded', checkAuth);

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Arama Fonksiyonu
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length > 2) {
            searchTimeout = setTimeout(() => {
                searchFilms(query);
            }, 500);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                window.location.href = `/filmler.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
}

// Öne Çıkan Filmleri Getir
async function loadFeaturedFilms() {
    const container = document.getElementById('featuredFilms');
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/films?limit=50&sortBy=rating&sortOrder=desc`);
        const data = await response.json();
        const films = data.films || [];

        if (films && films.length > 0) {
            container.innerHTML = films.slice(0, 8).map(film => createFilmCard(film)).join('');
        } else {
            container.innerHTML = '<p class="no-results">Henüz film eklenmemiş.</p>';
        }
    } catch (error) {
        console.error('Öne çıkan filmler yüklenemedi:', error);
        container.innerHTML = '<p class="error-message">Filmler yüklenirken bir hata oluştu.</p>';
    }
}

// Yeni Çıkan Filmleri Getir
async function loadNewReleases() {
    const container = document.getElementById('newReleases');
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/films?limit=50&sortBy=createdAt&sortOrder=desc`);
        const data = await response.json();
        const films = data.films || [];

        if (films && films.length > 0) {
            container.innerHTML = films.slice(0, 8).map(film => createFilmCard(film)).join('');
        } else {
            // Eğer new-releases endpoint'i yoksa, tüm filmleri getir
            const allFilmsResponse = await fetch(`${API_BASE_URL}/films?limit=8&sortBy=createdAt&sortOrder=desc`);
            const data = await allFilmsResponse.json();
            
            if (data.films && data.films.length > 0) {
                container.innerHTML = data.films.map(film => createFilmCard(film)).join('');
            } else {
                container.innerHTML = '<p class="no-results">Henüz film eklenmemiş.</p>';
            }
        }
    } catch (error) {
        console.error('Yeni filmler yüklenemedi:', error);
        container.innerHTML = '<p class="error-message">Filmler yüklenirken bir hata oluştu.</p>';
    }
}

// Film Kartı Oluştur
function createFilmCard(film) {
    const currentLang = localStorage.getItem('language') || 'tr';
    const posterUrl = film.images?.poster || film.poster || 'https://via.placeholder.com/250x350?text=Film';
    const rating = film.rating || film.imdbRating || 0;
    const year = film.year || 'N/A';
    
    // Dile göre açıklama seç
    const description = currentLang === 'en' 
        ? (film.descriptionEn || film.description || 'No description') 
        : (film.description || 'Açıklama yok');

    return `
        <div class="film-card" onclick="openFilmDetailModal(${film.id})">
            <img src="${posterUrl}" alt="${film.title}" class="film-poster" onerror="this.src='https://via.placeholder.com/250x350?text=Film+Posteri'">
            <div class="film-info">
                <h3 class="film-title">${film.title}</h3>
                <div class="film-meta">
                    <span class="film-year">${year}</span>
                    <span class="film-rating">
                        <i class="fas fa-star"></i>
                        ${rating.toFixed(1)}
                    </span>
                </div>
                <p class="film-description">${description}</p>
            </div>
        </div>
    `;
}

// Film Detay Sayfasına Git
function goToFilmDetail(filmId) {
    window.location.href = `/film-detay.html?id=${filmId}`;
}

// Arama Sonuçlarını Göster
async function searchFilms(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/films?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        // Arama sonuçlarını göstermek için bir dropdown oluştur
        showSearchResults(data.films || []);
    } catch (error) {
        console.error('Arama hatası:', error);
    }
}

function showSearchResults(films) {
    let dropdown = document.getElementById('searchDropdown');
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'searchDropdown';
        dropdown.className = 'search-dropdown';
        searchInput.parentElement.appendChild(dropdown);
    }

    if (films.length === 0) {
        dropdown.innerHTML = '<div class="search-item">Sonuç bulunamadı</div>';
    } else {
        dropdown.innerHTML = films.slice(0, 5).map(film => `
            <div class="search-item" onclick="openFilmDetailModal(${film.id})">
                <img src="${film.images?.poster || film.poster || 'https://via.placeholder.com/50x75?text=Film'}" alt="${film.title}" onerror="this.src='https://via.placeholder.com/50x75?text=Film'">
                <div class="search-item-info">
                    <strong>${film.title}</strong>
                    <span>${film.year} - ${film.rating?.toFixed(1) || 'N/A'}</span>
                </div>
            </div>
        `).join('');
    }

    dropdown.style.display = 'block';
}

// Sayfa dışına tıklandığında dropdown'u kapat
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('searchDropdown');
    if (dropdown && !searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Aktif menü öğesini ayarla
function setActiveMenu() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        }
    });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Aktif menüyü ayarla
    setActiveMenu();

    // Anasayfadaysak filmleri yükle
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        loadFeaturedFilms();
        loadNewReleases();
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Token yönetimi
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

function isLoggedIn() {
    return !!getToken();
}

// Kullanıcı girişini kontrol et ve header'ı güncelle
function updateAuthButtons() {
    const token = getToken();
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    
    if (token && loginBtn && registerBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Profilim';
        loginBtn.onclick = () => window.location.href = '/profil.html';
        
        registerBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Çıkış';
        registerBtn.onclick = () => {
            removeToken();
            window.location.reload();
        };
    }
}

// Sayfa yüklendiğinde auth butonlarını güncelle
document.addEventListener('DOMContentLoaded', () => {
    updateAuthButtons();
});
