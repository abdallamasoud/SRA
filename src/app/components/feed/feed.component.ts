import { Component, OnInit } from '@angular/core';

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
  items?: { type: string; ingredients: string; price: number }[];
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
  selectedItems: { type: string; ingredients: string; price: number }[] = [];
  isFeedDataLoaded: boolean = false;

  // Vaccine modal properties
  showAddNewVaccineModal: boolean = false;
  selectedVaccine: Vaccine = {
    name: '',
    type: '',
    dose: 0,
    timeToTake: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.loadFeeds();
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

    // Mock data for demonstration purposes
    this.feeds = [
      {
        id: 1,
        count: 1,
        feedName: 'a',
        category: 'category1',
        proteinPercentage: 22,
        tdnPercentage: 22,
        type: 'Pellets',
        ingredients: 'Corn, Soybean Meal',
        price: 1.05,
        items: [
          { type: 'Corn', ingredients: 'Corn, Soybean Meal', price: 1.05 }
        ]
      },
      {
        id: 2,
        count: 2,
        feedName: 'Dairy Feed B',
        category: 'category2',
        proteinPercentage: 18,
        tdnPercentage: 18,
        type: 'Mash',
        ingredients: 'Soybean Meal, Alfalfa',
        price: 0.95,
        items: [
          { type: 'Soybean', ingredients: 'Soybean Meal, Alfalfa', price: 0.95 }
        ]
      },
      {
        id: 3,
        count: 3,
        feedName: 'Fattening Feed C',
        category: 'category3',
        proteinPercentage: 25,
        tdnPercentage: 25,
        type: 'Crumble',
        ingredients: 'Wheat, Barley',
        price: 1.15,
        items: [
          { type: 'Wheat', ingredients: 'Wheat, Barley', price: 1.15 }
        ]
      }
    ];
    this.filteredFeeds = [...this.feeds];
    this.isLoading = false;

    // TODO: Integrate with actual Feed service/API calls
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
  }

  openDeleteFeedModal(): void {
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
    console.log('Submitting new feed:', this.selectedFeed);
    // Implement actual add feed logic here
    // For now, let's just add the selected items to the feed and then to the feeds array
    const newFeed: Feed = {
      ...this.selectedFeed,
      id: this.feeds.length + 1, // Simple ID assignment for mock data
      items: [...this.selectedItems] // Assign selected items to the new feed
    };
    this.feeds.push(newFeed);
    this.loadFeeds(); // Refresh data
    this.closeAllModals();
    alert('New Feed Added Successfully!');
  }

  submitUpdateFeed(): void {
    console.log('Submitting updated feed:', this.selectedFeed);
    // Implement actual update feed logic here
    const index = this.feeds.findIndex(f => f.id === this.selectedFeed.id);
    if (index !== -1) {
      this.feeds[index] = { ...this.selectedFeed, items: [...this.selectedItems] };
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

    console.log('Showing data for feed with name:', this.selectedFeed.feedName);
    const foundFeed = this.feeds.find(f => f.feedName.toLowerCase() === this.selectedFeed.feedName.toLowerCase());
    if (foundFeed) {
      this.selectedFeed = { ...foundFeed };
      this.selectedItems = foundFeed.items || [];
      this.isFeedDataLoaded = true;
    } else {
      alert('Feed not found with this name.');
      this.selectedFeed = this.initializeFeed();
      this.selectedItems = [];
      this.isFeedDataLoaded = false;
    }
  }

  confirmDeleteFeed(): void {
    console.log('Confirming delete for selected feed.');
    // Implement actual delete logic here
    this.closeAllModals();
    this.loadFeeds(); // Refresh data
  }

  submitNewVaccine(): void {
    console.log('Submitting new vaccine:', this.selectedVaccine);
    // Implement actual add vaccine logic here
    this.closeAllModals();
  }

  addSelectedItem(): void {


    if (this.selectedFeed.type && this.selectedFeed.ingredients && this.selectedFeed.price !== undefined) {
      this.selectedItems.push({
        type: this.selectedFeed.type,
        ingredients: this.selectedFeed.ingredients,
        price: this.selectedFeed.price
      });
      // Reset selections for adding new item
      this.selectedFeed.type = '';
      this.selectedFeed.ingredients = '';
      this.selectedFeed.price = 0;
    }
  }

  removeItem(item: { type: string; ingredients: string }): void {
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
}
