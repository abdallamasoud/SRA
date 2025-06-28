import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

// ✅ تعريف interface للبيانات
export interface MilkCollection {
  id?: number;
  code: string;
  type: number;
  noFamily: string;
  milk: number;
  fatPercentage: number;
  weight: number;
  weightDate: string; // YYYY-MM-DD format
  statuForitification: number;
  dateFertilization: string; // ISO datetime format
  expectedDate: string; // ISO datetime format
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DairyService {
  private apiUrl = 'https://sra.runasp.net/api';
  private milkCollectionApi = `${this.apiUrl}/MilkCollections`;
  private dairies: MilkCollection[] = [];

  constructor(private http: HttpClient) {}

  // ✅ مساعدة لتنسيق التواريخ
  private formatDateForBackend(dateString: string | null | undefined): string {
    if (!dateString) {
      return new Date().toISOString();
    }
    
    // إذا كان التنسيق صحيح بالفعل
    if (dateString.includes('T') && dateString.includes('Z')) {
      return dateString;
    }
    
    // تحويل من YYYY-MM-DD إلى ISO
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      console.warn('Invalid date format, using current date:', dateString);
      return new Date().toISOString();
    }
  }

  // ✅ مساعدة لتحويل النوع إلى رقم
  private convertTypeToNumber(type: any): number {
    if (typeof type === 'number') return type;
    if (typeof type === 'string') {
      const lowerType = type.toLowerCase();
      if (lowerType === 'dairy' || lowerType === 'حلوب') return 1;
      if (lowerType === 'beef' || lowerType === 'لحم') return 2;
      if (lowerType === 'dual' || lowerType === 'مزدوج') return 3;
    }
    return 1; // افتراضي
  }

  // ✅ مساعدة لتحويل حالة التخصيب إلى رقم
  private convertFertilizationStatusToNumber(status: any): number {
    if (typeof status === 'number') return status;
    if (typeof status === 'string') {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus === 'pregnant' || lowerStatus === 'حامل') return 1;
      if (lowerStatus === 'not pregnant' || lowerStatus === 'غير حامل') return 0;
      if (lowerStatus === 'unknown' || lowerStatus === 'غير معروف') return 2;
    }
    return 0; // افتراضي
  }

  // ✅ مساعدة لتحويل النوع من رقم إلى اسم للعرض
  getTypeDisplayName(type: number): string {
    switch (type) {
      case 1: return 'Dairy';
      case 3: return 'Dry';
     
      default: return '';
    }
  }

  // ✅ مساعدة لتحويل حالة التخصيب من رقم إلى اسم للعرض
  getFertilizationStatusDisplayName(status: number): string {
    switch (status) {
      case 1: return ' Not Pregnant';
      case 0 : return 'Is Pregnant';
      default: return '';
    }
  }

  // ✅ جلب جميع بيانات إنتاج الحليب
  getDairies(): Observable<MilkCollection[]> {
    console.log('Fetching all milk collections from:', this.milkCollectionApi);
    return this.http.get<MilkCollection[]>(this.milkCollectionApi).pipe(
      map(data => {
        this.dairies = data; // حفظ البيانات للبحث
        return data;
      })
    );
  }

  // ✅ جلب بيانات محددة بالـ ID
  getDairyById(id: number): Observable<MilkCollection> {
    console.log('Fetching dairy by ID:', id);
    return this.http.get<MilkCollection>(`${this.milkCollectionApi}/${id}`);
  }

  // ✅ تسجيل إنتاج الحليب الجديد - تحديث بيانات الحيوان الموجود
  addDairy(dairyData: {
    code: string;
    milkProduction: number;
    fatPercentage: number;
  }): Observable<any> {
    // التحقق من صحة نسبة الدهون
    if (dairyData.fatPercentage < 0 || dairyData.fatPercentage > 10) {
      console.error('Invalid fat percentage:', dairyData.fatPercentage);
      throw new Error('نسبة الدهون يجب أن تكون بين 0 و 10%');
    }
    
    // البحث عن الحيوان الموجود أولاً
    console.log('=== DAIRY SERVICE DEBUG ===');
    console.log('Looking for existing animal with code:', dairyData.code);
    console.log('Available dairies:', this.dairies);
    
    // البحث في البيانات المحملة
    const existingAnimal = this.dairies.find(a => a.code.toLowerCase() === dairyData.code.toLowerCase());
    
    if (existingAnimal) {
      console.log('Found existing animal:', existingAnimal);
      
      // تحديث بيانات الحليب للحيوان الموجود بالشكل المطلوب للـ PUT
      const updatedAnimal = {
        id: existingAnimal.id,
        code: existingAnimal.code,
        type: this.convertTypeToNumber(existingAnimal.type), // تحويل النوع إلى رقم
        noFamily: existingAnimal.noFamily,
        milk: dairyData.milkProduction, // تحديث كمية الحليب
        fatPercentage: dairyData.fatPercentage, // تحديث نسبة الدهون
        weight: Number(existingAnimal.weight) || 0,
        weightDate: existingAnimal.weightDate,
        statuForitification: this.convertFertilizationStatusToNumber(existingAnimal.statuForitification), // تحويل الحالة إلى رقم
        dateFertilization: this.formatDateForBackend(existingAnimal.dateFertilization),
        expectedDate: this.formatDateForBackend(existingAnimal.expectedDate),
        description: existingAnimal.description
      };
      
      console.log('Updating animal with milk data:', updatedAnimal);
      console.log('API URL:', `${this.milkCollectionApi}/${existingAnimal.id}`);
      console.log('Request method: PUT');
      console.log('Request body:', JSON.stringify(updatedAnimal, null, 2));
      console.log('Request headers:', { 'Content-Type': 'application/json' });
      console.log('=== FINAL DATA STRUCTURE ===');
      console.log('id:', typeof updatedAnimal.id, updatedAnimal.id);
      console.log('code:', typeof updatedAnimal.code, updatedAnimal.code);
      console.log('type:', typeof updatedAnimal.type, updatedAnimal.type, '(converted from:', existingAnimal.type, ')');
      console.log('noFamily:', typeof updatedAnimal.noFamily, updatedAnimal.noFamily);
      console.log('milk:', typeof updatedAnimal.milk, updatedAnimal.milk);
      console.log('fatPercentage:', typeof updatedAnimal.fatPercentage, updatedAnimal.fatPercentage);
      console.log('weight:', typeof updatedAnimal.weight, updatedAnimal.weight);
      console.log('weightDate:', typeof updatedAnimal.weightDate, updatedAnimal.weightDate);
      console.log('statuForitification:', typeof updatedAnimal.statuForitification, updatedAnimal.statuForitification, '(converted from:', existingAnimal.statuForitification, ')');
      console.log('dateFertilization:', typeof updatedAnimal.dateFertilization, updatedAnimal.dateFertilization);
      console.log('expectedDate:', typeof updatedAnimal.expectedDate, updatedAnimal.expectedDate);
      console.log('description:', typeof updatedAnimal.description, updatedAnimal.description);
      console.log('========================');
      
      return this.http.put(`${this.milkCollectionApi}/${existingAnimal.id}`, updatedAnimal, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        map(response => {
          console.log('=== PUT SUCCESS ===');
          console.log('Response received:', response);
          console.log('Response type:', typeof response);
          return response;
        }),
        catchError(error => {
          console.error('Error during PUT request:', error);
          throw error;
        })
      );
    } else {
      console.log('Animal not found in loaded data, searching API...');
      console.log('Available dairies codes:', this.dairies.map(d => d.code));
      
      // البحث في الـ API
      return this.http.get<MilkCollection[]>(this.milkCollectionApi).pipe(
        map(allDairies => {
          const apiAnimal = allDairies.find(a => a.code.toLowerCase() === dairyData.code.toLowerCase());
          if (apiAnimal) {
            console.log('Found animal via API:', apiAnimal);
            
            const updatedAnimal = {
              id: apiAnimal.id,
              code: apiAnimal.code,
              type: this.convertTypeToNumber(apiAnimal.type),
              noFamily: apiAnimal.noFamily,
              milk: dairyData.milkProduction,
              fatPercentage: dairyData.fatPercentage,
              weight: Number(apiAnimal.weight) || 0,
              weightDate: apiAnimal.weightDate,
              statuForitification: this.convertFertilizationStatusToNumber(apiAnimal.statuForitification),
              dateFertilization: this.formatDateForBackend(apiAnimal.dateFertilization),
              expectedDate: this.formatDateForBackend(apiAnimal.expectedDate),
              description: apiAnimal.description
            };
            
            console.log('Updating animal via API with milk data:', updatedAnimal);
            console.log('API URL:', `${this.milkCollectionApi}/${apiAnimal.id}`);
            console.log('Request method: PUT (via API search)');
            console.log('Request body:', JSON.stringify(updatedAnimal, null, 2));
            console.log('========================');
            
            return this.http.put(`${this.milkCollectionApi}/${apiAnimal.id}`, updatedAnimal, {
              headers: { 'Content-Type': 'application/json' }
            }).pipe(
              map(response => {
                console.log('=== PUT SUCCESS (via API search) ===');
                console.log('Response received:', response);
                console.log('Response type:', typeof response);
                return response;
              }),
              catchError(error => {
                console.error('Error during PUT request:', error);
                throw error;
              })
            );
          } else {
            console.log('Animal not found anywhere, creating new record with PATCH');
            // إذا لم يجد الحيوان، استخدم PATCH لإنشاء سجل جديد
            const requestData = {
              code: dairyData.code,
              type: 1,
              noFamily: '',
              milk: dairyData.milkProduction,
              fatPercentage: dairyData.fatPercentage,
              weight: 0,
              weightDate: new Date().toISOString().split('T')[0],
              statuForitification: 0,
              dateFertilization: '',
              expectedDate: '',
              description: ''
            };
            
            console.log('Creating new record with PATCH:', requestData);
            return this.http.patch(this.milkCollectionApi, requestData);
          }
        }),
        mergeMap(result => result)
      );
    }
  }

  // ✅ تحديث بيانات إنتاج الحليب (PUT)
  updateDairy(id: number, dairyData: MilkCollection): Observable<any> {
    console.log('=== UPDATE DAIRY DEBUG ===');
    console.log('Updating dairy with PUT, ID:', id);
    console.log('Update data:', dairyData);
    
    // تأكد من أن البيانات بالشكل الصحيح للـ PUT
    const putData = {
      id: dairyData.id,
      code: dairyData.code,
      type: this.convertTypeToNumber(dairyData.type), // تحويل النوع إلى رقم
      noFamily: dairyData.noFamily,
      milk: Number(dairyData.milk) || 0,
      fatPercentage: Number(dairyData.fatPercentage) || 0,
      weight: Number(dairyData.weight) || 0,
      weightDate: dairyData.weightDate,
      statuForitification: this.convertFertilizationStatusToNumber(dairyData.statuForitification), // تحويل الحالة إلى رقم
      dateFertilization: this.formatDateForBackend(dairyData.dateFertilization),
      expectedDate: this.formatDateForBackend(dairyData.expectedDate),
      description: dairyData.description
    };
    
    console.log('Formatted PUT data:', putData);
    console.log('API URL:', `${this.milkCollectionApi}/${id}`);
    console.log('Request method: PUT');
    console.log('Request body:', JSON.stringify(putData, null, 2));
    console.log('Request headers:', { 'Content-Type': 'application/json' });
    console.log('========================');
    
    return this.http.put(`${this.milkCollectionApi}/${id}`, putData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => {
        console.log('=== PUT SUCCESS (Update Dairy) ===');
        console.log('Response received:', response);
        console.log('Response type:', typeof response);
        return response;
      }),
      catchError(error => {
        console.error('Error during PUT request (Update Dairy):', error);
        throw error;
      })
    );
  }

  // ✅ حذف بيانات إنتاج الحليب
  deleteDairy(id: number): Observable<void> {
    console.log('=== DELETE DAIRY DEBUG ===');
    console.log('Deleting dairy with ID:', id);
    console.log('API URL:', `${this.apiUrl}/Animal/${id}`);
    console.log('Request method: DELETE');
    console.log('========================');
    
    return this.http.delete<void>(`${this.apiUrl}/Animal/${id}`).pipe(
      map(response => {
        console.log('=== DELETE SUCCESS ===');
        console.log('Response received:', response);
        console.log('Response type:', typeof response);
        return response;
      }),
      catchError(error => {
        console.error('=== DELETE FAILED ===');
        console.error('Error during DELETE request:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error url:', error.url);
        throw error;
      })
    );
  }
}
