import { Injectable } from "@angular/core";

@Injectable()
export class UtilService {

  sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

}
