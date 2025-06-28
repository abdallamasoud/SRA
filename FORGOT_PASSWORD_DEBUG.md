# تشخيص مشكلة نسيان كلمة المرور

## 🔍 المشكلة
البريد الإلكتروني موجود في قاعدة البيانات لكن الباك إند يرجع "Not Found"

## 🧪 خطوات التشخيص

### 1. فتح Developer Tools
1. اضغط `F12` في المتصفح
2. اذهب إلى تبويب `Console`
3. اذهب إلى تبويب `Network`

### 2. اختبار نسيان كلمة المرور
1. اذهب إلى صفحة نسيان كلمة المرور
2. أدخل بريد إلكتروني تعرف أنه موجود
3. اضغط "إرسال"

### 3. مراقبة الـ Console
ابحث عن هذه الرسائل:

```
AuthService - Forgot Password Request: {email: "your@email.com"}
AuthService - API URL: https://localhost:7174/api/Accounts/ForgotPassword
AuthService - Request Body: {email: "your@email.com"}
```

### 4. مراقبة الـ Network
ابحث عن:
- **Request URL:** `https://localhost:7174/api/Accounts/ForgotPassword`
- **Request Method:** `POST`
- **Request Payload:** `{"email":"your@email.com"}`
- **Response Status:** `404 Not Found`

## 🔧 الأسباب المحتملة

### 1. خطأ في اسم الـ Endpoint
**الحل:** جرب هذه الأسماء:
- `/ForgotPassword` ✅ (الحالي)
- `/forgot-password`
- `/forget-password`
- `/forgotpassword`

### 2. خطأ في الـ Base URL
**الحل:** تأكد من أن الباك إند يعمل على:
- `https://localhost:7174`
- `http://localhost:5000`
- `https://localhost:44300`

### 3. خطأ في الـ Route في الباك إند
**الحل:** تحقق من ملف `Program.cs` أو `Startup.cs` في الباك إند

### 4. مشكلة في CORS
**الحل:** تحقق من إعدادات CORS في الباك إند

## 📝 معلومات مطلوبة للتشخيص

### من الفرونت إند:
```javascript
// في Console
AuthService - Forgot Password Request: {email: "test@example.com"}
AuthService - API URL: https://localhost:7174/api/Accounts/ForgotPassword
AuthService - Request Body: {email: "test@example.com"}
AuthService - Forgot Password error: [Error object]
AuthService - Error Status: 404
AuthService - Error URL: https://localhost:7174/api/Accounts/ForgotPassword
```

### من الباك إند:
```csharp
// في Controller
[HttpPost("ForgotPassword")]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
{
    // هل يصل هنا؟
    // ما هو محتوى request.Email؟
}
```

## 🚀 الحلول المقترحة

### الحل 1: تغيير الـ Endpoint
```typescript
// جرب هذا في AuthService
return this.http.post(`${this.apiUrl}/forgot-password`, { email })
```

### الحل 2: تغيير الـ Base URL
```typescript
// جرب هذا في AuthService
private apiUrl = 'http://localhost:5000/api/Accounts';
```

### الحل 3: إضافة Headers
```typescript
// جرب هذا في AuthService
return this.http.post(`${this.apiUrl}/ForgotPassword`, { email }, {
  headers: { 'Content-Type': 'application/json' }
})
```

## 📞 معلومات إضافية مطلوبة

1. **هل الباك إند يعمل؟** - تحقق من `https://localhost:7174/swagger`
2. **ما هو الـ Endpoint الصحيح؟** - تحقق من Swagger أو Postman
3. **هل هناك CORS errors؟** - تحقق من Console
4. **ما هو الـ Response من الباك إند؟** - تحقق من Network tab

## 🎯 النتيجة المتوقعة

بعد التشخيص، يجب أن نعرف:
- ✅ الـ Endpoint الصحيح
- ✅ الـ Base URL الصحيح
- ✅ سبب الـ 404 error
- ✅ الحل المناسب 