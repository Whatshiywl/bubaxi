import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";
import { interval, Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface EngineIterationResult {
  i: number;
  sli: number;
  errorBudget: number
}

@Injectable()
export class EngineService {

  run$(controls: {
    errorRate: AbstractControl | null,
    SLO: AbstractControl | null,
    SLA: AbstractControl | null
  },
  labels: Label[],
  data: {
    SLI: ChartDataSets,
    SLO: ChartDataSets,
    SLA: ChartDataSets,
    errorBudget: ChartDataSets
  }): Observable<EngineIterationResult> {
    const requests = 1000;
    const window = 28;
    return interval(500).pipe(
      map(i => {
        const slo = controls.SLO?.value;
        const sla = controls.SLA?.value;
        const errorRate = controls.errorRate?.value;
        const successes = new Array(requests).fill(0).reduce(acc => Math.random() < (1 - errorRate / 100) ? ++acc : acc, 0);
        const sli = 100 * successes / requests;
        const errorBudget = 100 * (data.SLI.data as number[]).reduce((acc, value) => acc + (value - slo), 0) / ((100 - slo) * labels.length);

        data.SLI.data?.push(sli);
        data.SLO.data = new Array(labels.length + 1).fill(slo);
        data.SLA.data = new Array(labels.length + 1).fill(sla);
        data.errorBudget.data?.push(isNaN(errorBudget) ? 100 : errorBudget);

        labels.push(`${i}`);
        if (labels.length > window) {
          labels.shift();
          data.SLI.data?.shift();
          data.SLO.data?.shift();
          data.SLA.data?.shift();
          data.errorBudget.data?.shift();
        }

        return {
          i, sli, errorBudget: isNaN(errorBudget) ? 100 : errorBudget
        }
      })
    );
  }

}
