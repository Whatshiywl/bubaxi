export const environment = {
  production: true,
  proxy: {
    '/vjrnb': {
      paths: {
        '/api': 'https://vjrnb-api-2bfaoux6cq-uc.a.run.app/',
        '/':    'https://vjrnb-ngx-2bfaoux6cq-uc.a.run.app/'
      }
    },
    '/sre': {
      paths: {
        '/':    'https://sre-ngx-2bfaoux6cq-uc.a.run.app/'
      }
    },
    '/quintozap': {
      paths: {
        '/api': 'https://quintozap-api-2bfaoux6cq-uc.a.run.app/',
        '/':    'https://quintozap-ngx-2bfaoux6cq-uc.a.run.app/'
      }
    },
    '/homaxi': {
      paths: {
        '/': 'https://homaxi-api-dev-975830665753.us-central1.run.app/'
      }
    }
    // '/': {
    //   paths: {
    //     '/api': 'https://homaxi-api-2bfaoux6cq-uc.a.run.app/',
    //     '/':    'https://homaxi-ngx-2bfaoux6cq-uc.a.run.app/'
    //   }
    // }
  },
  corsAllowedOrigins: ['bubaxi.com']
};
