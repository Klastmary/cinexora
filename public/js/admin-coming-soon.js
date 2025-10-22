// Admin Panel - Yakında Mesajı
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde yakında mesajı göster
    const container = document.querySelector('.container');
    if (container) {
        // Tüm içeriği gizle
        const content = container.innerHTML;
        container.innerHTML = '';
        
        // Yakında mesajı
        const comingSoonMessage = document.createElement('div');
        comingSoonMessage.style.cssText = 'text-align: center; padding: 100px 20px; min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center;';
        comingSoonMessage.innerHTML = `
            <i class="fas fa-tools" style="font-size: 80px; color: #ff9800; margin-bottom: 30px;"></i>
            <h1 style="color: #fff; font-size: 36px; margin-bottom: 20px;">
                <i class="fas fa-clock"></i> Yakında!
            </h1>
            <p style="color: #888; font-size: 18px; max-width: 600px; margin-bottom: 30px;">
                Admin paneli şu anda geliştirilme aşamasında. Çok yakında kullanıma açılacak!
            </p>
            <a href="/" class="btn-primary" style="padding: 15px 30px; text-decoration: none;">
                <i class="fas fa-home"></i> Anasayfaya Dön
            </a>
        `;
        container.appendChild(comingSoonMessage);
    }
});
