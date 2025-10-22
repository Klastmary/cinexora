const films = require('../../films.json');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/films', '');
  const params = event.queryStringParameters || {};

  try {
    // Get all films
    if (path === '' && event.httpMethod === 'GET') {
      let filteredFilms = [...films];

      // Search
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredFilms = filteredFilms.filter(f => 
          f.title.toLowerCase().includes(searchLower) ||
          (f.description && f.description.toLowerCase().includes(searchLower))
        );
      }

      // Genre filter
      if (params.genre) {
        filteredFilms = filteredFilms.filter(f => {
          const genres = Array.isArray(f.genre) ? f.genre : [f.genre];
          return genres.includes(params.genre);
        });
      }

      // Year filter
      if (params.year) {
        filteredFilms = filteredFilms.filter(f => f.year == params.year);
      }

      // Sort
      if (params.sortBy) {
        const order = params.sortOrder === 'asc' ? 1 : -1;
        filteredFilms.sort((a, b) => {
          if (params.sortBy === 'rating') return (a.rating - b.rating) * order;
          if (params.sortBy === 'year') return (a.year - b.year) * order;
          if (params.sortBy === 'title') return a.title.localeCompare(b.title) * order;
          return 0;
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          films: filteredFilms,
          total: filteredFilms.length 
        })
      };
    }

    // Get single film
    if (path.match(/^\/\d+$/) && event.httpMethod === 'GET') {
      const filmId = parseInt(path.substring(1));
      const film = films.find(f => f.id === filmId);

      if (!film) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Film not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(film)
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not found' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: error.message })
    };
  }
};
