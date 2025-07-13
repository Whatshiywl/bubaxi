import { Component, Input } from "@angular/core";
import { Project } from "./project.interface";

@Component({
  standalone: false,
  selector: 'bubaxi-homaxi-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  @Input() project!: Project;

  onProjectClick() {
    console.log(this.project);
    if (this.project.href) {
      window.location.href = this.project.href;
    }
  }
}
