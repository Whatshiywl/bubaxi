export const environment = {
  production: true,
  proxy: {
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
    '/': {
      paths: {
        '/api': 'https://homaxi-api-2bfaoux6cq-uc.a.run.app/',
        '/':    'https://homaxi-ngx-2bfaoux6cq-uc.a.run.app/'
      }
    }
  }
};
