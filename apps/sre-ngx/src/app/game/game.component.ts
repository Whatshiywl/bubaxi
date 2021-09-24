import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { EngineIterationResult } from '../shared/engine.service';
import { SliderService } from '../shared/slider.service';

@Component({
  selector: 'bubaxi-sre-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  @ViewChild('sloSlider') sloSlider!: MatSlider;

  appProps: FormGroup;

  satisfaction = 100;
  slaFactor = 100;
  featureFactor = 100;

  devTimeout = 0;

  nextChange: 'feature' | 'bugfix' | undefined = undefined;
  nextFeatureSize = 0;
  nextErrorChange = 0;

  lastFeature = 0;
  lastFeatureSize = 0;

  constructor(
    fb: FormBuilder,
    private sliderService: SliderService
  ) {
    this.appProps = fb.group({
      errorRate: fb.control(0.1),
      SLO: fb.control(95),
      SLA: fb.control(90)
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sliderService.setSliderValue(this.sloSlider, this.appProps.get('SLO')?.value, true);
    }, 0);
  }

  setSlider(slider: string, value: number, inverted?: boolean) {
    const control = this.appProps.get(slider);
    const result = this.sliderService.setSlider(control, value, inverted);
    if (slider === 'SLO' && result < this.appProps.get('SLA')?.value) {
      this.appProps.get('SLO')?.setValue(this.appProps.get('SLA')?.value);
      this.sliderService.setSliderValue(this.sloSlider, this.appProps.get('SLO')?.value, true);
    }
  }

  onGraphUpdate(result: EngineIterationResult) {
    if (this.devTimeout) {
      this.devTimeout--;
      if (!this.devTimeout) {
        const errorRate = this.appProps.get('errorRate')?.value as number;
        const newErrorRate = this.nextChange === 'feature' ? +`${(errorRate + this.nextErrorChange).toFixed(2)}` :
          (this.nextChange === 'bugfix' ? +`${(errorRate * (1 - this.nextErrorChange / (errorRate + 1))).toFixed(2)}` : undefined);
        if (newErrorRate !== undefined) {
          this.appProps.get('errorRate')?.setValue(newErrorRate);
          this.nextErrorChange = 0;
        }

        if (this.nextChange === 'feature') {
          this.lastFeature = result.i;
          this.lastFeatureSize = this.nextFeatureSize;
        }
        this.nextChange = undefined;
        this.nextFeatureSize = 0;
      }
    }
    this.updateSatisfaction(result);
  }

  onNewFeature(size: number) {
    this.devTimeout = 5 * size;
    this.nextChange = 'feature';
    this.nextFeatureSize = size;
    const bugStrength = 0.2 * size * size * size;
    const chanceOfNoBug = 0.8 / (size * size * size);
    if (Math.random() < chanceOfNoBug) return;
    const currentErrorRate = this.appProps.get('errorRate')?.value;
    this.nextErrorChange = Math.min(100 - currentErrorRate, bugStrength);
  }

  onBugFix() {
    this.devTimeout = 3;
    this.nextChange = 'bugfix';
    if (Math.random() < 0.5) return;
    this.nextErrorChange = 0.2;
  }

  get satisfactionColor() {
    if (this.satisfaction > 70) return 'green';
    if (this.satisfaction > 40) return 'orange';
    return 'red';
  }

  private updateSatisfaction(result: EngineIterationResult) {
    const slaDistance = result.sli - this.appProps.get('SLA')?.value;
    this.slaFactor = this.sigmoid(slaDistance / 2);

    const lastTimeSinceNewFeature = result.i - this.lastFeature - 7 * (this.lastFeatureSize - 1);
    const desiredFeatureTimeDistance = 30 - lastTimeSinceNewFeature;
    this.featureFactor = this.sigmoid(desiredFeatureTimeDistance / 5);

    const newSatisfaction = 100 * this.slaFactor * this.featureFactor;
    this.satisfaction = 0.9 * this.satisfaction + 0.1 * newSatisfaction;
  }

  private sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x));
  }

}
