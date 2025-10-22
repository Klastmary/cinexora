const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// JSON dosyasından film verisini oku
function getFilmsData() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../films.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Tüm filmleri getir (sayfalama ile)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const {
      genre,
      year,
      rating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let films = getFilmsData();

    // Filtreleme
    if (genre) {
      const genres = genre.split(',');
      films = films.filter(film =>
        film.genre && film.genre.some(g => genres.includes(g))
      );
    }

    if (year) {
      films = films.filter(film => film.year === parseInt(year));
    }

    if (rating) {
      films = films.filter(film => film.rating >= parseFloat(rating));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      films = films.filter(film =>
        film.title.toLowerCase().includes(searchLower) ||
        film.director.toLowerCase().includes(searchLower) ||
        (film.description && film.description.toLowerCase().includes(searchLower))
      );
    }

    // Sıralama
    films.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const total = films.length;
    const paginatedFilms = films.slice(skip, skip + limit);

    res.json({
      films: paginatedFilms,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalFilms: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get films error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Öne çıkan filmleri getir
router.get('/featured', async (req, res) => {
  try {
    const films = getFilmsData()
      .filter(film => film.isFeatured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);

    res.json(films);
  } catch (error) {
    console.error('Get featured films error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Yeni çıkan filmleri getir
router.get('/new-releases', async (req, res) => {
  try {
    const films = getFilmsData()
      .filter(film => film.isNewRelease)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    res.json(films);
  } catch (error) {
    console.error('Get new releases error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Film detayını getir
router.get('/:id', async (req, res) => {
  try {
    const films = getFilmsData();
    const film = films.find(f => f.id === parseInt(req.params.id));

    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }

    res.json(film);
  } catch (error) {
    console.error('Get film detail error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Benzer filmleri getir
router.get('/:id/similar', async (req, res) => {
  try {
    const films = getFilmsData();
    const film = films.find(f => f.id === parseInt(req.params.id));

    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }

    const similarFilms = films
      .filter(f => f.id !== film.id && f.genre.some(g => film.genre.includes(g)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);

    res.json(similarFilms);
  } catch (error) {
    console.error('Get similar films error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Kategorileri getir
router.get('/genres/list', async (req, res) => {
  try {
    const films = getFilmsData();
    const genres = [...new Set(films.flatMap(film => film.genre))].sort();
    res.json(genres);
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Favorilere ekle/çıkar
// Aktivite log fonksiyonu
async function logActivity(userId, action, filmId) {
  try {
    // Kullanıcı bilgisini al
    const usersPath = path.join(__dirname, '../users.json');
    let users = [];
    try {
      const userData = fs.readFileSync(usersPath, 'utf8');
      users = JSON.parse(userData);
    } catch (error) {
      console.error('Users read error:', error);
    }
    
    // Film bilgisini al
    const filmsPath = path.join(__dirname, '../films.json');
    let films = [];
    try {
      const filmsData = fs.readFileSync(filmsPath, 'utf8');
      films = JSON.parse(filmsData);
    } catch (error) {
      console.error('Films read error:', error);
    }
    
    // Kullanıcı ve film bilgilerini bul
    const user = users.find(u => u.id === userId);
    const film = films.find(f => f.id === filmId);
    
    const username = user ? user.username : 'Bilinmeyen Kullanıcı';
    const filmTitle = film ? film.title : 'Bilinmeyen Film';
    
    // Log dosyasını oku
    const logsPath = path.join(__dirname, '../user-logs.json');
    let logs = [];
    
    try {
      const data = fs.readFileSync(logsPath, 'utf8');
      logs = JSON.parse(data);
    } catch (error) {
      logs = [];
    }
    
    // Yeni log ekle
    logs.push({
      id: logs.length + 1,
      userId,
      username,
      action,
      filmId,
      filmTitle,
      timestamp: new Date().toISOString(),
      userAgent: 'Web Browser',
      ip: '127.0.0.1',
      success: true
    });
    
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
    console.log(`Log added: ${username} - ${action} - ${filmTitle}`);
  } catch (error) {
    console.error('Log activity error:', error);
  }
}

router.post('/:id/favorite', async (req, res) => {
  try {
    const filmId = parseInt(req.params.id);
    const userId = req.body.userId;

    const usersPath = path.join(__dirname, '../users.json');
    let users = [];
    
    try {
      const data = fs.readFileSync(usersPath, 'utf8');
      users = JSON.parse(data);
    } catch (error) {
      users = [];
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.favoriteFilms) {
      user.favoriteFilms = [];
    }

    const index = user.favoriteFilms.indexOf(filmId);
    if (index > -1) {
      user.favoriteFilms.splice(index, 1);
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
      await logActivity(userId, 'Favorilerden Çıkar', filmId);
      return res.json({ message: 'Film favorilerden çıkarıldı', isFavorite: false });
    } else {
      user.favoriteFilms.push(filmId);
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
      await logActivity(userId, 'Favorilere Ekle', filmId);
      return res.json({ message: 'Film favorilere eklendi', isFavorite: true });
    }
  } catch (error) {
    console.error('Favorite toggle error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// İzleme listesine ekle/çıkar
router.post('/:id/watchlist', async (req, res) => {
  try {
    const filmId = parseInt(req.params.id);
    const userId = req.body.userId;

    const usersPath = path.join(__dirname, '../users.json');
    let users = [];
    
    try {
      const data = fs.readFileSync(usersPath, 'utf8');
      users = JSON.parse(data);
    } catch (error) {
      users = [];
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.watchlist) {
      user.watchlist = [];
    }

    const index = user.watchlist.indexOf(filmId);
    if (index > -1) {
      user.watchlist.splice(index, 1);
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
      await logActivity(userId, 'İzleme Listesinden Çıkar', filmId);
      return res.json({ message: 'Film izleme listesinden çıkarıldı', isInWatchlist: false });
    } else {
      user.watchlist.push(filmId);
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
      await logActivity(userId, 'İzleme Listesine Ekle', filmId);
      return res.json({ message: 'Film izleme listesine eklendi', isInWatchlist: true });
    }
  } catch (error) {
    console.error('Watchlist toggle error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
