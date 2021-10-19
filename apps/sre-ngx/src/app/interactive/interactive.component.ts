import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { SliderService } from '../shared/slider.service';
import { TutorialService } from '../tutorial/tutorial.service';
import { UtilService } from '@bubaxi/util';

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
  tutorialVersion = 1;

  constructor(
    fb: FormBuilder,
    private sliderService: SliderService,
    private tutorial: TutorialService,
    private util: UtilService
  ) {
    this.appProps = fb.group({
      errorRate: fb.control(0.5),
      SLO: fb.control(95),
      SLA: fb.control(90)
    });
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.sliderService.setSliderValue(this.errorSlider, this.appProps.get('errorRate')?.value);
      this.sliderService.setSliderValue(this.sloSlider, this.appProps.get('SLO')?.value, true);
      this.sliderService.setSliderValue(this.slaSlider, this.appProps.get('SLA')?.value, true);
    }, 0);

    if (this.showTutorial) {
      await this.util.sleep(3000);
      const welcomeAnswer = await this.tutorial.open(`Welcome to the SRE interactive playground.
It was designed to help explain some of the core concepts of SRE.
Would you like to take a quick tour to understand how it works?`,
      [ `Let me be, I know what I'm doing!`, `Yes plase, teach me!` ]);
      if (welcomeAnswer.index === 0) this.showTutorial = false;
    }

    if (this.showTutorial) {
      await this.tutorial.open(`The playground simulates a service responding to requests with some underlying error rate.
The percentage of successful requests tends to stay around (1 - errorRate) and is represented by the dark blue line on the upper graph.
It represents the availability of this service at any given point in time and is called the Service Level Indicator (SLI).`);
      await this.tutorial.open(`The red line represents the Service Level Agreement (SLA) this service is bound to.
In simple terms, you always want your service to be working above it's SLA, so that the client's experience is not impacted.
Not all services have declared SLAs and this is fine. SRE doesn't actually care about nor does it depend on a service's SLA.
The SLA here serves simply as an illustration of what performance would be acceptable for the end user.`);
      await this.tutorial.open(`The yellow line represents the Service Level Objective (SLO).
The SLO works much like the SLA, but instead of being focused on the end user, it serves instead as a reference to the product team.
The idea of an SLO is to provide a 'safe zone' for errors to happen without endangering the user experience. Choosing an SLO is making a compromise:
 - An SLO that's too close to the SLA will provide too little margin of error and increase the chances of the client being impacted by an incident.
 - An SLO that's too far from the SLA will give very little wiggle room for the product team to take risks and release new and important features.`);
      await this.tutorial.open(`The graph at the bottom represents the Error Budget of the service.
This is meant to represent how many errors the product team can still afford before having to take some corrective measure.
For instance, if your error budget is almost at 100%, then you can be more confident that if a new release introduces a problem, you will have some time to fix it before it affects the client.
On the flip side, if your error budget is too low, any new problems would probably affect the user more rapdly and thus you should probably focus on fixing existing problems before working on new features.`);
      await this.tutorial.open(`The way the error budget is calculated is really simple:
The area on the first graph above the SLO line is the total error budget you can have. That would be 100%.
The area above the SLO line but below the SLI line (in other words, how far away your service is from breaking the SLO) is your current absolute error budget.
The ratio between these two areas is your error budget.`);
      await this.tutorial.open(`Okay, this is enough text, time for the promised interaction.
The slides on the upper left corner allow you to ajust the relevant values on the first graph.
Try to change them and see how they affect the error budget and the rate at which it changes.`);
    }
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

  get showTutorial() {
    return false;
    // const storedTutorial = localStorage.getItem('sreITutorial');
    // if (!storedTutorial) return true;
    // const tutorialVersion = +storedTutorial;
    // return tutorialVersion < this.tutorialVersion;
  }

  set showTutorial(show: boolean) {
    // if (show) localStorage.removeItem('sreITutorial');
    // else localStorage.setItem('sreITutorial', `${this.tutorialVersion}`);
  }

}
