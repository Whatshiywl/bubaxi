import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { MatSlider } from "@angular/material/slider";

@Injectable()
export class SliderService {
  readonly power = 4;

  setSlider(slider: AbstractControl | null, value: number, inverted?: boolean) {
    const logValue = this.sliderToLogValue(value, inverted);
    const fixedValue = this.fixValue(logValue, inverted);
    slider?.setValue(fixedValue);
    return fixedValue;
  }

  setSliderValue(source: MatSlider, logValue: number, inverted?: boolean) {
    const value = this.logToSliderValue(logValue, inverted);
    source.value = value;
    source.input.emit({ value, source });
  }

  private sliderToLogValue(value: number, inverted?: boolean) {
    const base = Math.pow(10, this.power);
    if (inverted) value = 1 - value;
    const logValue = 100 * (Math.pow(base, value) - 1) / (base - 1);
    return inverted ? 100 - logValue : logValue;
  }

  private logToSliderValue(logValue: number, inverted?: boolean) {
    const base = Math.pow(10, this.power);
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
