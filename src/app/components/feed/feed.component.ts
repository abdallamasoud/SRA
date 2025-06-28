import { Component, OnInit } from '@angular/core';
import { FeedService, Ingredient } from 'src/app/services/feed.service';

// Define the Feed interface based on the HTML structure and image
export interface Feed {
  id?: number;
  count: number;
  feedName: string;
  category?: string;
  proteinPercentage: number;
  tdnPercentage: number;
  type?: string;
  ingredients?: string;
  price?: number;
  items?: { type: number; ingredients: string; price: number }[];
}

export interface Vaccine {
  name: string;
  type: string;
  dose: number;
  timeToTake: string;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  feeds: Feed[] = []; // Original full list of feeds
  filteredFeeds: Feed[] = []; // List of feeds after applying search and filter
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  activeFilterType: string = 'all';
  isFilterDropdownOpen: boolean = false;

  // Modal control properties
  showMakeNewFeedModal: boolean = false;
  showEditExistFeedModal: boolean = false;
  showDeleteFeedModal: boolean = false;
  selectedFeed: Feed = this.initializeFeed();
  selectedItems: { type: number; ingredients: string; price: number }[] = [];
  isFeedDataLoaded: boolean = false;

  // Vaccine modal properties
  showAddNewVaccineModal: boolean = false;
  selectedVaccine: Vaccine = {
    name: '',
    type: '',
    dose: 0,
    timeToTake: ''
  };

  categories: { id: number; name: string }[] = [];
  typeNames = ['حبوب', 'كسب', 'نخالة'];
  types: { value: number; label: string }[] = [];
  selectedType: number | null = null;
  ingredients: { id: number; name: string; type?: string }[] = [];

  // لتخزين الـ id الذي سيتم حذفه
  feedIdToDelete: number | null = null;

  selectedFeedIds: number[] = [];

  searchFeedName: string = '';

  public showFeedDetailsModal: boolean = false;
  public feedDetails: any = null;

  constructor(public feedService: FeedService) { }

  ngOnInit(): void {
    this.loadFeeds();
    this.loadCategories();
    this.loadIngredients();
  }

  initializeFeed(): Feed {
    return {
      feedName: '',
      category: '',
      proteinPercentage: 0,
      tdnPercentage: 0,
      count: 0,
      type: '',
      ingredients: '',
      price: 0,
    };
  }

  loadFeeds(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.feedService.getFeeds().subscribe({
      next: (data: any) => {
        // mapping للخصائص حسب الجدول
        this.feeds = data.map((item: any) => ({
          id: item.id,
          feedName: item.name,
          category: item.animalCatgeory,
          count: item.quntity,
          proteinPercentage: item.totalProten,
          tdnPercentage: item.totalTDN,
          items: item.items // تأكد من جلب المكونات من الـ backend
        }));
        this.filteredFeeds = [...this.feeds];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'فشل في تحميل الأعلاف من السيرفر';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    // Replace with API call if needed
    this.categories = [
      { id: 2, name: 'تسمين 100 ل 250' },
      { id: 3, name: 'تسمين 250 ل 450' },
      { id: 4, name: 'حلاب اقل من 6' },
      { id: 5, name: 'حلاب من 6 ل 10' },
      { id: 6, name: 'حلاب اعلي من 10' },
      { id: 7, name: 'مواليد' }
    ];
  }

  loadIngredients(): void {
    this.feedService.getIngredients().subscribe({
      next: (data: any) => {
        this.ingredients = data;
        // استخرج الأنواع الفريدة كأرقام
        const typeNumbers = Array.from(new Set(data.map((ing: any) => Number(ing.type))));
        // حول الأرقام لأسماء مفهومة
        this.types = typeNumbers
          .filter((num: any) => !isNaN(num) && this.typeNames[num])
          .map((num: any) => ({
            value: num,
            label: this.typeNames[num]
          }));
      },
      error: (err: any) => {
        this.ingredients = [];
        this.types = [];
        this.errorMessage = 'Failed to load ingredients';
      }
    });
  }

  // --- Modal Functions ---
  openMakeNewFeedModal(): void {
    this.selectedFeed = this.initializeFeed();
    this.selectedItems = [];
    this.showMakeNewFeedModal = true;
  }

  openEditExistFeedModal(): void {
    this.selectedFeed = this.initializeFeed(); // Clear previous data
    this.selectedItems = [];
    this.isFeedDataLoaded = false;
    this.showEditExistFeedModal = true;
    this.searchFeedName = '';
  }

  openDeleteFeedModal(feedId?: number): void {
    if (feedId) {
      this.selectedFeedIds = [feedId];
    }
    this.showDeleteFeedModal = true;
  }

  openAddNewVaccineModal(): void {
    this.showAddNewVaccineModal = true;
  }

  closeAllModals(): void {
    this.showMakeNewFeedModal = false;
    this.showEditExistFeedModal = false;
    this.showDeleteFeedModal = false;
    this.showAddNewVaccineModal = false;
    this.selectedFeed = this.initializeFeed();
    this.selectedItems = []; // Clear selected items on modal close
    this.isFeedDataLoaded = false; // Reset data loaded flag
    this.selectedVaccine = {
      name: '',
      type: '',
      dose: 0,
      timeToTake: ''
    };
  }

  // --- Submission Functions ---
  submitNewFeed(): void {
    // تحقق من وجود مكون واحد على الأقل من كل نوع
    const typesNeeded = [0, 1, 2]; // 0: حبوب، 1: كسب، 2: نخالة
    const typesInItems = this.selectedItems.map(item => Number(item.type));
    const missingTypes = typesNeeded.filter(type => !typesInItems.includes(type));
    const typeLabels = ['حبوب', 'كسب', 'نخالة'];
    if (missingTypes.length > 0) {
      const missingLabels = missingTypes.map(t => typeLabels[t]).join('، ');
      alert('يجب إضافة مكون واحد على الأقل من الأنواع التالية: ' + missingLabels);
      return;
    }

    // بناء ingredientPrice: كل عنصر يجب أن يحتوي على id وسعر
    const ingredientPrice = this.selectedItems
      .map(item => {
        const ingredientObj = this.ingredients.find(ing => ing.name === item.ingredients);
        if (ingredientObj && typeof ingredientObj.id === 'number') {
          return {
            id: ingredientObj.id,
            price: item.price
          };
        }
        return null;
      })
      .filter((ip): ip is { id: number; price: number } => ip !== null);

    const payload = {
      name: this.selectedFeed.feedName,
      animalCatgeoryId: this.selectedFeed.category,
      quntity: this.selectedFeed.count,
      ingredientPrice
    };

    this.feedService.createFeed(payload).subscribe({
      next: () => {
        this.loadFeeds();
        this.closeAllModals();
        alert('تم إضافة العلف بنجاح!');
      },
      error: () => {
        alert('حدث خطأ أثناء إضافة العلف!');
      }
    });
  }

  submitUpdateFeed(): void {
    // عند التحديث، تأكد أن type يتم تحويله إلى number
    const index = this.feeds.findIndex(f => f.id === this.selectedFeed.id);
    if (index !== -1) {
      this.feeds[index] = {
        ...this.selectedFeed,
        items: this.selectedItems.map(item => ({
          ...item,
          type: Number(item.type)
        }))
      };
    }
    this.closeAllModals();
    this.loadFeeds(); // Refresh data
  }

  showDataForFeed(): void {
    if (!this.selectedFeed.feedName) {
      this.isFeedDataLoaded = false;
      this.selectedItems = [];
      return;
    }

    const foundFeed = this.feeds.find(f => f.feedName.toLowerCase() === this.selectedFeed.feedName.toLowerCase());
    if (foundFeed) {
      this.selectedFeed = { ...foundFeed };
      // تأكد أن type يتم تحويله إلى number عند القراءة
      this.selectedItems = (foundFeed.items || []).map(item => ({
        ...item,
        type: Number(item.type)
      }));
      this.isFeedDataLoaded = true;
    } else {
      alert('Feed not found with this name.');
      this.selectedFeed = this.initializeFeed();
      this.selectedItems = [];
      this.isFeedDataLoaded = false;
    }
  }

  confirmDeleteFeed(): void {
    if (this.selectedFeedIds.length === 0) {
      alert('اختر علفًا أو أكثر للحذف.');
      this.closeAllModals();
      return;
    }
    const deletes = this.selectedFeedIds.map(id => this.feedService.deleteFeed(id));
    // استخدم forkJoin لحذف الكل دفعة واحدة
    import('rxjs').then(rxjs => {
      rxjs.forkJoin(deletes).subscribe({
        next: () => {
          this.loadFeeds();
          this.selectedFeedIds = [];
          this.closeAllModals();
          alert('تم حذف الأعلاف بنجاح!');
        },
        error: () => {
          alert('حدث خطأ أثناء حذف الأعلاف!');
          this.closeAllModals();
        }
      });
    });
  }

  submitNewVaccine(): void {
    console.log('Submitting new vaccine:', this.selectedVaccine);
    // Implement actual add vaccine logic here
    this.closeAllModals();
  }

  addSelectedItem(): void {
    console.log('selectedType:', this.selectedType, 'ingredients:', this.selectedFeed.ingredients, 'price:', this.selectedFeed.price);
    if (
      this.selectedType !== null &&
      this.selectedFeed.ingredients &&
      this.selectedFeed.price !== undefined &&
      this.selectedFeed.price !== null
    ) {
      this.selectedItems.push({
        type: this.selectedType, // رقم النوع
        ingredients: this.selectedFeed.ingredients,
        price: this.selectedFeed.price
      });
      // إعادة تعيين القيم بعد الإضافة
      this.selectedType = null;
      this.selectedFeed.ingredients = '';
      this.selectedFeed.price = 0;
    } else {
      alert('يرجى اختيار النوع والمكون وإدخال السعر');
    }
  }

  removeItem(item: { type: number; ingredients: string }): void {
    this.selectedItems = this.selectedItems.filter(i =>
      i.type !== item.type || i.ingredients !== item.ingredients
    );
  }


  // --- Search and Filter Functions ---
  performSearch(): void {
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      this.filteredFeeds = this.feeds.filter(feed =>
        feed.feedName.toLowerCase().includes(search) ||
        (feed.category && feed.category.toLowerCase().includes(search))
      );
    } else {
      this.filteredFeeds = [...this.feeds];
    }
    this.applyFilter(this.activeFilterType); // Apply current filter after search
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(filterType: string): void {
    this.activeFilterType = filterType;
    let tempFiltered = [...this.feeds];

    // Apply search filter first
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      tempFiltered = tempFiltered.filter(feed =>
        feed.feedName.toLowerCase().includes(search) ||
        (feed.category && feed.category.toLowerCase().includes(search))
      );
    }

    // Apply specific filter
    if (filterType === 'feedName') {
      tempFiltered = tempFiltered.filter(feed => feed.feedName && feed.feedName !== '');
    } else if (filterType === 'category') {
      tempFiltered = tempFiltered.filter(feed => feed.category && feed.category !== '');
    } else {
      // If no specific filter, or an unrecognized filter, revert to original feeds (or just search results)
      if (!this.searchTerm) {
        tempFiltered = [...this.feeds];
      }
    }

    this.filteredFeeds = tempFiltered;
  }

  get filteredIngredients() {
    if (this.selectedType === null || this.selectedType === undefined) return this.ingredients;
    return this.ingredients.filter(ing => Number(ing.type) === this.selectedType);
  }

  // تعديل toggle لاختيار كل الأعلاف
  toggleAllFeedSelections(event: any): void {
    if (event.target.checked) {
      this.selectedFeedIds = this.filteredFeeds.map(feed => feed.id!);
    } else {
      this.selectedFeedIds = [];
    }
  }

  toggleFeedSelection(feedId: number): void {
    if (this.selectedFeedIds.includes(feedId)) {
      this.selectedFeedIds = this.selectedFeedIds.filter(id => id !== feedId);
    } else {
      this.selectedFeedIds.push(feedId);
    }
  }

  getIngredientIdByName(name: string): number | string {
    const found = this.ingredients.find(ing => ing.name === name);
    return found && typeof found.id === 'number' ? found.id : '-';
  }

  searchAndEditFeed(): void {
    this.openEditExistFeedModal();
  }

  searchFeedByName(): void {
    const foundFeed = this.feeds.find(f =>
      f.feedName.toLowerCase() === this.searchFeedName.trim().toLowerCase()
    );
    if (foundFeed && foundFeed.id) {
      // جلب بيانات العلف كاملة من الباك اند
      this.feedService.getFeedById(foundFeed.id).subscribe({
        next: (data: any) => {
          this.selectedFeed = {
            id: data.id,
            feedName: data.name,
            category: data.animalCatgeory,
            count: data.quntity,
            proteinPercentage: data.totalProten,
            tdnPercentage: data.totalTDN
          };
          // جلب المكونات مع النوع والسعر
          this.selectedItems = (data.items || []).map((item: any) => ({
            type: Number(item.type),
            ingredients: item.ingredientName || item.ingredients || '',
            price: item.price
          }));
          this.isFeedDataLoaded = true;
        },
        error: () => {
          alert('حدث خطأ أثناء جلب بيانات العلف من السيرفر');
          this.selectedFeed = this.initializeFeed();
          this.selectedItems = [];
          this.isFeedDataLoaded = false;
        }
      });
    } else {
      alert('Feed not found with this name.');
      this.selectedFeed = this.initializeFeed();
      this.selectedItems = [];
      this.isFeedDataLoaded = false;
    }
  }

  getCategoryName(categoryId: number | string): string {
    const cat = this.categories.find(c => c.id == categoryId);
    return cat ? cat.name : '';
  }

  public openFeedDetailsModal(id?: number): void {
    if (typeof id !== 'number') return;
    this.feedService.getFeedById(id).subscribe({
      next: (data: any) => {
        this.feedDetails = data;
        this.showFeedDetailsModal = true;
      },
      error: () => {
        alert('حدث خطأ أثناء جلب تفاصيل العلف من السيرفر');
      }
    });
  }

  public closeFeedDetailsModal(): void {
    this.showFeedDetailsModal = false;
    this.feedDetails = null;
  }
}
