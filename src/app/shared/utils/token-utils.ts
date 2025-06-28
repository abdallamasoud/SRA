/**
 * Utility functions for handling authentication tokens
 */
export class TokenUtils {
  
  /**
   * تنظيف ومعالجة التوكين المستلم من URL
   */
  static cleanAndDecodeToken(token: string): string {
    if (!token) return '';

    let cleanedToken = token.trim();

    // إزالة أي رموز إضافية في البداية والنهاية
    cleanedToken = cleanedToken.replace(/^["']|["']$/g, '');

    // تحويل المسافات إلى +
    if (cleanedToken.includes(' ')) {
      cleanedToken = cleanedToken.replace(/ /g, '+');
    }

    // فك ترميز URL إذا كان مطلوباً
    try {
      const decodedToken = decodeURIComponent(cleanedToken);
      console.log('TokenUtils - URL decoded token successfully');
      return decodedToken;
    } catch (error) {
      console.log('TokenUtils - URL decode failed, using original token');
      return cleanedToken;
    }
  }

  /**
   * معالجة التوكين للباك إند
   */
  static processTokenForBackend(token: string): string {
    if (!token) return '';

    let processedToken = token.trim();

    // إزالة أي رموز إضافية
    processedToken = processedToken.replace(/^["']|["']$/g, '');

    // تحويل المسافات إلى +
    if (processedToken.includes(' ')) {
      processedToken = processedToken.replace(/ /g, '+');
    }

    // إذا كان التوكين يحتوي على رموز خاصة، قم بترميزها
    try {
      // محاولة فك ترميز URL أولاً
      const decodedToken = decodeURIComponent(processedToken);
      
      // ثم إعادة ترميزها بالشكل الصحيح للباك إند
      const encodedToken = encodeURIComponent(decodedToken);
      
      console.log('TokenUtils - Token processed successfully for backend');
      return encodedToken;
    } catch (error) {
      console.log('TokenUtils - Token processing failed, using original token');
      return processedToken;
    }
  }

  /**
   * التحقق من صحة التوكين
   */
  static isValidToken(token: string): boolean {
    if (!token || token.trim().length === 0) {
      console.log('TokenUtils - Token is empty');
      return false;
    }
    
    // التحقق من أن التوكين يحتوي على الحد الأدنى من الأحرف
    if (token.length < 5) {
      console.log('TokenUtils - Token too short:', token.length);
      return false;
    }
    
    // التحقق من أن التوكين لا يحتوي على رموز غير صحيحة
    if (token.includes('undefined') || token.includes('null')) {
      console.log('TokenUtils - Token contains invalid values');
      return false;
    }
    
    console.log('TokenUtils - Token is valid');
    return true;
  }

  /**
   * طباعة معلومات التوكين للتشخيص
   */
  static logTokenInfo(token: string, context: string = 'Token'): void {
    if (!token) {
      console.log(`${context}: Empty token`);
      return;
    }

    console.log(`${context} Info:`, {
      length: token.length,
      preview: token.substring(0, 50) + (token.length > 50 ? '...' : ''),
      containsSpaces: token.includes(' '),
      containsPlus: token.includes('+'),
      containsSpecialChars: /[^a-zA-Z0-9+/=]/.test(token),
      isUndefined: token === 'undefined',
      isNull: token === 'null'
    });
  }

  /**
   * معالجة التوكين من URL parameters
   */
  static extractTokenFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('code') || urlObj.searchParams.get('token') || '';
      return this.cleanAndDecodeToken(token);
    } catch (error) {
      console.log('TokenUtils - Failed to extract token from URL');
      return '';
    }
  }
} 