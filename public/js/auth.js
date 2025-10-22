// API Base URL
const API_BASE_URL = '/api';

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Token'ı kaydet
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Başarılı giriş mesajı
                errorMessage.style.display = 'block';
                errorMessage.className = 'success-message';
                errorMessage.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';

                // Anasayfaya yönlendir
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                // Hata mesajı göster
                errorMessage.style.display = 'block';
                errorMessage.className = 'error-message';
                errorMessage.textContent = data.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.style.display = 'block';
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
    });
}

// Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        // Şifre kontrolü
        if (password !== confirmPassword) {
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            errorMessage.textContent = 'Şifreler eşleşmiyor!';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Token'ı kaydet
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Başarılı kayıt mesajı
                errorMessage.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.textContent = 'Kayıt başarılı! Yönlendiriliyorsunuz...';

                // Anasayfaya yönlendir
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                // Hata mesajı göster
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                
                if (data.errors && Array.isArray(data.errors)) {
                    errorMessage.textContent = data.errors.map(err => err.msg).join(', ');
                } else {
                    errorMessage.textContent = data.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
                }
            }
        } catch (error) {
            console.error('Register error:', error);
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
    });
}
