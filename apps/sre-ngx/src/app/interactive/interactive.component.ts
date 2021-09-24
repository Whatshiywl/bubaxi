import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'bubaxi-sre-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.scss']
})
export class InteractiveComponent implements OnInit, AfterViewInit {
  @ViewChild('errorSlider') errorSlider!: MatSlider;
  @ViewChild('sloSlider') sloSlider!: MatSlider;
  @ViewChild('slaSlider') slaSlider!: MatSlider;

  availabilityData: ChartDataSets[] = [
    { data: [], label: 'SLI', pointRadius: 1 },
    { data: [], label: 'SLO', pointRadius: 0 },
    { data: [], label: 'SLA', pointRadius: 0 }
  ];
  errorBudgetData: ChartDataSets[] = [
    { data: [], label: 'Error Budget', pointRadius: 1 },
  ];
  lineChartLabels: Label[] = [];
  availabilityOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Availability'
    },
    responsive: true,
    aspectRatio: 4,
    tooltips: {
      enabled: false
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 50,
          max: 100
        }
      }]
    }
  };
  errorBudgetOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Error Budget'
    },
    legend: {
      display: false
    },
    responsive: true,
    aspectRatio: 4,
    tooltips: {
      enabled: false
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max: 100
        }
      }]
    }
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'darkblue',
      borderWidth: 2,
      backgroundColor: 'rgba(0,100,255,0.5)',
    },
    {
      borderColor: 'orange',
      borderWidth: 1,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    {
      borderColor: 'red',
      borderWidth: 1,
      backgroundColor: 'rgba(0,0,0,0)',
    },
  ];
  lineChartLegend = true;
  lineChartType: ChartType = 'line';
  lineChartPlugins = [];

  appProps: FormGroup;

  constructor(
    fb: FormBuilder
  ) {
    this.appProps = fb.group({
      errorRate: fb.control(0.1),
      SLO: fb.control(95),
      SLA: fb.control(90)
    });
  }

  async ngOnInit() {
    const requests = 200;
    const window = 30;
    let i = 0;
    while (i >= 0) {
      const errorRate = this.appProps.get('errorRate')?.value;
      let successes = 0;
      for (let j = 0; j < requests; j++) {
        if (Math.random() < (1 - errorRate/100)) successes++;
      }
      const y = 100 * successes / requests;

      const slo = this.appProps.get('SLO')?.value;
      const sla = this.appProps.get('SLA')?.value;
      const errorBudget = 100 * (this.availabilityData[0].data as number[]).reduce((acc, value) => acc + (value - slo), 0) / ((100 - slo) * this.lineChartLabels.length);

      this.availabilityData[0].data?.push(y);
      this.availabilityData[1].data = new Array(this.lineChartLabels.length + 1).fill(slo);
      this.availabilityData[2].data = new Array(this.lineChartLabels.length + 1).fill(sla);
      this.errorBudgetData[0].data?.push(isNaN(errorBudget) ? 100 : errorBudget);

      this.lineChartLabels.push(`${i}`);
      if (this.lineChartLabels.length > window) {
        this.lineChartLabels.shift();
        this.availabilityData.forEach(chartData => chartData.data?.shift());
        this.errorBudgetData.forEach(chartData => chartData.data?.shift());
      }
      await this.sleep(500);
      i++
    }
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.setSliderValue(this.errorSlider, this.appProps.get('errorRate')?.value);
      this.setSliderValue(this.sloSlider, this.appProps.get('SLO')?.value, true);
      this.setSliderValue(this.slaSlider, this.appProps.get('SLA')?.value, true);
    }, 0);
  }

  private sleep(timeout: number) {
    return new Promise(r => setTimeout(r, timeout));
  }

  setSlider(slider: string, value: number, inverted?: boolean) {
    const logValue = this.sliderToLogValue(value, inverted);
    const fixedValue = this.fixValue(logValue, inverted);
    this.appProps.get(slider)?.setValue(fixedValue);
  }

  private sliderToLogValue(value: number, inverted?: boolean) {
    const power = 4;
    const base = Math.pow(10, power);
    if (inverted) value = 1 - value;
    const logValue = 100 * (Math.pow(base, value) - 1) / (base - 1);
    return inverted ? 100 - logValue : logValue;
  }

  private setSliderValue(source: MatSlider, logValue: number, inverted?: boolean) {
    const value = this.logToSliderValue(logValue, inverted);
    source.value = value;
    source.input.emit({ value, source });
  }

  private logToSliderValue(logValue: number, inverted?: boolean) {
    const power = 4;
    const base = Math.pow(10, power);
    if (inverted) logValue = 100 - logValue;
    let value = Math.log(1 + logValue * (base - 1) / 100) / Math.log(base);
    if (inverted) value = 1 - value;
    return value;
  }

  private fixValue(value: number, inverted?: boolean) {
    if (!inverted) {
      return +(value < 0.095 ? value.toFixed(2) :
      (value < 0.95 ? value.toFixed(1) : value.toFixed(0)));
    } else {
      return +(value > 99.90 ? value.toFixed(2) :
      (value > 99 ? value.toFixed(1) : value.toFixed(0)));
    }
  }

}
