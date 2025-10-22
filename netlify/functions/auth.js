const { createClient } = require('@supabase/supabase-js');

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

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

  const path = event.path.replace('/.netlify/functions/auth', '');
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    // Register
    if (path === '/register' && event.httpMethod === 'POST') {
      const { email, password, firstName, lastName, username } = body;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName, lastName, username }
        }
      });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          user: data.user,
          token: data.session.access_token 
        })
      };
    }

    // Login
    if (path === '/login' && event.httpMethod === 'POST') {
      const { email, password } = body;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          user: data.user,
          token: data.session.access_token 
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not found' })
    };

  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message })
    };
  }
};
