# اختبار إعادة تعيين كلمة المرور

## الخطوات للاختبار:

### 1. تشغيل التطبيق
```bash
npm start
```

### 2. اختبار إعادة تعيين كلمة المرور
1. اذهب إلى: `http://localhost:4200/forgot-password`
2. أدخل إيميل صحيح
3. اضغط "إرسال"
4. انتظر الإيميل
5. انقر على الرابط في الإيميل

### 3. مراقبة السجلات
افتح Developer Tools (F12) واذهب إلى Console لمراقبة:

#### سجلات النجاح المتوقعة:
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

### 4. النتائج المتوقعة:
- ✅ رسالة نجاح: "Password has been updated successfully"
- ✅ إعادة توجيه تلقائية لصفحة تسجيل الدخول بعد ثانيتين
- ✅ إعادة تعيين النموذج

### 5. إذا لم يعمل:
تحقق من:
- سجلات Console للأخطاء
- Network tab في Developer Tools
- رسالة الخطأ المعروضة للمستخدم

### 6. معلومات التشخيص:
إذا استمرت المشكلة، شارك:
- سجلات Console كاملة
- Network response من الباك إند
- رسالة الخطأ المعروضة 