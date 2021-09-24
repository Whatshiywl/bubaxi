import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { EngineService } from '../shared/engine.service';
import { SliderService } from '../shared/slider.service';

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
    fb: FormBuilder,
    private engineService: EngineService,
    private sliderService: SliderService
  ) {
    this.appProps = fb.group({
      errorRate: fb.control(0.1),
      SLO: fb.control(95),
      SLA: fb.control(90)
    });
  }

  ngOnInit() {
    this.engineService.run$(
      {
        errorRate: this.appProps.get('errorRate'),
        SLO: this.appProps.get('SLO'),
        SLA: this.appProps.get('SLA')
      },
      this.lineChartLabels,
      {
        SLI: this.availabilityData[0],
        SLO: this.availabilityData[1],
        SLA: this.availabilityData[2],
        errorBudget: this.errorBudgetData[0]
      }
    ).subscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sliderService.setSliderValue(this.errorSlider, this.appProps.get('errorRate')?.value);
      this.sliderService.setSliderValue(this.sloSlider, this.appProps.get('SLO')?.value, true);
      this.sliderService.setSliderValue(this.slaSlider, this.appProps.get('SLA')?.value, true);
    }, 0);
  }

  setSlider(slider: string, value: number, inverted?: boolean) {
    const control = this.appProps.get(slider);
    const result = this.sliderService.setSlider(control, value, inverted);
    if (slider === 'SLO' && result < this.appProps.get('SLA')?.value) {
      this.appProps.get('SLA')?.setValue(result);
      this.sliderService.setSliderValue(this.slaSlider, this.appProps.get('SLA')?.value, true);
    } else if (slider === 'SLA' && result > this.appProps.get('SLO')?.value) {
      this.appProps.get('SLO')?.setValue(result);
      this.sliderService.setSliderValue(this.sloSlider, this.appProps.get('SLO')?.value, true);
    }
  }

}
