import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { EngineService } from '../shared/engine.service';

@Component({
  selector: 'bubaxi-sre-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() errorRateControl!: AbstractControl | null;
  @Input() sloControl!: AbstractControl | null;
  @Input() slaControl!: AbstractControl | null;

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

  constructor(
    private engineService: EngineService
  ) { }

  ngOnInit() {
    this.engineService.run$(
      {
        errorRate: this.errorRateControl,
        SLO: this.sloControl,
        SLA: this.slaControl
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

}
