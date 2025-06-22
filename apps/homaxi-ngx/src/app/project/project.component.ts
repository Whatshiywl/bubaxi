import { Component, Input } from "@angular/core";

export interface Project {
  name: string,
  href: string,
  img?: string,
  description?: string
}

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
    window.open(this.project.href, '_self');
  }
}
