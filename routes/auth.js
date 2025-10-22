const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// JSON dosyasından kullanıcıları oku
function getUsers() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../users.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// JSON dosyasına kullanıcıları kaydet
function saveUsers(users) {
  fs.writeFileSync(path.join(__dirname, '../users.json'), JSON.stringify(users, null, 2));
}

// Aktif session'ları sakla (memory'de)
const activeSessions = new Map(); // userId -> { token, timestamp }

// Log dosyasından logları oku
function getLogs() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../user-logs.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Log dosyasına log kaydet
function saveLog(log) {
  const logs = getLogs();
  logs.push(log);
  fs.writeFileSync(path.join(__dirname, '../user-logs.json'), JSON.stringify(logs, null, 2));
}

// IP adresini al
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }
  
  const remoteAddress = req.connection?.remoteAddress || 
                       req.socket?.remoteAddress || 
                       req.connection?.socket?.remoteAddress;
  
  // IPv6 localhost'u IPv4'e çevir
  if (remoteAddress === '::1' || remoteAddress === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  
  // IPv6 formatını temizle
  if (remoteAddress && remoteAddress.startsWith('::ffff:')) {
    return remoteAddress.substring(7);
  }
  
  return remoteAddress || 'Unknown';
}

// Kullanıcı aktivitesini logla
function logUserActivity(action, user, req, additionalInfo = {}) {
  const log = {
    id: getLogs().length + 1,
    timestamp: new Date().toISOString(),
    action: action, // 'register', 'login', 'logout', 'view_film', etc.
    userId: user?.id || null,
    username: user?.username || 'anonymous',
    email: user?.email || null,
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'],
    browser: parseBrowser(req.headers['user-agent']),
    os: parseOS(req.headers['user-agent']),
    ...additionalInfo
  };
  saveLog(log);
  return log;
}

// User Agent'tan tarayıcı bilgisi çıkar
function parseBrowser(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Brave')) return 'Brave';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  
  return 'Other';
}

// User Agent'tan işletim sistemi bilgisi çıkar
function parseOS(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Windows NT 10.0')) return 'Windows 10';
  if (userAgent.includes('Windows NT 11.0')) return 'Windows 11';
  if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
  if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS X 10_15')) return 'macOS Catalina';
  if (userAgent.includes('Mac OS X 10_14')) return 'macOS Mojave';
  if (userAgent.includes('Mac OS X')) return 'macOS';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone')) return 'iOS (iPhone)';
  if (userAgent.includes('iPad')) return 'iOS (iPad)';
  if (userAgent.includes('Linux')) return 'Linux';
  
  return 'Other';
}

// Register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalı'),
  body('email').isEmail().withMessage('Geçerli bir email adresi girin'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
  body('firstName').notEmpty().withMessage('Ad gerekli'),
  body('lastName').notEmpty().withMessage('Soyad gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName } = req.body;
    const users = getUsers();

    // Kullanıcı var mı kontrol et
    const existingUser = users.find(u => u.email === email || u.username === username);

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Bu email veya kullanıcı adı zaten kullanılıyor' 
      });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      favoriteFilms: [],
      watchlist: []
    };

    users.push(newUser);
    saveUsers(users);

    // Kullanıcı kaydını logla
    logUserActivity('Kayıt Oldu', newUser, req, {
      success: true,
      message: 'Yeni kullanıcı kaydı oluşturuldu'
    });

    // JWT token oluştur
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Geçerli bir email adresi girin'),
  body('password').notEmpty().withMessage('Şifre gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const users = getUsers();

    // Kullanıcıyı bul
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre' });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre' });
    }

    // Hesap aktif mi kontrol et
    if (!user.isActive) {
      return res.status(400).json({ message: 'Hesabınız deaktif edilmiş' });
    }

    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    saveUsers(users);

    // Kullanıcı girişini logla
    logUserActivity('Giriş Yaptı', user, req, {
      success: true,
      message: 'Kullanıcı başarıyla giriş yaptı'
    });

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Aktif session'ı kaydet
    activeSessions.set(user.id, {
      token,
      timestamp: Date.now()
    });

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Logları görüntüle (Admin)
router.get('/logs', async (req, res) => {
  try {
    const logs = getLogs();
    
    // Son 100 log
    const recentLogs = logs.slice(-100).reverse();
    
    res.json({
      total: logs.length,
      logs: recentLogs
    });
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Kullanıcıları görüntüle (Admin)
router.get('/users', async (req, res) => {
  try {
    const users = getUsers();
    
    // Şifreleri çıkar
    const safeUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
      favoriteFilms: u.favoriteFilms || [],
      watchlist: u.watchlist || []
    }));
    
    res.json({
      total: safeUsers.length,
      users: safeUsers
    });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Session kontrolü endpoint'i
router.post('/check-session', async (req, res) => {
  try {
    const { userId, currentToken } = req.body;
    
    if (!userId || !currentToken) {
      return res.json({ valid: false });
    }
    
    // Aktif session'ı kontrol et
    const activeSession = activeSessions.get(userId);
    
    if (!activeSession) {
      return res.json({ valid: false });
    }
    
    // Token eşleşiyor mu kontrol et
    if (activeSession.token !== currentToken) {
      // Başka bir token var - başka yerden giriş yapılmış
      return res.json({ valid: false, reason: 'new_login' });
    }
    
    // Session geçerli
    res.json({ valid: true });
  } catch (error) {
    console.error('Session check error:', error);
    res.json({ valid: false });
  }
});

module.exports = router;
