import { comingSoonProject } from "../app/project/project.interface";

export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyCmrs57dyGhpzeuI_RtYmMm2DScQGHf4lM',
    authDomain: 'bubaxi.firebaseapp.com',
    projectId: 'bubaxi',
  },
  projects: [
    {
      name: 'Quinto Zap',
      href: 'quintozap.bubaxi.com',
      img: '/assets/quintozap.jpg'
    },
    {
      name: 'SRE',
      href: 'sre.bubaxi.com',
      img: '/assets/sre.jpg'
    },
    comingSoonProject,
    comingSoonProject,
    comingSoonProject,
    comingSoonProject
  ]
};
