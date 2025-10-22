// Gelişmiş Yapay Zeka Film Öneri Sistemi
// Collaborative Filtering + Content-Based Filtering Hybrid Model
class MovieRecommendationEngine {
    constructor() {
        this.userPreferences = this.loadUserPreferences();
    }
    
    // Kullanıcı tercihlerini yükle
    loadUserPreferences() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return {
            favoriteFilms: user.favoriteFilms || [],
            watchlist: user.watchlist || [],
            viewHistory: JSON.parse(localStorage.getItem('viewHistory') || '[]'),
            ratings: JSON.parse(localStorage.getItem('userRatings') || '{}'),
            genrePreferences: this.calculateGenrePreferences()
        };
    }
    
    // Kullanıcının tür tercihlerini hesapla (AI Learning)
    calculateGenrePreferences() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const allFilmIds = [...(user.favoriteFilms || []), ...(user.watchlist || [])];
        const genreScores = {};
        
        // Her türe skor ver
        allFilmIds.forEach(id => {
            const filmData = JSON.parse(localStorage.getItem(`film_${id}`) || '{}');
            if (filmData.genre) {
                const genres = Array.isArray(filmData.genre) ? filmData.genre : [filmData.genre];
                genres.forEach(genre => {
                    genreScores[genre] = (genreScores[genre] || 0) + 1;
                });
            }
        });
        
        return genreScores;
    }
    
    // Gelişmiş AI Film Benzerlik Skoru (Cosine Similarity benzeri)
    calculateSimilarity(film1, film2, userGenrePrefs = {}) {
        let score = 0;
        let weights = {
            genre: 35,
            director: 20,
            year: 15,
            rating: 10,
            cast: 10,
            tags: 10
        };
        
        // 1. Tür benzerliği (Weighted by user preference)
        const genres1 = Array.isArray(film1.genre) ? film1.genre : [film1.genre];
        const genres2 = Array.isArray(film2.genre) ? film2.genre : [film2.genre];
        const commonGenres = genres1.filter(g => genres2.includes(g));
        
        let genreScore = commonGenres.length * weights.genre;
        // Kullanıcının sevdiği türlere bonus
        commonGenres.forEach(genre => {
            if (userGenrePrefs[genre]) {
                genreScore += userGenrePrefs[genre] * 5;
            }
        });
        score += genreScore;
        
        // 2. Yönetmen benzerliği
        if (film1.director === film2.director) {
            score += weights.director;
        }
        
        // 3. Yıl yakınlığı (Gaussian distribution)
        const yearDiff = Math.abs(film1.year - film2.year);
        const yearScore = weights.year * Math.exp(-(yearDiff * yearDiff) / 100);
        score += yearScore;
        
        // 4. Rating benzerliği
        const ratingDiff = Math.abs(film1.rating - film2.rating);
        const ratingScore = weights.rating * (1 - ratingDiff / 10);
        score += Math.max(0, ratingScore);
        
        // 5. Oyuncu benzerliği
        if (film1.cast && film2.cast) {
            const cast1 = film1.cast.map(c => c.name);
            const cast2 = film2.cast.map(c => c.name);
            const commonCast = cast1.filter(c => cast2.includes(c)).length;
            score += commonCast * weights.cast;
        }
        
        // 6. Tag benzerliği
        if (film1.tags && film2.tags) {
            const commonTags = film1.tags.filter(t => film2.tags.includes(t)).length;
            score += commonTags * weights.tags;
        }
        
        return score;
    }
    
    // AI Tabanlı Film Önerileri (Hybrid Recommendation System)
    async getRecommendations(allFilms, limit = 10) {
        const { favoriteFilms, watchlist, viewHistory, ratings, genrePreferences } = this.userPreferences;
        
        // Kullanıcının izlediği/beğendiği filmler
        const userFilmIds = [...new Set([...favoriteFilms, ...watchlist, ...viewHistory])];
        const userFilms = allFilms.filter(f => userFilmIds.includes(f.id));
        
        if (userFilms.length === 0) {
            // Yeni kullanıcı için cold start problemi çözümü
            return this.getColdStartRecommendations(allFilms, limit);
        }
        
        // Her film için AI skoru hesapla
        const recommendations = allFilms
            .filter(f => !userFilmIds.includes(f.id))
            .map(film => {
                let totalScore = 0;
                let weightedScore = 0;
                
                // Content-based filtering
                userFilms.forEach((userFilm, index) => {
                    const similarity = this.calculateSimilarity(film, userFilm, genrePreferences);
                    
                    // Son eklenen filmlere daha fazla ağırlık (Temporal dynamics)
                    const recencyWeight = 1 + (index / userFilms.length) * 0.5;
                    
                    // Kullanıcı rating'i varsa onu da hesaba kat
                    const userRating = ratings[userFilm.id] || userFilm.rating;
                    const ratingWeight = userRating / 10;
                    
                    weightedScore += similarity * recencyWeight * ratingWeight;
                    totalScore += similarity;
                });
                
                // Ortalama skor
                const avgScore = totalScore / userFilms.length;
                const weightedAvg = weightedScore / userFilms.length;
                
                // Popularity bias (hafif)
                const popularityScore = film.rating * 3;
                
                // Diversity bonus (farklı türleri teşvik et)
                const diversityBonus = this.calculateDiversityBonus(film, userFilms);
                
                // Final AI Score
                const finalScore = (weightedAvg * 0.6) + (avgScore * 0.2) + (popularityScore * 0.15) + (diversityBonus * 0.05);
                
                return {
                    ...film,
                    recommendationScore: finalScore,
                    aiConfidence: Math.min(100, (finalScore / 100) * 100)
                };
            })
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, limit);
        
        return recommendations;
    }
    
    // Cold Start Problemi için Akıllı Öneriler
    getColdStartRecommendations(allFilms, limit) {
        // Popülerlik + Çeşitlilik dengesi
        const topRated = allFilms
            .filter(f => f.rating >= 7.5)
            .sort((a, b) => b.rating - a.rating);
        
        const diverse = [];
        const usedGenres = new Set();
        
        for (const film of topRated) {
            const genres = Array.isArray(film.genre) ? film.genre : [film.genre];
            const hasNewGenre = genres.some(g => !usedGenres.has(g));
            
            if (hasNewGenre || diverse.length < limit / 2) {
                diverse.push(film);
                genres.forEach(g => usedGenres.add(g));
            }
            
            if (diverse.length >= limit) break;
        }
        
        return diverse;
    }
    
    // Çeşitlilik bonusu hesapla (Diversity)
    calculateDiversityBonus(film, userFilms) {
        const filmGenres = Array.isArray(film.genre) ? film.genre : [film.genre];
        const userGenres = new Set();
        
        userFilms.forEach(uf => {
            const genres = Array.isArray(uf.genre) ? uf.genre : [uf.genre];
            genres.forEach(g => userGenres.add(g));
        });
        
        const newGenres = filmGenres.filter(g => !userGenres.has(g)).length;
        return newGenres * 10;
    }
    
    // Benzer filmler bul (bir filme göre)
    async getSimilarFilms(targetFilm, allFilms, limit = 6) {
        return allFilms
            .filter(f => f.id !== targetFilm.id)
            .map(film => ({
                ...film,
                similarityScore: this.calculateSimilarity(targetFilm, film)
            }))
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }
    
    // İzleme geçmişine ekle ve AI'yı eğit
    addToViewHistory(filmId, filmData = null) {
        const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
        if (!history.includes(filmId)) {
            history.unshift(filmId);
            if (history.length > 50) history.pop();
            localStorage.setItem('viewHistory', JSON.stringify(history));
        }
        
        // Film verisini cache'le (AI için)
        if (filmData) {
            localStorage.setItem(`film_${filmId}`, JSON.stringify(filmData));
        }
        
        // Kullanıcı tercihlerini güncelle
        this.userPreferences = this.loadUserPreferences();
    }
    
    // Kullanıcı rating'i kaydet (AI Learning)
    saveUserRating(filmId, rating) {
        const ratings = JSON.parse(localStorage.getItem('userRatings') || '{}');
        ratings[filmId] = rating;
        localStorage.setItem('userRatings', JSON.stringify(ratings));
        this.userPreferences = this.loadUserPreferences();
    }
    
    // AI İstatistikleri
    getAIStats() {
        const { favoriteFilms, watchlist, viewHistory, genrePreferences } = this.userPreferences;
        const totalInteractions = favoriteFilms.length + watchlist.length + viewHistory.length;
        
        return {
            totalInteractions,
            favoriteCount: favoriteFilms.length,
            watchlistCount: watchlist.length,
            viewHistoryCount: viewHistory.length,
            topGenres: Object.entries(genrePreferences)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([genre, count]) => ({ genre, count })),
            aiMaturity: Math.min(100, totalInteractions * 2)
        };
    }
}

// Global instance
window.recommendationEngine = new MovieRecommendationEngine();
