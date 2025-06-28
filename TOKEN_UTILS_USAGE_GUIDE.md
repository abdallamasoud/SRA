# دليل استخدام TokenUtils في معالجة التوكين

## نظرة عامة
تم استخدام `TokenUtils` في جميع أنحاء التطبيق لمعالجة التوكين القادم من الباك إند بشكل آمن ومتسق.

## الاستيراد
```typescript
import { TokenUtils } from '../shared/utils/token-utils';
```

## الاستخدام في AuthService

### 1. Login Method
```typescript
map(response => {
  console.log('AuthService - Login Success:', response);
  
  // استخدام TokenUtils لمعالجة التوكين القادم من الباك إند
  TokenUtils.logTokenInfo(response.token, 'AuthService - Login Token from Backend');
  
  const user: User = {
    email: response.email,
    token: response.token,
    roles: response.roles
  };
  
  localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  return user;
})
```

### 2. Register Method
```typescript
map(response => {
  console.log('AuthService - Register Success:', response);
  
  // استخدام TokenUtils لمعالجة التوكين القادم من الباك إند
  TokenUtils.logTokenInfo(response.token, 'AuthService - Register Token from Backend');
  
  const newUser: User = {
    email: response.email,
    token: response.token,
    roles: response.roles
  };
  
  localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
  return newUser;
})
```

### 3. Reset Password Method
```typescript
resetPassword(token: string, newPassword: string, userId?: string): Observable<any> {
  // استخدام TokenUtils لمعالجة التوكين
  TokenUtils.logTokenInfo(token, 'AuthService - Original Token');
  
  // تنظيف ومعالجة التوكين للباك إند
  const processedToken = TokenUtils.processTokenForBackend(token);
  TokenUtils.logTokenInfo(processedToken, 'AuthService - Processed Token');
  
  // التحقق من صحة التوكين
  if (!TokenUtils.isValidToken(processedToken)) {
    console.error('AuthService - Invalid token format');
    return throwError(() => new Error('Invalid token'));
  }
  
  const requestBody: any = {
    code: processedToken,  // استخدام التوكين المعالج
    newPassword: newPassword,
    password: newPassword
  };
  
  // ... باقي الكود
}
```

### 4. Get Token Method
```typescript
getToken(): string | null {
  const user = this.getCurrentUser();
  if (!user?.token) {
    return null;
  }
  
  // استخدام TokenUtils لمعالجة التوكين من localStorage
  TokenUtils.logTokenInfo(user.token, 'AuthService - Token from localStorage');
  
  // تنظيف ومعالجة التوكين للاستخدام
  const processedToken = TokenUtils.processTokenForFrontend(user.token);
  TokenUtils.logTokenInfo(processedToken, 'AuthService - Processed Token for Frontend');
  
  // التحقق من صحة التوكين
  if (!TokenUtils.isValidToken(processedToken)) {
    console.error('AuthService - Invalid token in localStorage, logging out');
    this.logout();
    return null;
  }
  
  return processedToken;
}
```

## الوظائف المستخدمة من TokenUtils

### 1. logTokenInfo(token, context)
- **الغرض**: تسجيل معلومات التوكين للتشخيص
- **الاستخدام**: في جميع العمليات لمراقبة حالة التوكين

### 2. processTokenForBackend(token)
- **الغرض**: معالجة التوكين لإرساله للباك إند
- **الاستخدام**: في resetPassword لإرسال التوكين بالشكل الصحيح

### 3. processTokenForFrontend(token)
- **الغرض**: معالجة التوكين للاستخدام في الفرونت إند
- **الاستخدام**: في getToken لاستخراج التوكين من localStorage

### 4. isValidToken(token)
- **الغرض**: التحقق من صحة التوكين
- **الاستخدام**: في resetPassword و getToken للتحقق من صحة التوكين

## فوائد استخدام TokenUtils

### 1. الاتساق
- معالجة موحدة للتوكين في جميع أنحاء التطبيق
- تنسيق ثابت للرسائل والخطأ

### 2. الأمان
- التحقق من صحة التوكين قبل الاستخدام
- تنظيف التوكين من الأحرف غير المرغوب فيها

### 3. التشخيص
- تسجيل مفصل لجميع عمليات التوكين
- سهولة تتبع المشاكل

### 4. الصيانة
- كود مركزي لمعالجة التوكين
- سهولة التحديث والتعديل

## أمثلة على الاستخدام

### معالجة التوكين من URL
```typescript
// في reset-password component
const token = this.route.snapshot.queryParams['token'];
TokenUtils.logTokenInfo(token, 'Reset Password - Token from URL');
const processedToken = TokenUtils.processTokenForBackend(token);
```

### معالجة التوكين من localStorage
```typescript
// في أي component يحتاج للتوكين
const token = this.authService.getToken();
if (token) {
  TokenUtils.logTokenInfo(token, 'Component - Using token');
}
```

### التحقق من صحة التوكين
```typescript
// قبل إرسال طلب للباك إند
if (!TokenUtils.isValidToken(token)) {
  console.error('Invalid token, cannot proceed');
  return;
}
```

## نصائح للاستخدام

1. **استخدم logTokenInfo دائماً**: لتسهيل التشخيص
2. **تحقق من صحة التوكين**: قبل كل عملية
3. **استخدم processTokenForBackend**: عند إرسال التوكين للباك إند
4. **استخدم processTokenForFrontend**: عند استخراج التوكين من localStorage
5. **تعامل مع الأخطاء**: عند فشل معالجة التوكين

## استكشاف الأخطاء

### مشاكل شائعة:
1. **توكين فارغ**: تحقق من وجود التوكين قبل المعالجة
2. **توكين غير صالح**: استخدم isValidToken للتحقق
3. **تنسيق خاطئ**: استخدم processTokenForBackend للتنظيف
4. **مشاكل في التشفير**: تحقق من تنسيق Base64

### رسائل التشخيص:
- `TokenUtils - Original Token`: التوكين الأصلي
- `TokenUtils - Processed Token`: التوكين بعد المعالجة
- `TokenUtils - Token validation`: نتيجة التحقق من الصحة 