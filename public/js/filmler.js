// API Base URL - Global
window.API_BASE_URL = '/api';

// Sayfa değişkenleri
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    genre: '',
    year: '',
    rating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: ''
};

// URL parametrelerini oku
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        genre: params.get('genre') || '',
        year: params.get('year') || '',
        rating: params.get('rating') || '',
        search: params.get('search') || '',
        page: parseInt(params.get('page')) || 1
    };
}

// URL parametrelerini ayarla
function setUrlParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
}

// Filtreleri uygula
function applyFilters() {
    const genreFilter = document.getElementById('genreFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const [sortBy, sortOrder] = sortFilter.split('-');

    currentFilters = {
        genre: genreFilter,
        year: yearFilter,
        rating: ratingFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: currentFilters.search
    };

    currentPage = 1;
    loadFilms();
}

// Filmleri yükle
async function loadFilms() {
    const container = document.getElementById('filmsContainer');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!container) return;

    // Yükleniyor göstergesi
    container.innerHTML = Array(12).fill('<div class="film-card-skeleton"></div>').join('');
    resultsCount.textContent = 'Filmler yükleniyor...';

    try {
        // API parametrelerini hazırla
        const params = new URLSearchParams({
            page: currentPage,
            limit: 12
        });

        if (currentFilters.genre) params.append('genre', currentFilters.genre);
        if (currentFilters.year) params.append('year', currentFilters.year);
        if (currentFilters.rating) params.append('rating', currentFilters.rating);
        if (currentFilters.search) params.append('search', currentFilters.search);
        if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);
        if (currentFilters.sortOrder) params.append('sortOrder', currentFilters.sortOrder);

        // API isteği
        const response = await fetch(`${API_BASE_URL}/films?${params}`);
        const data = await response.json();

        // URL'yi güncelle
        setUrlParams({
            genre: currentFilters.genre,
            year: currentFilters.year,
            rating: currentFilters.rating,
            search: currentFilters.search,
            page: currentPage
        });

        if (data.films && data.films.length > 0) {
            container.innerHTML = data.films.map(film => createFilmCard(film)).join('');
            
            // Sonuç sayısını göster
            const currentLang = localStorage.getItem('language') || 'tr';
            const foundText = currentLang === 'en' ? 'movies found' : 'film bulundu';
            resultsCount.textContent = `${data.pagination.totalFilms} ${foundText}`;
            
            // Sayfalama bilgilerini güncelle
            totalPages = data.pagination.totalPages;
            renderPagination(data.pagination);
        } else {
            container.innerHTML = '<p class="no-results"><i class="fas fa-film"></i><br>Aradığınız kriterlere uygun film bulunamadı.</p>';
            resultsCount.textContent = '0 film bulundu';
            document.getElementById('pagination').innerHTML = '';
        }
    } catch (error) {
        console.error('Filmler yüklenemedi:', error);
        container.innerHTML = '<p class="error-message"><i class="fas fa-exclamation-triangle"></i><br>Filmler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
        resultsCount.textContent = 'Hata oluştu';
    }
}

// Film kartı oluştur
function createFilmCard(film) {
    const currentLang = localStorage.getItem('language') || 'tr';
    const posterUrl = film.images?.poster || film.poster || 'https://via.placeholder.com/250x350?text=Film';
    const rating = film.rating || film.imdbRating || 0;
    const year = film.year || 'N/A';
    
    // Dile göre açıklama seç
    const description = currentLang === 'en' 
        ? (film.descriptionEn || film.description || 'No description') 
        : (film.description || 'Açıklama yok');
    
    const genres = Array.isArray(film.genre) ? film.genre.join(', ') : film.genre || '';

    return `
        <div class="film-card" onclick="openFilmDetailModal(${film.id})">
            <img src="${film.images.poster}" alt="${film.title}" class="film-poster" onerror="this.src='https://via.placeholder.com/250x350/1a1a1a/e50914?text=${encodeURIComponent(film.title)}'">
            <div class="film-info">
                <h3 class="film-title" title="${film.title}">${film.title}</h3>
                <div class="film-meta">
                    <span class="film-year">${year}</span>
                    <span class="film-rating">
                        <i class="fas fa-star"></i>
                        ${rating.toFixed(1)}
                    </span>
                </div>
                ${genres ? `<p class="film-genres">${genres}</p>` : ''}
                <p class="film-description">${description}</p>
            </div>
        </div>
    `;
}

// Sayfalama oluştur
function renderPagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    let paginationHTML = '';

    // Önceki sayfa butonu
    paginationHTML += `
        <button onclick="goToPage(${currentPage - 1})" ${!pagination.hasPrev ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Önceki
        </button>
    `;

    // Sayfa numaraları
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += `<button onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
        paginationHTML += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Sonraki sayfa butonu
    paginationHTML += `
        <button onclick="goToPage(${currentPage + 1})" ${!pagination.hasNext ? 'disabled' : ''}>
            Sonraki <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Sayfaya git
function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    loadFilms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Film detay sayfasına git
function goToFilmDetail(filmId) {
    window.location.href = `/film-detay.html?id=${filmId}`;
}

// Filtre değerlerini ayarla
function setFilterValues() {
    const urlParams = getUrlParams();
    
    if (urlParams.genre) {
        document.getElementById('genreFilter').value = urlParams.genre;
        currentFilters.genre = urlParams.genre;
    }
    
    if (urlParams.year) {
        document.getElementById('yearFilter').value = urlParams.year;
        currentFilters.year = urlParams.year;
    }
    
    if (urlParams.rating) {
        document.getElementById('ratingFilter').value = urlParams.rating;
        currentFilters.rating = urlParams.rating;
    }
    
    if (urlParams.search) {
        currentFilters.search = urlParams.search;
        if (document.getElementById('searchInput')) {
            document.getElementById('searchInput').value = urlParams.search;
        }
    }
    
    currentPage = urlParams.page;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Filtre değerlerini ayarla
    setFilterValues();
    
    // Filmleri yükle
    loadFilms();
    
    // Filtre değişikliklerini dinle
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (genreFilter) genreFilter.addEventListener('change', applyFilters);
    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
});
