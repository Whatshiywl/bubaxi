import { Component } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";

import SwiperCore, {
  Keyboard,
  Mousewheel
} from 'swiper';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Filter } from "../app.component";
import { QuintoService } from "../quinto.service";
import { StorageService } from "../storage.service";
import { PreferencesService } from "../preferences.service";

export type ListingOrigin = 'zap' | 'quinto';

export interface CommonListing {
  class: 'zap-listing' | 'quinto-listing',
  origin: ListingOrigin,
  id: string,
  originalId: string,
  title: string,
  totalCost: number
  area: number,
  areaPerThousand: number,
  link: string,
  pictures: string[],
  pictureCaptions: string[],
  rooms: number,
  mapPosition: google.maps.LatLngLiteral,
  firstPublicationDate?: Date,
  lastPublicationDate?: Date
}

export interface ListingResult {
  origin: ListingOrigin,
  results: CommonListing[],
  filter: Filter
}

// install Swiper modules
SwiperCore.use([Keyboard, Mousewheel]);

@Component({
  standalone: false,
  selector: 'bubaxi-quintozap-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  linkButton!: 'Zap Imóveis' | 'Quinto Andar';

  listing!: CommonListing;

  seen: string[] = [ ];
  favorites: string[] = [ ];

  constructor(
    private clipboard: Clipboard,
    private snack: MatSnackBar,
    private quintoService: QuintoService,
    private storageService: StorageService,
    private preferences: PreferencesService
  ) {
    const savedPref = this.preferences.getPreferences();
    this.seen = savedPref.seen;
    this.favorites = savedPref.favorites;
    this.preferences.valueChanges.subscribe(pref => {
      if (!pref) return;
      if (pref.seen) this.seen = pref.seen;
      if (pref.favorites) this.favorites = pref.favorites;
    });
  }

  setListing(listing: CommonListing) {
    switch (listing.class) {
      case 'zap-listing':
        this.linkButton = 'Zap Imóveis';
        break;
      case 'quinto-listing':
        this.linkButton = 'Quinto Andar';
        if (!listing.lastPublicationDate) {
          this.quintoService.getListing(listing.originalId).subscribe(result => {
            if (result.firstPublicationDate) listing.firstPublicationDate = new Date(result.firstPublicationDate);
            if (result.lastPublicationDate) {
              listing.lastPublicationDate = new Date(result.lastPublicationDate);
              this.storageService.setLastPublicationDate(listing.id, result.lastPublicationDate);
            }
          });
        }
        break;
    }
    this.listing = listing;
  }

  getPublicationTimeInDays() {
    if (!this.listing.lastPublicationDate) return;
    const timeDifference = Date.now() - this.listing.lastPublicationDate.getTime();
    return Math.round(timeDifference / (24 * 60 * 60 * 1000));
  }

  openLink() {
    if (!this.listing) return;
    window.open(this.listing.link);
  }

  copyLink() {
    if (!this.listing) return;
    this.clipboard.copy(this.listing.link);
    this.snack.open('Link copied to clipboard', 'OK', { duration: 3000 });
  }

  getSlidesPerView() {
    const w = window.innerWidth;
    return w < 800 ? 1 : (w < 1200 ? 2 : 3);
  }

  onFavorite() {
    if (!this.listing) return;
    const newState = !this.favorites.includes(this.listing.id);
    if (newState) {
      this.favorites.push(this.listing.id);
    } else {
      const index = this.favorites.findIndex(id => id === this.listing.id);
      this.favorites.splice(index, 1);
    }
    this.preferences.save('favorites', this.favorites);
  }

  onToggleVisibility() {
    if (!this.listing) return;
    const newState = !this.seen.includes(this.listing.id);
    if (newState) {
      this.seen.push(this.listing.id);
    } else {
      const index = this.seen.findIndex(id => id === this.listing.id);
      this.seen.splice(index, 1);
    }
    this.preferences.save('seen', this.seen);
  }

  isSeen(listing: CommonListing) {
    return this.seen.includes(listing.id);
  }

  isFavorite(listing: CommonListing) {
    return this.favorites.includes(listing.id);
  }
}
