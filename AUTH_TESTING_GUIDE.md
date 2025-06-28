# دليل اختبار وظائف المصادقة

## 1. اختبار "نسيت كلمة المرور" (Forgot Password)

### الخطوات:
1. اذهب إلى: `http://localhost:4200/forgot-password`
2. أدخل إيميل (موجود أو غير موجود)
3. اضغط "إرسال"

### السجلات المتوقعة في Console:
```
Sending forgot password request: {email: "test@example.com"}
AuthService - Forgot Password Request: {email: "test@example.com"}
AuthService - Forgot Password Success: [response from backend]
Forgot password success: {success: true, message: "If the email is found in our database, a password reset link will be sent."}
```

### النتائج المتوقعة:
- ✅ رسالة نجاح: "If the email is found in our database, a password reset link will be sent."
- ✅ إعادة تعيين النموذج
- ✅ نفس الرسالة سواء كان الإيميل موجود أم لا (لأسباب أمنية)

### 🛡️ ملاحظة أمنية:
النظام يعرض نفس الرسالة بغض النظر عن وجود الإيميل لمنع هجمات Enumeration وحماية خصوصية المستخدمين.

---

## 2. اختبار إعادة تعيين كلمة المرور (Reset Password)

### الخطوات:
1. انقر على الرابط في الإيميل المستلم
2. أدخل كلمة مرور جديدة (6 أحرف على الأقل)
3. أكد كلمة المرور
4. اضغط "إعادة تعيين كلمة المرور"

### السجلات المتوقعة في Console:
```
Reset Password - Query Params: {userId: "...", code: "..."}
Reset Password - Original Code Info: {length: 123, preview: "...", ...}
Reset Password - Cleaned Code Info: {length: 123, preview: "...", ...}
AuthService - Original Token Info: {length: 123, preview: "...", ...}
AuthService - Processed Token Info: {length: 123, preview: "...", ...}
Sending reset password request: {userId: "...", codeLength: 123, passwordLength: 8}
AuthService - Reset Password Success: Password has been updated successfully
Reset password success: {success: true, message: "Password has been updated successfully"}
```

### النتائج المتوقعة:
- ✅ رسالة نجاح: "Password has been updated successfully"
- ✅ إعادة توجيه تلقائية لصفحة تسجيل الدخول بعد ثانيتين
- ✅ إعادة تعيين النموذج

---

## 3. اختبار تسجيل الدخول (Login)

### الخطوات:
1. اذهب إلى: `http://localhost:4200/login`
2. أدخل الإيميل وكلمة المرور الجديدة
3. اضغط "تسجيل الدخول"

### النتائج المتوقعة:
- ✅ تسجيل دخول ناجح
- ✅ إعادة توجيه للوحة التحكم

---

## 4. تشخيص المشاكل

### إذا لم يعمل "نسيت كلمة المرور":
تحقق من:
- سجلات Console للأخطاء
- Network tab في Developer Tools
- رسالة الخطأ المعروضة

### إذا لم يعمل إعادة تعيين كلمة المرور:
تحقق من:
- صحة التوكين في الرابط
- سجلات Console لمعالجة التوكين
- Network response من الباك إند

### رسائل الخطأ الشائعة:
- `Cannot connect to server` → مشكلة في الاتصال
- `Failed to process your request` → مشكلة عامة في الخادم
- `Invalid reset token` → مشكلة في التوكين

### 🛡️ رسائل النجاح (لأسباب أمنية):
- `If the email is found in our database, a password reset link will be sent.` → رسالة نجاح عامة
- `Password has been updated successfully` → نجاح إعادة تعيين كلمة المرور

---

## 5. معلومات التشخيص المطلوبة

إذا استمرت المشكلة، شارك:
- سجلات Console كاملة
- Network responses من الباك إند
- رسائل الخطأ المعروضة
- شكل التوكين في الرابط (أول 50 حرف)

---

## 6. اختبار سريع للتوكين

يمكنك اختبار التوكين يدوياً في Console:
```javascript
// انسخ التوكين من الرابط والصقه هنا
const token = "your-token-here";
console.log('Token length:', token.length);
console.log('Token preview:', token.substring(0, 50));
console.log('Decoded token:', decodeURIComponent(token));
```

---

## 7. اختبار الأمان

### اختبار Enumeration Protection:
1. أدخل إيميل موجود → رسالة نجاح عامة
2. أدخل إيميل غير موجود → نفس رسالة النجاح
3. أدخل إيميل بسيط → نفس رسالة النجاح

### النتيجة المتوقعة:
جميع الحالات تعرض نفس الرسالة: "If the email is found in our database, a password reset link will be sent."

هذا يضمن عدم كشف معلومات عن المستخدمين المسجلين في النظام. 