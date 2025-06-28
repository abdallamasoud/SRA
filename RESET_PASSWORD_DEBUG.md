# تشخيص مشكلة إعادة تعيين كلمة المرور

## 🚨 المشكلة الحالية
```
{"errors":["The Code field is required."],"statusCode":400,"message":" Bad Request"}
```

## 🔍 تشخيص المشكلة

### 1. المشكلة الأساسية
الباك إند يتوقع حقل `code` لكن الكود كان يرسل `token`

### 2. الحل المطبق
```typescript
// قبل (خطأ)
const requestBody = {
  token: token,
  newPassword: newPassword
};

// بعد (صحيح)
const requestBody = {
  code: token,  // ✅ الباك إند يتوقع 'code'
  newPassword: newPassword,
  password: newPassword  // ✅ خيار بديل
};
```

## 🧪 اختبار الحل

### الخطوات:
1. **افتح Console** (F12)
2. **جرب إعادة تعيين كلمة المرور**
3. **راقب الرسائل:**

```
AuthService - Reset Password Request: {token: "abc123...", userId: "123"}
AuthService - Request Body: {code: "abc123...", newPassword: "newpass", password: "newpass", userId: "123"}
```

### النتيجة المتوقعة:
- ✅ لا توجد رسالة "The Code field is required"
- ✅ إعادة تعيين ناجحة أو رسالة خطأ أخرى

## 🔧 إذا لم يعمل الحل

### جرب هذه الـ field names:

```typescript
// الخيار 1
const requestBody = {
  code: token,
  password: newPassword
};

// الخيار 2
const requestBody = {
  code: token,
  newPassword: newPassword
};

// الخيار 3
const requestBody = {
  resetCode: token,
  newPassword: newPassword
};

// الخيار 4
const requestBody = {
  token: token,
  password: newPassword
};
```

## 📝 معلومات مطلوبة من الباك إند

### 1. تحقق من Swagger
اذهب إلى: `https://localhost:7174/swagger`
ابحث عن endpoint إعادة تعيين كلمة المرور

### 2. تحقق من Model
```csharp
// في الباك إند، ابحث عن Model مثل:
public class ResetPasswordRequest
{
    public string Code { get; set; }
    public string Password { get; set; }
    // أو
    public string NewPassword { get; set; }
}
```

### 3. تحقق من Controller
```csharp
[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
{
    // ما هي الحقول المتوقعة؟
}
```

## 🎯 الأسباب المحتملة

| السبب | الحل |
|-------|------|
| حقل `code` مفقود | ✅ تم إصلاحه |
| حقل `password` بدلاً من `newPassword` | ✅ تم إضافة كليهما |
| حقل `userId` مطلوب | ✅ تم إضافته |
| endpoint خاطئ | جرب `/reset-password` |

## 📞 معلومات إضافية مطلوبة

1. **ما هو الـ Model في الباك إند؟**
2. **ما هي الحقول المطلوبة؟**
3. **هل هناك validation rules؟**
4. **ما هو الـ endpoint الصحيح؟**

## 🚀 النتيجة المتوقعة

بعد الإصلاح:
- ✅ لا توجد رسالة "The Code field is required"
- ✅ إرسال البيانات بالشكل الصحيح
- ✅ معالجة أخطاء Validation
- ✅ رسائل خطأ واضحة 