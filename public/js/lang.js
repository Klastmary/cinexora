// Dil çevirileri
const translations = {
    tr: {
        // Header
        home: 'Anasayfa',
        movies: 'Filmler',
        categories: 'Kategoriler',
        about: 'Hakkımızda',
        search: 'Film ara...',
        login: 'Giriş',
        register: 'Kayıt Ol',
        profile: 'Profilim',
        favorites: 'Favorilerim',
        watchlist: 'İzleme Listem',
        adminPanel: 'Admin Panel',
        logout: 'Çıkış Yap',
        
        // Hero
        heroTitle: 'En İyi Filmleri Keşfedin',
        heroDesc: 'Binlerce film arasından favorilerinizi bulun ve izleme listenize ekleyin',
        watchNow: 'Şimdi İzle',
        moreInfo: 'Daha Fazla Bilgi',
        
        // Sections
        featured: 'Öne Çıkan Filmler',
        newReleases: 'Yeni Çıkanlar',
        forYou: 'Yapay Zeka Önerileri',
        personalizedRecs: 'İzleme geçmişine göre AI tarafından seçildi',
        aiConfidence: 'AI Güven',
        aiMaturity: 'AI Olgunluk',
        interactions: 'etkileşim',
        topGenres: 'En sevilen',
        noGenresYet: 'Henüz yok',
        
        // Film Card
        addFavorites: 'Favorilere Ekle',
        addWatchlist: 'İzleme Listesine Ekle',
        
        // Footer
        quickLinks: 'Hızlı Linkler',
        allRightsReserved: 'Tüm hakları saklıdır',
        
        // Modal
        loginTitle: 'Giriş Yap',
        registerTitle: 'Kayıt Ol',
        email: 'E-posta',
        password: 'Şifre',
        firstName: 'Ad',
        lastName: 'Soyad',
        username: 'Kullanıcı Adı',
        confirmPassword: 'Şifre Tekrar',
        noAccount: 'Hesabınız yok mu?',
        haveAccount: 'Zaten hesabınız var mı?',
        
        // Film Details
        director: 'Yönetmen',
        year: 'Yıl',
        duration: 'Süre',
        rating: 'Puan',
        cast: 'Oyuncular',
        
        // Messages
        loading: 'Yükleniyor...',
        noResults: 'Sonuç bulunamadı',
        error: 'Bir hata oluştu',
        
        // Profile
        myProfile: 'Profilim',
        membership: 'Üyelik',
        lastLogin: 'Son Giriş',
        favoriteMovies: 'Favori Filmler',
        myWatchlist: 'İzleme Listem',
        watchedMovies: 'İzlenen Filmler',
        myFavorites: 'Favorilerim',
        activities: 'Aktivitelerim',
        noFavorites: 'Henüz favori filminiz yok',
        addFavoritesDesc: 'Beğendiğiniz filmleri favorilere ekleyin',
        noWatchlist: 'İzleme listeniz boş',
        addWatchlistDesc: 'İzlemek istediğiniz filmleri listeye ekleyin',
        noActivity: 'Henüz aktivite yok',
        browseMovies: 'Filmlere Göz At',
        confirmLogout: 'Çıkış yapmak istediğinize emin misiniz?',
        
        // Admin
        adminPanel: 'Admin Panel',
        totalUsers: 'Toplam Kullanıcı',
        totalLogs: 'Toplam Log',
        todayActivity: 'Bugünkü Aktivite',
        activeUsers: 'Aktif Kullanıcı',
        activityLogs: 'Aktivite Logları',
        users: 'Kullanıcılar',
        refresh: 'Yenile',
        time: 'Zaman',
        action: 'Aksiyon',
        user: 'Kullanıcı',
        ipAddress: 'IP Adresi',
        browser: 'Tarayıcı',
        os: 'İşletim Sistemi',
        status: 'Durum',
        fullName: 'Ad Soyad',
        role: 'Rol',
        registrationDate: 'Kayıt Tarihi',
        successful: 'Başarılı',
        failed: 'Başarısız',
        active: 'Aktif',
        inactive: 'Pasif',
        neverLoggedIn: 'Hiç giriş yapmadı',
        
        // Search
        searchPlaceholder: 'Film ara...',
        searchResults: 'Arama Sonuçları',
        
        // Buttons
        close: 'Kapat',
        submit: 'Gönder',
        cancel: 'İptal',
        save: 'Kaydet',
        delete: 'Sil',
        edit: 'Düzenle',
        
        // Categories
        allCategories: 'Tüm Kategoriler',
        action: 'Aksiyon',
        comedy: 'Komedi',
        drama: 'Drama',
        horror: 'Korku',
        sciFi: 'Bilim Kurgu',
        romance: 'Romantik',
        thriller: 'Gerilim',
        animation: 'Animasyon',
        adventure: 'Macera',
        crime: 'Suç',
        
        // Films Page
        allMovies: 'Tüm Filmler',
        discoverBest: 'En iyi filmleri keşfedin',
        category: 'Kategori',
        allYears: 'Tüm Yıllar',
        moviesFound: 'film bulundu',
        sortBy: 'Sırala',
        newest: 'En Yeni',
        oldest: 'En Eski',
        highestRated: 'En Yüksek Puan',
        lowestRated: 'En Düşük Puan',
        allRatings: 'Tüm Puanlar',
        rating9Plus: '9+ Üstü',
        rating8Plus: '8+ Üstü',
        rating7Plus: '7+ Üstü',
        rating6Plus: '6+ Üstü',
        yearNewOld: 'Yıl (Yeni-Eski)',
        yearOldNew: 'Yıl (Eski-Yeni)',
        applyFilters: 'Filtreleri Uygula',
        loadingMovies: 'Filmler yükleniyor...',
        footerDesc: 'En iyi film deneyimi için doğru adres.',
        
        // Categories Page
        movieCategories: 'Film Kategorileri',
        discoverByInterest: 'İlgi alanınıza göre film keşfedin',
        actionDesc: 'Heyecan dolu aksiyon filmleri',
        dramaDesc: 'Duygusal ve etkileyici hikayeler',
        comedyDesc: 'Eğlenceli ve güldüren filmler',
        sciFiDesc: 'Gelecek ve teknoloji temaları',
        horrorDesc: 'Gerilim dolu korku filmleri',
        romanceDesc: 'Aşk ve romantizm hikayeleri',
        thrillerDesc: 'Nefes kesen gerilim filmleri',
        crimeDesc: 'Suç ve dedektif hikayeleri',
        adventureDesc: 'Keşif ve macera dolu filmler',
        animationDesc: 'Çizgi ve animasyon filmler',
        fantasy: 'Fantastik',
        fantasyDesc: 'Sihir ve fantezi dünyaları',
        documentary: 'Belgesel',
        documentaryDesc: 'Gerçek hikayeler ve belgeseller',
        
        // About Page
        aboutUs: 'Hakkımızda',
        aboutSubtitle: 'FilmSitesi - Film tutkularının buluşma noktası',
        movieLoversAddress: 'Film Tutkularının Adresi',
        aboutPara1: 'FilmSitesi, sinema severlerin en iyi film deneyimini yaşaması için kurulmuş bir platformdur. Binlerce film arasından favorilerinizi keşfedebilir, film hakkında detaylı bilgilere ulaşabilir ve diğer kullanıcılarla görüşlerinizi paylaşabilirsiniz.',
        aboutPara2: 'Misyonumuz, sinema kültürünü yaymak ve film severlere kapsamlı bir platform sunmaktır. Klasik filmlerden en yeni yapımlara kadar geniş bir film arşivine sahip olan sitemiz, kullanıcı dostu arayüzü ve gelişmiş filtreleme özellikleriyle size en iyi deneyimi sunmayı hedeflemektedir.',
        wideArchive: 'Geniş Film Arşivi',
        wideArchiveDesc: 'Binlerce film arasından seçim yapın',
        advancedSearch: 'Gelişmiş Arama',
        advancedSearchDesc: 'Filtreleme ve sıralama özellikleriyle kolayce bulun',
        detailedInfo: 'Detaylı Bilgiler',
        detailedInfoDesc: 'Film hakkında her şeyi öğrenin',
        favoriteList: 'Favori Listesi',
        favoriteListDesc: 'Beğendiğiniz filmleri kaydedin',
        community: 'Topluluk',
        communityDesc: 'Diğer kullanıcılarla etkileşime geçin',
        mobileCompatible: 'Mobil Uyumlu',
        mobileCompatibleDesc: 'Her cihazdan erişim sağlayın',
        moviesLabel: 'Film',
        usersLabel: 'Kullanıcı',
        ratingsLabel: 'Değerlendirme',
        commentsLabel: 'Yorum',
        
        // Footer
        quickLinks: 'Hızlı Linkler',
        account: 'Hesap',
        contact: 'İletişim',
        allRightsReserved: 'Tüm hakları saklıdır',
        
        // Homepage
        browseMovies: 'Filmleri İncele',
        signUp: 'Üye Ol',
        featured: 'Öne Çıkan Filmler',
        newReleases: 'Yeni Eklenenler',
        viewAll: 'Tümünü Gör',
        
        // Profile & User Pages
        likedMovies: 'Beğendiğiniz filmler',
        moviesToWatch: 'İzlemek istediğiniz filmler',
        activityDesc: 'Film izlemeye başladığınızda aktiviteleriniz burada görünecek',
        
        // Contact
        phone: 'Telefon',
        address: 'Adres',
        workingHours: 'Çalışma Saatleri',
        online247: '7/24 Online',
        username: 'Kullanıcı Adı',
        
        // Admin
        searchUsers: 'Kullanıcı ara...'
    },
    en: {
        // Header
        home: 'Home',
        movies: 'Movies',
        categories: 'Categories',
        about: 'About',
        search: 'Search movies...',
        login: 'Login',
        register: 'Sign Up',
        profile: 'My Profile',
        favorites: 'My Favorites',
        watchlist: 'My Watchlist',
        adminPanel: 'Admin Panel',
        logout: 'Logout',
        
        // Hero
        heroTitle: 'Discover the Best Movies',
        heroDesc: 'Find your favorites among thousands of movies and add them to your watchlist',
        watchNow: 'Watch Now',
        moreInfo: 'More Info',
        
        // Sections
        featured: 'Featured Movies',
        newReleases: 'New Releases',
        forYou: 'AI Recommendations',
        personalizedRecs: 'Selected by AI based on your viewing history',
        aiConfidence: 'AI Confidence',
        aiMaturity: 'AI Maturity',
        interactions: 'interactions',
        topGenres: 'Most loved',
        noGenresYet: 'Not yet',
        
        // Film Card
        addFavorites: 'Add to Favorites',
        addWatchlist: 'Add to Watchlist',
        
        // Footer
        quickLinks: 'Quick Links',
        allRightsReserved: 'All rights reserved',
        
        // Modal
        loginTitle: 'Login',
        registerTitle: 'Sign Up',
        email: 'Email',
        password: 'Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'Username',
        confirmPassword: 'Confirm Password',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        
        // Film Details
        director: 'Director',
        year: 'Year',
        duration: 'Duration',
        rating: 'Rating',
        cast: 'Cast',
        
        // Messages
        loading: 'Loading...',
        noResults: 'No results found',
        error: 'An error occurred',
        
        // Profile
        myProfile: 'My Profile',
        membership: 'Membership',
        lastLogin: 'Last Login',
        favoriteMovies: 'Favorite Movies',
        myWatchlist: 'My Watchlist',
        watchedMovies: 'Watched Movies',
        myFavorites: 'My Favorites',
        activities: 'My Activities',
        noFavorites: 'You have no favorite movies yet',
        addFavoritesDesc: 'Add movies you like to favorites',
        noWatchlist: 'Your watchlist is empty',
        addWatchlistDesc: 'Add movies you want to watch to the list',
        noActivity: 'No activity yet',
        browseMovies: 'Browse Movies',
        confirmLogout: 'Are you sure you want to logout?',
        
        // Admin
        adminPanel: 'Admin Panel',
        totalUsers: 'Total Users',
        totalLogs: 'Total Logs',
        todayActivity: 'Today\'s Activity',
        activeUsers: 'Active Users',
        activityLogs: 'Activity Logs',
        users: 'Users',
        refresh: 'Refresh',
        time: 'Time',
        action: 'Action',
        user: 'User',
        ipAddress: 'IP Address',
        browser: 'Browser',
        os: 'Operating System',
        status: 'Status',
        fullName: 'Full Name',
        role: 'Role',
        registrationDate: 'Registration Date',
        successful: 'Successful',
        failed: 'Failed',
        active: 'Active',
        inactive: 'Inactive',
        neverLoggedIn: 'Never logged in',
        
        // Search
        searchPlaceholder: 'Search movies...',
        searchResults: 'Search Results',
        
        // Buttons
        close: 'Close',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        
        // Categories
        allCategories: 'All Categories',
        action: 'Action',
        comedy: 'Comedy',
        drama: 'Drama',
        horror: 'Horror',
        sciFi: 'Sci-Fi',
        romance: 'Romance',
        thriller: 'Thriller',
        animation: 'Animation',
        adventure: 'Adventure',
        crime: 'Crime',
        
        // Films Page
        allMovies: 'All Movies',
        discoverBest: 'Discover the best movies',
        category: 'Category',
        allYears: 'All Years',
        moviesFound: 'movies found',
        sortBy: 'Sort By',
        newest: 'Newest',
        oldest: 'Oldest',
        highestRated: 'Highest Rated',
        lowestRated: 'Lowest Rated',
        allRatings: 'All Ratings',
        rating9Plus: '9+ Above',
        rating8Plus: '8+ Above',
        rating7Plus: '7+ Above',
        rating6Plus: '6+ Above',
        yearNewOld: 'Year (New-Old)',
        yearOldNew: 'Year (Old-New)',
        applyFilters: 'Apply Filters',
        loadingMovies: 'Loading movies...',
        footerDesc: 'The right place for the best movie experience.',
        
        // Categories Page
        movieCategories: 'Movie Categories',
        discoverByInterest: 'Discover movies by your interests',
        actionDesc: 'Thrilling action movies',
        dramaDesc: 'Emotional and touching stories',
        comedyDesc: 'Fun and hilarious movies',
        sciFiDesc: 'Future and technology themes',
        horrorDesc: 'Suspenseful horror movies',
        romanceDesc: 'Love and romance stories',
        thrillerDesc: 'Breathtaking thriller movies',
        crimeDesc: 'Crime and detective stories',
        adventureDesc: 'Exploration and adventure movies',
        animationDesc: 'Cartoon and animation movies',
        fantasy: 'Fantasy',
        fantasyDesc: 'Magic and fantasy worlds',
        documentary: 'Documentary',
        documentaryDesc: 'Real stories and documentaries',
        
        // About Page
        aboutUs: 'About Us',
        aboutSubtitle: 'FilmSitesi - Where movie lovers meet',
        movieLoversAddress: 'The Address for Movie Lovers',
        aboutPara1: 'FilmSitesi is a platform created for cinema lovers to have the best movie experience. You can discover your favorites among thousands of movies, access detailed information about films, and share your opinions with other users.',
        aboutPara2: 'Our mission is to spread cinema culture and provide a comprehensive platform for movie lovers. Our site, which has a wide film archive from classic movies to the latest productions, aims to provide you with the best experience with its user-friendly interface and advanced filtering features.',
        wideArchive: 'Wide Film Archive',
        wideArchiveDesc: 'Choose from thousands of movies',
        advancedSearch: 'Advanced Search',
        advancedSearchDesc: 'Find easily with filtering and sorting features',
        detailedInfo: 'Detailed Information',
        detailedInfoDesc: 'Learn everything about the movie',
        favoriteList: 'Favorite List',
        favoriteListDesc: 'Save the movies you like',
        community: 'Community',
        communityDesc: 'Interact with other users',
        mobileCompatible: 'Mobile Compatible',
        mobileCompatibleDesc: 'Access from any device',
        moviesLabel: 'Movies',
        usersLabel: 'Users',
        ratingsLabel: 'Ratings',
        commentsLabel: 'Comments',
        
        // Footer
        quickLinks: 'Quick Links',
        account: 'Account',
        contact: 'Contact',
        allRightsReserved: 'All rights reserved',
        
        // Homepage
        browseMovies: 'Browse Movies',
        signUp: 'Sign Up',
        featured: 'Featured Movies',
        newReleases: 'New Releases',
        viewAll: 'View All',
        
        // Profile & User Pages
        likedMovies: 'Your liked movies',
        moviesToWatch: 'Movies you want to watch',
        activityDesc: 'Your activities will appear here when you start watching movies',
        
        // Contact
        phone: 'Phone',
        address: 'Address',
        workingHours: 'Working Hours',
        online247: '24/7 Online',
        username: 'Username',
        
        // Admin
        searchUsers: 'Search users...'
    }
};

// Mevcut dil
let currentLang = localStorage.getItem('language') || 'tr';

// Dil değiştir
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
    
    // Aktif bayrağı güncelle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Film kartlarını yeniden yükle
    if (typeof loadFeaturedFilms === 'function') loadFeaturedFilms();
    if (typeof loadNewReleases === 'function') loadNewReleases();
    if (typeof loadFilms === 'function') loadFilms();
}

// Sayfadaki metinleri güncelle
function updatePageLanguage() {
    const t = translations[currentLang];
    
    // data-lang-key attribute'u olan tüm elementleri güncelle
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (t[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = t[key];
            } else {
                // HTML içeriğini koru, sadece text'i değiştir
                const html = element.innerHTML;
                const textOnly = element.textContent.trim();
                element.innerHTML = html.replace(textOnly, t[key]);
            }
        }
    });
}

// Sayfa yüklendiğinde dili uygula
document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage();
    
    // Aktif bayrağı ayarla
    const activeBtn = document.querySelector(`[data-lang="${currentLang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
});

// Çeviri fonksiyonu
function t(key) {
    return translations[currentLang][key] || key;
}
