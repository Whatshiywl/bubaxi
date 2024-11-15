import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
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

  appProps: UntypedFormGroup;

  errorBudget = 100;

  satisfaction = 100;
  slaFactor = 100;
  featureFactor = 100;

  featureTimeout = 0;
  nextChange: 'feature' | undefined = undefined;
  nextFeatureSize = 0;
  nextErrorChange = 0;

  lastFeature = 0;
  lastFeatureSize = 0;

  debugging = false;

  constructor(
    fb: UntypedFormBuilder,
    private sliderService: SliderService
  ) {
    this.appProps = fb.group({
      errorRate: fb.control(0.5),
      SLO: fb.control(95),
      SLA: fb.control(90)
    });
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (this.featureTimeout > 0) return;
    if (['1', '2', '3'].includes(event.key) && !this.debugging) {
      this.onNewFeature(+event.key);
    } else if (event.key === '4') {
      this.toggleBugFix();
    }
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
    this.errorBudget = result.errorBudget;
    if (this.featureTimeout) {
      this.featureTimeout--;
      if (!this.featureTimeout) {
        const errorRate = this.appProps.get('errorRate')?.value as number;
        const newErrorRate = this.nextChange === 'feature' ? +`${(errorRate + this.nextErrorChange).toFixed(2)}` : undefined;
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
    } else if (this.debugging && Math.random() < (0.5 / 3)) {
      const errorRate = this.appProps.get('errorRate')?.value as number;
      const newErrorRate = this.debugging ? +`${(errorRate * (1 - 0.3 / (errorRate + 1))).toFixed(2)}` : undefined;
      if (newErrorRate !== undefined) {
        this.appProps.get('errorRate')?.setValue(newErrorRate);
        if (newErrorRate == 0) this.toggleBugFix();
      }
    } else if (!this.debugging && this.featureTimeout === 0 && result.errorBudget < 0) {
      this.toggleBugFix();
    }
    this.updateSatisfaction(result);
  }

  onNewFeature(size: number) {
    this.featureTimeout = 5 * size;
    this.nextChange = 'feature';
    this.nextFeatureSize = size;
    const bugStrength = 0.2 * size * size * size;
    const chanceOfNoBug = 0.6 / (size * size * size);
    if (Math.random() < chanceOfNoBug) return;
    const currentErrorRate = this.appProps.get('errorRate')?.value;
    this.nextErrorChange = Math.min(100 - currentErrorRate, bugStrength);
  }

  toggleBugFix() {
    this.debugging = !this.debugging;
  }

  get errorRate() {
    return this.appProps.get('errorRate')?.value;
  }

  get slo() {
    return this.appProps.get('SLO')?.value;
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
