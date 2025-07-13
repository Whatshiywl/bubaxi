import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { first, map, takeWhile } from "rxjs/operators";
import { Filter } from "./app.component";
import { CommonListing, ListingOrigin, ListingResult } from "./info/info.component";
import { ZapListing } from "@bubaxi/api-types";
import { QuintozapHttpClient } from "@bubaxi/gateway-http";

@Injectable()
export class ZapService {
  readonly listings$: Subject<ListingResult> = new Subject<ListingResult>();
  private origin: ListingOrigin = 'zap';

  constructor(
    private quintozapClient: QuintozapHttpClient
  ) { }

  filter(zapFilter: Filter) {
    const obs = this.getListings(zapFilter);
    obs.pipe(first())
    .subscribe(results => this.listings$.next(results));
    return obs;
  }

  getListings(zapFilter: Filter) {
    const tempFilter = { ...zapFilter };
    tempFilter.size = tempFilter.size || 100;
    return this.getFromApi(zapFilter)
    .pipe(
      takeWhile(results => {
        const resultSize = results.length;
        const fullResults = resultSize === tempFilter.size;
        return fullResults;
      }, true),
      map(results => {
        return results.filter(el => el.listing.address.point);
      }),
      takeWhile(results => {
        const noResult = results.length === 0;
        return noResult;
      }, true),
      map(results => {
        return {
          origin: this.origin,
          results: this.toCommonListings(results),
          filter: zapFilter
        } as ListingResult;
      })
    );
  }

  private getFromApi(zapFilter: Filter) {
    return this.quintozapClient.getZapListings(this.getParams(zapFilter))
    .pipe(
      map(data => {
        return data.search.result.listings;
      })
    );
  }

  private getParams(filter: Filter) {
    let params = new HttpParams()
    if (filter.mapParams?.bounds) {
      const { bounds: { east, west, north, south } } = filter.mapParams;
      const viewport = `${east},${north}|${west},${south}`;
      params = params.append('viewport', viewport);
    }
    const { minPrice, maxPrice, maxArea, minArea, rooms, size, page } = filter;
    if (minPrice) params = params.append('minPrice', `${minPrice}`);
    if (maxPrice) params = params.append('maxPrice', `${maxPrice}`);
    if (minArea) params = params.append('minArea', `${minArea}`);
    if (maxArea) params = params.append('maxArea', `${maxArea}`);
    if (rooms) params = params.append('rooms', `${rooms}`);
    if (size) params = params.append('size', size);
    if (page) {
      params = params.append('page', page);
      if (size) params = params.append('from', (page - 1) * size);
    }
    return params;
  }

  private getFullListingPrice(listing: ZapListing) {
    const pricing = listing.listing.pricingInfos.find(info => info.businessType === 'RENTAL');
    if (!pricing) return 0;
    const rent = (+pricing.price || 0) + (+pricing.monthlyCondoFee || 0);
    return Math.round(rent);
  }

  private toCommonListings(results: ZapListing[]) {
    return results.map(result => {
      const id = `${this.origin}-${result.listing.id}`;
      const area = +result.listing.usableAreas[0];
      const totalCost = this.getFullListingPrice(result);
      const areaPerThousand = Math.round(area * 1000 / totalCost);
      const pictures = result.medias ? result.medias
      .filter(media => media.type === 'IMAGE')
      .map(media => {
        return media.url
        .replace('{action}', 'fit-in')
        .replace('{width}', '800')
        .replace('{height}', '360');
      }) : [];
      const mapped: CommonListing = {
        class: 'zap-listing',
        origin: this.origin,
        id,
        originalId: result.listing.id,
        title: result.listing.title,
        totalCost,
        area,
        areaPerThousand,
        link: `https://www.zapimoveis.com.br${result.link.href}`,
        pictures,
        pictureCaptions: [ ],
        rooms: result.listing.bedrooms[0],
        mapPosition: {
          lat: result.listing.address.point.lat,
          lng: result.listing.address.point.lon
        },
        firstPublicationDate: new Date(result.listing.createdAt),
        lastPublicationDate: new Date(result.listing.updatedAt)
      };
      return mapped;
    });
  }
}
