# اختبار رسالة "Not found"

## الوظيفة المطلوبة:
عندما الإيميل غير موجود في قاعدة البيانات، تظهر رسالة "Not found" باللون الأحمر.

## السيناريوهات:

### 1. ✅ الإيميل موجود في قاعدة البيانات

#### النتيجة:
- رسالة نجاح: "Password reset instructions have been sent to your email."
- لون أخضر أو أزرق (حسب التصميم)
- إرسال إيميل إعادة تعيين كلمة المرور

### 2. ❌ الإيميل غير موجود في قاعدة البيانات

#### النتيجة:
- رسالة خطأ: "Not found"
- لون أحمر
- عدم إرسال أي إيميل

## كيفية الاختبار:

### الخطوات:
1. شغل التطبيق: `npm start`
2. اذهب إلى: `http://localhost:4200/forgot-password`
3. أدخل إيميل غير مسجل في النظام
4. اضغط "إرسال"

### النتيجة المتوقعة:
```
Not found
```
- باللون الأحمر
- في صندوق أحمر فاتح
- محاذاة في الوسط

## CSS المستخدم:
```css
.main-error {
  margin: 15px 0;
  padding: 10px;
  background-color: rgba(255, 82, 82, 0.1); /* خلفية حمراء فاتحة */
  border-radius: 4px;
  text-align: center;
}

.error-message {
  color: #ff5252; /* لون أحمر */
  font-size: 12px;
  margin-top: 5px;
}
```

## السجلات في Console:
```
Sending forgot password request: {email: "nonexistent@example.com"}
AuthService - Forgot Password Request: {email: "nonexistent@example.com"}
AuthService - Forgot password error: [Error details]
Forgot password error: [Error details]
```

## ملاحظات:
- ✅ رسالة "Not found" بسيطة وواضحة
- ✅ لون أحمر للخطأ
- ✅ خلفية حمراء فاتحة
- ✅ محاذاة في الوسط
- ✅ عدم إرسال أي إيميل 