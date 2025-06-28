# دليل تشخيص مشاكل التوكين في الفرونت إند

## 🔍 المشاكل المحتملة

### 1. مشاكل في استخراج التوكين من URL
### 2. مشاكل في تنظيف ومعالجة التوكين
### 3. مشاكل في التحقق من صحة التوكين
### 4. مشاكل في إرسال التوكين للباك إند

## 🧪 خطوات التشخيص

### الخطوة 1: فتح Developer Tools
1. اضغط `F12` في المتصفح
2. اذهب إلى تبويب `Console`
3. اذهب إلى تبويب `Network`

### الخطوة 2: اختبار رابط إعادة تعيين كلمة المرور
1. اتبع رابط إعادة تعيين كلمة المرور من الإيميل
2. راقب الرسائل في Console

### الخطوة 3: مراقبة الرسائل المتوقعة

```
Reset Password - Query Params: {userId: "123", code: "abc123..."}
Reset Password - Original Code Info: {length: 50, preview: "abc123...", ...}
Reset Password - Cleaned Code Info: {length: 50, preview: "abc123...", ...}
Reset Password - Token is valid, ready for reset
```

## 🔧 التحسينات المطبقة

### 1. تحسين TokenUtils:

```typescript
// تحسين التحقق من صحة التوكين
static isValidToken(token: string): boolean {
  if (!token || token.trim().length === 0) {
    console.log('TokenUtils - Token is empty');
    return false;
  }
  
  // تقليل الحد الأدنى للأحرف
  if (token.length < 5) {
    console.log('TokenUtils - Token too short:', token.length);
    return false;
  }
  
  // التحقق من القيم غير الصحيحة
  if (token.includes('undefined') || token.includes('null')) {
    console.log('TokenUtils - Token contains invalid values');
    return false;
  }
  
  console.log('TokenUtils - Token is valid');
  return true;
}
```

### 2. تحسين المكونات:

```typescript
// إضافة logging مفصل
if (!this.userId || !this.code) {
  this.errorMessage = 'Invalid or missing reset token. Please request a new password reset link.';
  console.log('Reset Password - Missing userId or code');
} else {
  // تنظيف ومعالجة التوكين
  this.code = TokenUtils.cleanAndDecodeToken(this.code);
  TokenUtils.logTokenInfo(this.code, 'Reset Password - Cleaned Code');
  
  // التحقق من صحة التوكين
  if (!TokenUtils.isValidToken(this.code)) {
    this.errorMessage = 'Invalid reset token format. Please request a new password reset link.';
    console.log('Reset Password - Invalid token format');
  } else {
    console.log('Reset Password - Token is valid, ready for reset');
  }
}
```

## 🎯 أنواع المشاكل وحلولها

### المشكلة 1: "Token is empty"
**السبب:** التوكين مفقود من URL
**الحل:** تحقق من رابط الإيميل

### المشكلة 2: "Token too short"
**السبب:** التوكين قصير جداً
**الحل:** تحقق من صحة الرابط

### المشكلة 3: "Token contains invalid values"
**السبب:** التوكين يحتوي على "undefined" أو "null"
**الحل:** تحقق من معالجة URL

### المشكلة 4: "Missing userId or code"
**السبب:** معاملات URL مفقودة
**الحل:** تحقق من رابط الإيميل

## 📝 معلومات مطلوبة للتشخيص

### من Console:
```javascript
// يجب أن ترى هذه الرسائل:
Reset Password - Query Params: {userId: "...", code: "..."}
Reset Password - Original Code Info: {length: 50, ...}
Reset Password - Cleaned Code Info: {length: 50, ...}
Reset Password - Token is valid, ready for reset
```

### من Network:
```javascript
// يجب أن ترى هذا الطلب:
POST /api/Accounts/reset-password
{
  "code": "abc123...",
  "newPassword": "newpass",
  "password": "newpass",
  "userId": "123"
}
```

## 🚀 الحلول السريعة

### الحل 1: تحقق من الرابط
```
https://localhost:4200/reset-password?userId=123&code=abc123...
```

### الحل 2: تحقق من معالجة URL
```typescript
// في المكون
this.code = TokenUtils.cleanAndDecodeToken(this.code);
```

### الحل 3: تحقق من إرسال البيانات
```typescript
// في AuthService
const requestBody = {
  code: token,
  newPassword: newPassword,
  password: newPassword
};
```

## 📞 معلومات إضافية مطلوبة

1. **ما هو الرابط الذي تستخدمه؟**
2. **ما هي الرسائل التي تراها في Console؟**
3. **هل هناك أخطاء في Network tab؟**
4. **ما هو الـ response من الباك إند؟**

## 🎉 النتيجة المتوقعة

بعد الإصلاح:
- ✅ استخراج صحيح للتوكين من URL
- ✅ تنظيف ومعالجة صحيحة للتوكين
- ✅ تحقق من صحة التوكين
- ✅ إرسال صحيح للباك إند
- ✅ رسائل تشخيص واضحة 