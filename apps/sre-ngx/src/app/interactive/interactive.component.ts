import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { SliderService } from '../shared/slider.service';

@Component({
  selector: 'bubaxi-sre-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.scss']
})
export class InteractiveComponent implements AfterViewInit {
  @ViewChild('errorSlider') errorSlider!: MatSlider;
  @ViewChild('sloSlider') sloSlider!: MatSlider;
  @ViewChild('slaSlider') slaSlider!: MatSlider;

  appProps: FormGroup;

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
