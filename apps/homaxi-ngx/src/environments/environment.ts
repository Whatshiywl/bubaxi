// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { comingSoonProject } from "../app/project/project.interface";

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCmrs57dyGhpzeuI_RtYmMm2DScQGHf4lM',
    authDomain: 'bubaxi.firebaseapp.com',
    projectId: 'bubaxi',
  },
  projects: [
    {
      name: 'Quinto Zap',
      href: 'http://localhost:8020',
      img: '/assets/quintozap.jpg'
    },
    {
      name: 'SRE',
      href: 'http://localhost:8030',
      img: '/assets/sre.jpg'
    },
    comingSoonProject,
    comingSoonProject,
    comingSoonProject,
    comingSoonProject
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
