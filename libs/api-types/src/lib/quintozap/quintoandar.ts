export interface QuintoHitMetadata {
  address: string,
  area: number,
  bedrooms: number,
  city: string,
  coverImage: string,
  forRent: boolean,
  forSale: boolean,
  id: number,
  imageCaptionList: string[],
  imageList: string[],
  iptuPlusCondominium: number,
  neighbourhood: string,
  parkingSpaces: number,
  regionName: string,
  rent: number,
  salePrice: number,
  totalCost: number,
  type: string,
  visitStatus: string,
  location: {
    lat: number,
    lon: number
  }
}

export interface QuintoHit {
  _id: string,
  _index: string,
  _score: number,
  _source: QuintoHitMetadata,
  _type: string,
  link?: string
}

export interface QuintoHits {
  hits: QuintoHit[],
  max_score: number,
  total: {
    value: number,
    relation: string
  }
}

export interface QuintoandarListingsResponse {
  hits: QuintoHits,
  search_id: string,
  timed_out: boolean,
  took: number,
  _shards: {
    total: number,
    successful: number,
    skipped: number,
    failed: number
  }
}

export interface QuintoandarListingResponse {
  firstPublicationDate: string,
  lastPublicationDate: string
}
