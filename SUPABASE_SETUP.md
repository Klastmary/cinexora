# Supabase Kurulum Talimatları

## 1. Supabase Hesabı Oluştur
1. https://supabase.com adresine git
2. "Start your project" tıkla
3. GitHub ile giriş yap (ücretsiz)

## 2. Yeni Proje Oluştur
1. "New Project" tıkla
2. Name: `cinexora`
3. Database Password: Güçlü bir şifre oluştur (kaydet!)
4. Region: `Europe (Frankfurt)` seç
5. "Create new project" tıkla
6. 2-3 dakika bekle (proje hazırlanıyor)

## 3. API Keys Al
1. Sol menüden "Settings" → "API"
2. **Project URL** kopyala
3. **anon public** key kopyala

## 4. Netlify'da Environment Variables Ekle
1. Netlify dashboard'a git
2. Site settings → Environment variables
3. Şu değişkenleri ekle:

```
SUPABASE_URL = [Project URL buraya]
SUPABASE_KEY = [anon public key buraya]
```

## 5. GitHub'a Push
1. GitHub Desktop'ı aç
2. Commit: "Backend eklendi - Netlify Functions + Supabase"
3. Push origin

## 6. Netlify Otomatik Deploy
- 3-5 dakika bekle
- Site otomatik güncellenecek
- Giriş/Kayıt sistemi çalışacak!

## Test Et
1. https://cinexora.netlify.app
2. "Kayıt Ol" tıkla
3. Email ve şifre gir
4. Kayıt ol!
5. Giriş yap!

## Notlar
- Supabase ücretsiz plan: 500MB database, 50,000 monthly active users
- Netlify Functions: 125,000 requests/month ücretsiz
- İkisi de yeterli! 🎉
