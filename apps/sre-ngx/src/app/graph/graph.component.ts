import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ChartDataset, ChartOptions, CommonElementOptions } from 'chart.js';
import { EngineIterationResult, EngineService } from '../shared/engine.service';

@Component({
  standalone: false,
  selector: 'bubaxi-sre-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() errorRateControl!: AbstractControl | null;
  @Input() sloControl!: AbstractControl | null;
  @Input() slaControl!: AbstractControl | null;
  @Output() update: EventEmitter<EngineIterationResult> = new EventEmitter<EngineIterationResult>();

  lineChartColors: CommonElementOptions[] = [
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
  availabilityData: ChartDataset<'line'>[] = [
    { data: [], label: 'SLI', pointRadius: 1, yAxisID: 'yAxis', ...this.lineChartColors[0] },
    { data: [], label: 'SLO', pointRadius: 0, yAxisID: 'yAxis', ...this.lineChartColors[1] },
    { data: [], label: 'SLA', pointRadius: 0, yAxisID: 'yAxis', ...this.lineChartColors[2] }
  ];
  errorBudgetData: ChartDataset<'line'>[] = [
    { data: [], label: 'Error Budget', pointRadius: 1, yAxisID: 'yAxis', ...this.lineChartColors[0] },
  ];
  lineChartLabels: string[] = [];
  availabilityOptions: ChartOptions<'line'> = {
    plugins: {
      title: {
        display: true,
        text: 'Availability'
      },
      tooltip: {
        enabled: false
      },
    },
    responsive: true,
    aspectRatio: 4,
    scales: {
      yAxis: {
        type: 'linear',
        min: 80,
        max: 100
      }
    }
  };
  errorBudgetOptions: ChartOptions<'line'> = {
    plugins: {
      title: {
        display: true,
        text: 'Error Budget'
      },
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      }
    },
    responsive: true,
    aspectRatio: 4,
    scales: {
      yAxis: {
        type: 'linear',
        min: 0,
        max: 100
      }
    }
  };
  lineChartLegend = true;
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
    ).subscribe(result => {
      this.update.emit(result);
    });
  }

}
