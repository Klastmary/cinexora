// Helper fonksiyonlar
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function getToken() {
    return localStorage.getItem('token');
}

// Modal Fonksiyonları
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Modal dışına tıklandığında kapat
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const filmDetailModal = document.getElementById('filmDetailModal');

    if (event.target == loginModal) {
        closeLoginModal();
    }
    if (event.target == registerModal) {
        closeRegisterModal();
    }
    if (event.target == filmDetailModal) {
        closeFilmDetailModal();
    }
}

// ESC tuşu ile kapat
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
        closeRegisterModal();
        closeFilmDetailModal();
    }
});

// Login Form Submit
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        try {
            // Yakında mesajı
            errorDiv.innerHTML = '<i class="fas fa-clock"></i> Bu özellik yakında eklenecek! Şu anda sitemizi demo modunda gezebilirsiniz.';
            errorDiv.style.display = 'block';
            errorDiv.style.background = '#ff9800';
            errorDiv.style.color = '#fff';
            return;
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Token'ı kaydet
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Başarılı mesaj
                errorDiv.style.display = 'block';
                errorDiv.className = 'success-message';
                errorDiv.textContent = 'Giriş başarılı! Hoş geldiniz...';

                // Sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Hata mesajı
                errorDiv.style.display = 'block';
                errorDiv.className = 'error-message';
                errorDiv.textContent = data.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.style.display = 'block';
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
    });
}

// Register Form Submit
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('registerFirstName').value;
        const lastName = document.getElementById('registerLastName').value;
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const errorDiv = document.getElementById('registerError');
        const successDiv = document.getElementById('registerSuccess');

        // Şifre kontrolü
        if (password !== confirmPassword) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Şifreler eşleşmiyor!';
            return;
        }

        try {
            // Yakında mesajı
            errorDiv.innerHTML = '<i class="fas fa-clock"></i> Bu özellik yakında eklenecek! Şu anda sitemizi demo modunda gezebilirsiniz.';
            errorDiv.style.display = 'block';
            errorDiv.style.background = '#ff9800';
            errorDiv.style.color = '#fff';
            return;
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Token'ı kaydet
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Başarılı mesaj
                errorDiv.style.display = 'none';
                successDiv.style.display = 'block';
                successDiv.textContent = 'Kayıt başarılı! Hoş geldiniz...';

                // Sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Hata mesajı
                successDiv.style.display = 'none';
                errorDiv.style.display = 'block';
                
                if (data.errors && Array.isArray(data.errors)) {
                    errorDiv.textContent = data.errors.map(err => err.msg).join(', ');
                } else {
                    errorDiv.textContent = data.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
                }
            }
        } catch (error) {
            console.error('Register error:', error);
            successDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
    });
}

// Film Detay Modal Fonksiyonları
function openFilmDetailModal(filmId) {
    const modal = document.getElementById('filmDetailModal');
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        loadFilmDetail(filmId);
    }
}

function closeFilmDetailModal() {
    const modal = document.getElementById('filmDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

async function loadFilmDetail(filmId) {
    try {
        // Static JSON'dan yükle
        const response = await fetch('/films.json');
        const allFilms = await response.json();
        const film = allFilms.find(f => f.id == filmId);

        if (film) {
            showFilmDetail(film);
        } else {
            document.getElementById('filmDetailContent').innerHTML = '<p class="error-message">Film bulunamadı.</p>';
        }
    } catch (error) {
        console.error('Film detay yükleme hatası:', error);
        document.getElementById('filmDetailContent').innerHTML = '<p class="error-message">Film detayları yüklenirken bir hata oluştu.</p>';
    }
}

function showFilmDetail(film) {
    const modalContent = document.getElementById('filmDetailContent');
    const currentLang = localStorage.getItem('language') || 'tr';

    const backdropUrl = film.images?.backdrop || 'https://via.placeholder.com/800x450?text=Film+Backdrop';
    const posterUrl = film.images?.poster || 'https://via.placeholder.com/250x350?text=Film+Poster';
    const rating = film.rating || film.imdbRating || 0;
    const year = film.year || 'N/A';
    const genres = Array.isArray(film.genre) ? film.genre.join(', ') : film.genre || '';
    
    // Dile göre açıklama seç
    const description = currentLang === 'en' ? (film.descriptionEn || film.description) : film.description;
    const detailedPlot = currentLang === 'en' ? (film.detailedPlotEn || film.detailedPlot) : film.detailedPlot;
    
    // Çeviriler
    const texts = {
        tr: {
            plot: 'Konu',
            cast: 'Oyuncular',
            trailer: 'Fragman',
            watch: 'İzle',
            addFavorites: 'Favorilere Ekle',
            addWatchlist: 'İzleme Listesi',
            noDescription: 'Açıklama yok',
            noPlot: 'Detaylı konu bilgisi yok',
            unknown: 'Bilinmiyor'
        },
        en: {
            plot: 'Plot',
            cast: 'Cast',
            trailer: 'Trailer',
            watch: 'Watch',
            addFavorites: 'Add to Favorites',
            addWatchlist: 'Add to Watchlist',
            noDescription: 'No description',
            noPlot: 'No detailed plot',
            unknown: 'Unknown'
        }
    };
    
    const t = texts[currentLang];

    modalContent.innerHTML = `
        <div class="film-detail-header" style="background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('${backdropUrl}')">
            <div class="film-detail-info">
                <h1 class="film-detail-title">${film.title}</h1>
                <div class="film-detail-meta">
                    <span>${year}</span>
                    <span>${genres}</span>
                    <span>${film.duration} ${currentLang === 'en' ? 'min' : 'dk'}</span>
                </div>
                <div class="film-detail-rating">
                    <i class="fas fa-star"></i>
                    ${rating.toFixed(1)}
                </div>
                <p class="film-detail-description">${description || t.noDescription}</p>
            </div>
        </div>

        <div style="padding: 20px;">
            <div class="film-detail-plot">
                <h3>${t.plot}</h3>
                <p>${detailedPlot || description || t.noPlot}</p>
            </div>

            ${film.cast && film.cast.length > 0 ? `
                <div class="film-detail-cast">
                    <h3>${t.cast}</h3>
                    <div class="cast-grid">
                        ${film.cast.map(actor => `
                            <div class="cast-member">
                                <img src="${actor.image || 'https://via.placeholder.com/80x80?text=Actor'}" alt="${actor.name}" onerror="this.src='https://via.placeholder.com/80x80?text=Actor'">
                                <div class="actor-name">${actor.name}</div>
                                <div class="character">${actor.character || t.unknown}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${film.trailer ? `
                <div class="film-detail-trailer">
                    <h3>${t.trailer}</h3>
                    <iframe src="${film.trailer.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>
                </div>
            ` : ''}

            <div class="film-detail-actions">
                <button class="btn-watch" onclick="openMoviePlayer(${film.tmdbId || film.id}, '${film.title.replace(/'/g, "\\'")}')">  
                    <i class="fas fa-play"></i> ${t.watch}
                </button>
                <button class="btn-favorite" onclick="toggleFavorite(${film.id})">
                    <i class="fas fa-heart"></i> ${t.addFavorites}
                </button>
                <button class="btn-watchlist" onclick="toggleWatchlist(${film.id})">
                    <i class="fas fa-plus"></i> ${t.addWatchlist}
                </button>
            </div>
        </div>
    `;
}

async function toggleFavorite(filmId) {
    if (!isLoggedIn()) {
        const currentLang = localStorage.getItem('language') || 'tr';
        alert(currentLang === 'en' ? 'Please login to add to favorites!' : 'Favorilere eklemek için giriş yapmalısınız!');
        openLoginModal();
        return;
    }

    try {
        const API_BASE_URL = window.API_BASE_URL || '/api';
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user.id) {
            alert('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }
        
        console.log('Adding to favorites - Film ID:', filmId, 'User ID:', user.id);
        
        const response = await fetch(`${API_BASE_URL}/films/${filmId}/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.id })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            const currentLang = localStorage.getItem('language') || 'tr';
            const message = data.isFavorite 
                ? (currentLang === 'en' ? 'Added to favorites!' : 'Favorilere eklendi!')
                : (currentLang === 'en' ? 'Removed from favorites!' : 'Favorilerden çıkarıldı!');
            alert(message);
        } else {
            alert(data.message || 'Bir hata oluştu');
        }
    } catch (error) {
        console.error('Favorite toggle error:', error);
        alert('Bir hata oluştu: ' + error.message);
    }
}

// Film oynatıcı fonksiyonları
function openMoviePlayer(filmId, filmTitle) {
    const modal = document.getElementById('moviePlayerModal');
    if (!modal) {
        console.error('Movie player modal not found');
        return;
    }
    
    // Hemen modal'ı aç ve loading göster
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    const playerContainer = document.getElementById('moviePlayerContainer');
    const playerTitle = document.getElementById('moviePlayerTitle');
    
    if (playerTitle) {
        playerTitle.textContent = filmTitle;
    }
    
    if (playerContainer) {
        // Film oynatıcı - birden fazla kaynak seçeneği
        playerContainer.innerHTML = `
            <div style="padding: 20px; color: #fff;">
                <p style="margin-bottom: 15px; font-size: 14px;"><i class="fas fa-info-circle"></i> Film kaynağını seçin (Yeşil butonu deneyin):</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
                    <button id="btn-vidsrc" onclick="loadPlayer('vidsrc', ${filmId})" style="padding: 10px 18px; background: #4CAF50; color: #fff; border: none; border-radius: 5px; cursor: pointer; transition: 0.3s; font-weight: 600; font-size: 13px;" onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4CAF50'">
                        <i class="fas fa-play-circle"></i> VidSrc (Önerilen)
                    </button>
                    <button id="btn-vidsrcpro" onclick="loadPlayer('vidsrcpro', ${filmId})" style="padding: 10px 18px; background: #e50914; color: #fff; border: none; border-radius: 5px; cursor: pointer; transition: 0.3s; font-weight: 600; font-size: 13px;" onmouseover="this.style.background='#ff0a16'" onmouseout="this.style.background='#e50914'">
                        <i class="fas fa-play-circle"></i> VidSrc Pro
                    </button>
                    <button id="btn-vidsrcto" onclick="loadPlayer('vidsrcto', ${filmId})" style="padding: 10px 18px; background: #e50914; color: #fff; border: none; border-radius: 5px; cursor: pointer; transition: 0.3s; font-weight: 600; font-size: 13px;" onmouseover="this.style.background='#ff0a16'" onmouseout="this.style.background='#e50914'">
                        <i class="fas fa-play-circle"></i> VidSrc.to
                    </button>
                </div>
                <div id="playerFrame" style="width: 100%; height: calc(80vh - 150px); background: #000; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #e50914;"></i>
                        <p style="margin-top: 20px; color: #888;">Film yüklen iyor...</p>
                    </div>
                </div>
            </div>
        `;
        
        // Varsayılan olarak VidSrc'yi hızlıca yükle
        loadPlayer('vidsrc', filmId);
    }
}

function loadPlayer(source, filmId) {
    const playerFrame = document.getElementById('playerFrame');
    if (!playerFrame) return;
    
    // Loading göster
    playerFrame.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000;">
            <div style="text-align: center;">
                <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #e50914;"></i>
                <p style="margin-top: 20px; color: #888;">Film yüklen iyor...</p>
            </div>
        </div>
    `;
    
    let embedUrl = '';
    
    switch(source) {
        case 'vidsrc':
            embedUrl = `https://vidsrc.cc/v2/embed/movie/${filmId}`;
            break;
        case 'vidsrcpro':
            embedUrl = `https://vidsrc.pro/embed/movie/${filmId}`;
            break;
        case 'vidsrcto':
            embedUrl = `https://vidsrc.to/embed/movie/${filmId}`;
            break;
        default:
            embedUrl = `https://vidsrc.cc/v2/embed/movie/${filmId}`;
    }
    
    // Iframe'ı hızlıca yükle
    setTimeout(() => {
        playerFrame.innerHTML = `
            <iframe 
                src="${embedUrl}" 
                width="100%" 
                height="100%" 
                frameborder="0" 
                allowfullscreen
                scrolling="no"
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
        `;
        
        // Timeout sonrası hata kontrolü
        setTimeout(() => {
            const iframe = playerFrame.querySelector('iframe');
            if (iframe && !iframe.contentWindow) {
                playerFrame.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #1a1a1a;">
                        <div style="text-align: center; padding: 20px;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e50914; margin-bottom: 20px;"></i>
                            <h3 style="color: #fff; margin-bottom: 10px;">Bu kaynak şu anda çalışmıyor</h3>
                            <p style="color: #888; margin-bottom: 20px;">Lütfen yukarıdaki butonlardan başka bir kaynak seçin</p>
                        </div>
                    </div>
                `;
            }
        }, 5000);
    }, 50);
}

function closeMoviePlayer() {
    const modal = document.getElementById('moviePlayerModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // İframe'i temizle
        const playerContainer = document.getElementById('moviePlayerContainer');
        if (playerContainer) {
            playerContainer.innerHTML = '';
        }
    }
}

async function toggleWatchlist(filmId) {
    if (!isLoggedIn()) {
        const currentLang = localStorage.getItem('language') || 'tr';
        alert(currentLang === 'en' ? 'Please login to add to watchlist!' : 'İzleme listesine eklemek için giriş yapmalısınız!');
        openLoginModal();
        return;
    }

    try {
        const API_BASE_URL = window.API_BASE_URL || '/api';
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user.id) {
            alert('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }
        
        console.log('Adding to watchlist - Film ID:', filmId, 'User ID:', user.id);
        
        const response = await fetch(`${API_BASE_URL}/films/${filmId}/watchlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.id })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            const currentLang = localStorage.getItem('language') || 'tr';
            const message = data.isInWatchlist 
                ? (currentLang === 'en' ? 'Added to watchlist!' : 'İzleme listesine eklendi!')
                : (currentLang === 'en' ? 'Removed from watchlist!' : 'İzleme listesinden çıkarıldı!');
            alert(message);
        } else {
            alert(data.message || 'Bir hata oluştu');
        }
    } catch (error) {
        console.error('Watchlist toggle error:', error);
        alert('Bir hata oluştu: ' + error.message);
    }
}
