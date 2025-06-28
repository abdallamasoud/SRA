# حل سريع لمشكلة نسيان كلمة المرور

## 🚨 المشكلة
البريد الإلكتروني موجود لكن الباك إند يرجع "Not Found"

## ⚡ الحلول السريعة

### الحل 1: تغيير الـ Endpoint (الأكثر احتمالاً)
```typescript
// في src/app/services/auth.service.ts
// غير السطر 108 من:
return this.http.post(`${this.apiUrl}/ForgotPassword`, { email })

// إلى:
return this.http.post(`${this.apiUrl}/forgot-password`, { email })
```

### الحل 2: تغيير الـ Base URL
```typescript
// في src/app/services/auth.service.ts
// غير السطر 16 من:
private apiUrl = 'https://localhost:7174/api/Accounts';

// إلى:
private apiUrl = 'http://localhost:5000/api/Accounts';
```

### الحل 3: جرب جميع الـ Endpoints
```typescript
// جرب هذه الـ endpoints واحد تلو الآخر:

// 1. forgot-password (الأكثر شيوعاً)
return this.http.post(`${this.apiUrl}/forgot-password`, { email })

// 2. forget-password
return this.http.post(`${this.apiUrl}/forget-password`, { email })

// 3. ForgotPassword (الحالي)
return this.http.post(`${this.apiUrl}/ForgotPassword`, { email })

// 4. forgotpassword
return this.http.post(`${this.apiUrl}/forgotpassword`, { email })
```

## 🔍 تشخيص سريع

### 1. تحقق من الباك إند
افتح المتصفح واذهب إلى:
- `https://localhost:7174/swagger`
- `http://localhost:5000/swagger`
- `https://localhost:44300/swagger`

### 2. ابحث عن الـ Endpoint الصحيح
في Swagger، ابحث عن:
- `forgot-password`
- `forget-password`
- `ForgotPassword`

### 3. اختبر الـ Endpoint
في Swagger، جرب الـ endpoint مع بريد إلكتروني موجود

## 🎯 الأسباب الأكثر شيوعاً

| السبب | الحل |
|-------|------|
| خطأ في اسم الـ endpoint | جرب `/forgot-password` |
| خطأ في الـ port | جرب `http://localhost:5000` |
| مشكلة في CORS | أضف headers |
| الباك إند متوقف | شغل الباك إند |

## 📞 معلومات مطلوبة

1. **ما هو الـ endpoint في Swagger؟**
2. **على أي port يعمل الباك إند؟**
3. **هل الباك إند يعمل؟**
4. **ما هو الـ error في Console؟**

## ⚡ خطوات سريعة للاختبار

1. **افتح Console** (F12)
2. **جرب نسيان كلمة المرور**
3. **راقب الـ error**
4. **جرب الحلول أعلاه**
5. **أخبرني بالنتيجة**

## 🎉 النتيجة المتوقعة

بعد تطبيق الحل الصحيح:
- ✅ رسالة نجاح بدلاً من "Not Found"
- ✅ إرسال إيميل إعادة تعيين كلمة المرور
- ✅ عدم وجود أخطاء في Console 