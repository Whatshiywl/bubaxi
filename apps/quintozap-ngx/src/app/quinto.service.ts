import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { first, map, takeWhile } from "rxjs/operators";
import { Filter } from "./app.component";
import { CommonListing, ListingOrigin, ListingResult } from "./info/info.component";
import { StorageService } from "./storage.service";
import { QuintozapHttpClient } from "@bubaxi/gateway-http";
import { QuintoHit } from "@bubaxi/api-types";

@Injectable()
export class QuintoService {
  private quintoApi = `api/quinto`;
  readonly listings$: Subject<ListingResult> = new Subject<ListingResult>();
  private origin: ListingOrigin = 'quinto'

  constructor(
    private quintozapClient: QuintozapHttpClient,
    private storageService: StorageService
  ) { }

  filter(quintoFilter: Filter) {
    const obs = this.getListings(quintoFilter);
    obs.pipe(first())
    .subscribe(results => this.listings$.next(results));
    return obs;
  }

  getListings(quintoFilter: Filter) {
    const tempFilter = { ...quintoFilter };
    tempFilter.size = tempFilter.size || 100;
    return this.getFromApi(quintoFilter)
    .pipe(
      takeWhile(results => {
        const resultSize = results.length;
        const fullResults = resultSize === tempFilter.size;
        return fullResults;
      }, true),
      takeWhile(results => {
        const noResult = results.length === 0;
        return noResult;
      }, true),
      map(results => {
        return {
          origin: this.origin,
          results: this.toCommonListings(results),
          filter: quintoFilter
        } as ListingResult;
      })
    );
  }

  getListing(id: string) {
    const path = `${this.quintoApi}/${id}`;
    return this.quintozapClient.getQuintoandarListing(id)
      .pipe(
        first()
      );
  }

  private getFromApi(quintoFilter: Filter) {
    const path = `${this.quintoApi}`;
    return this.quintozapClient.getQuintoandarListings(this.getBody(quintoFilter))
    .pipe(
      map(data => {
        return data.hits.hits;
      })
    );
  }

  private getBody(filter: Filter) {
    const { minPrice, maxPrice, maxArea, minArea, rooms, size, page } = filter;
    const from = size && page ? (page - 1) * size : 0;
    const body = {
      ...(filter.mapParams || { }),
      minPrice,
      maxPrice,
      maxArea,
      minArea,
      rooms,
      size,
      page,
      from
    };
    return body;
  }

  private toCommonListings(results: QuintoHit[]) {
    const lastPublicationDates = this.storageService.getLastPublicationDates();
    return results.map(result => {
      const id = `${this.origin}-${result._id}`;
      const areaPerThousand = Math.round(result._source.area * 1000 / result._source.totalCost);
      const pictures = result._source?.imageList?.map(image => {
        return `https://www.quintoandar.com.br/img/xxl/${image}`;
      }) || [];
      const pictureCaptions = [ ...(result._source.imageCaptionList || []) ];
      const mapped: CommonListing = {
        class: 'quinto-listing',
        origin: this.origin,
        id,
        originalId: result._id,
        title: result._source.address,
        totalCost: result._source.totalCost,
        area: result._source.area,
        areaPerThousand,
        link: `https://www.quintoandar.com.br/imovel/${result._id}`,
        pictures,
        pictureCaptions,
        rooms: result._source.bedrooms,
        mapPosition: {
          lat: result._source.location.lat,
          lng: result._source.location.lon
        },
        lastPublicationDate: lastPublicationDates[id] ? new Date(lastPublicationDates[id]) : undefined
      };
      return mapped;
    });
  }

}
