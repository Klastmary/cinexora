const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/film-sitesi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.log('MongoDB bağlantı hatası:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/films', require('./routes/films'));
app.use('/api/admin', require('./routes/admin'));

// Geçici film ekleme endpoint'i (admin auth olmadan)
const fs = require('fs');

let filmsData = [];
let nextId = 1;

// JSON dosyasını yükle
function loadFilmsData() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'films.json'), 'utf8');
    filmsData = JSON.parse(data);
    nextId = Math.max(...filmsData.map(f => f.id || 0), 0) + 1;
  } catch (error) {
    // Dosya yoksa boş array ile başla
    filmsData = [];
    nextId = 1;
  }
}

// JSON dosyasını kaydet
function saveFilmsData() {
  fs.writeFileSync(path.join(__dirname, 'films.json'), JSON.stringify(filmsData, null, 2));
}

// Başlangıçta veriyi yükle
loadFilmsData();

app.post('/api/public/add-films-bulk', async (req, res) => {
  try {
    const { films } = req.body;

    if (!films || !Array.isArray(films)) {
      return res.status(400).json({ message: 'Films array gerekli' });
    }

    const addedFilms = [];
    for (const filmData of films) {
      // Aynı filmden varsa önce sil
      filmsData = filmsData.filter(f => f.title !== filmData.title);

      const newFilm = {
        id: nextId++,
        ...filmData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      filmsData.push(newFilm);
      addedFilms.push(filmData.title);
    }

    saveFilmsData();

    res.json({
      message: 'Filmler başarıyla eklendi',
      addedFilms,
      count: addedFilms.length
    });
  } catch (error) {
    console.error('Add films error:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

app.post('/api/public/add-films-bulk', async (req, res) => {
  try {
    const { films } = req.body;

    if (!films || !Array.isArray(films)) {
      return res.status(400).json({ message: 'Films array gerekli' });
    }

    const addedFilms = [];
    for (const filmData of films) {
      // Aynı filmden varsa önce sil
      filmsData = filmsData.filter(f => f.title !== filmData.title);

      const newFilm = {
        id: nextId++,
        ...filmData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      filmsData.push(newFilm);
      addedFilms.push(filmData.title);
    }

    saveFilmsData();

    res.json({
      message: 'Filmler başarıyla eklendi',
      addedFilms,
      count: addedFilms.length
    });
  } catch (error) {
    console.error('Add films error:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// MongoDB bağlantısını kaldır
// mongoose.connect(...)
// .then(() => console.log('MongoDB bağlantısı başarılı'))
// .catch(err => console.log('MongoDB bağlantı hatası:', err));

// React build dosyalarını serve et
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
