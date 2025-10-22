const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Geçici film ekleme endpoint'i (herkese açık)
router.post('/add-films-bulk', async (req, res) => {
  try {
    const { films } = req.body;

    if (!films || !Array.isArray(films)) {
      return res.status(400).json({ message: 'Films array gerekli' });
    }

    // Mevcut filmleri oku
    let filmsData = [];
    try {
      const data = fs.readFileSync(path.join(__dirname, '../films.json'), 'utf8');
      filmsData = JSON.parse(data);
    } catch (error) {
      filmsData = [];
    }

    let nextId = 1;
    if (filmsData.length > 0) {
      nextId = Math.max(...filmsData.map(f => f.id || 0), 0) + 1;
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

    // JSON dosyasını kaydet
    fs.writeFileSync(path.join(__dirname, '../films.json'), JSON.stringify(filmsData, null, 2));

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

module.exports = router;
