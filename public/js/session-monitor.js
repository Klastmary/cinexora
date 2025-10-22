// Session monitoring - Başka cihazdan giriş kontrolü
let currentSessionToken = localStorage.getItem('token');
let sessionCheckInterval;

function startSessionMonitoring() {
    // Her 10 saniyede bir kontrol et
    sessionCheckInterval = setInterval(checkSession, 10000);
}

async function checkSession() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.id) {
        stopSessionMonitoring();
        return;
    }
    
    try {
        const response = await fetch('/api/auth/check-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                userId: user.id,
                currentToken: token 
            })
        });
        
        const data = await response.json();
        
        if (!data.valid) {
            // Oturum geçersiz - başka yerden giriş yapılmış
            handleSessionInvalidated();
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}

function handleSessionInvalidated() {
    stopSessionMonitoring();
    
    // Dil kontrolü
    const currentLang = localStorage.getItem('language') || 'tr';
    
    const messages = {
        tr: 'Hesabınıza başka bir cihazdan giriş yapıldı. Güvenliğiniz için oturumunuz kapatıldı.\n\nEğer bu giriş siz değilseniz, lütfen şifrenizi değiştirin!',
        en: 'Your account has been accessed from another device. Your session has been closed for security.\n\nIf this was not you, please change your password!'
    };
    
    // Kullanıcıyı çıkart
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Uyarı göster
    alert(messages[currentLang]);
    
    // Ana sayfaya yönlendir
    window.location.href = '/';
}

function stopSessionMonitoring() {
    if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        sessionCheckInterval = null;
    }
}

// Sayfa yüklendiğinde monitoring'i başlat
if (localStorage.getItem('token')) {
    startSessionMonitoring();
}

// Logout olduğunda monitoring'i durdur
window.addEventListener('beforeunload', () => {
    stopSessionMonitoring();
});
