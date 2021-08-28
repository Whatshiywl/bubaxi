import { environment } from './environments/environment';
import { Options } from "http-proxy-middleware";

const logLevel = environment.production ? 'info' : 'info';

const proxy: { [path: string]: Options } = { };

function addProxy(basePath: string, path: string, target: string, devTarget: string) {
  const options: Options = {
    target,
    changeOrigin: true,
    secure: false,
    logLevel,
    pathRewrite: { },
    router: { 'localhost:3000': devTarget }
  };
  options.pathRewrite[`^${basePath}`] = '';
  const fullPath = `${basePath}${path}`;
  proxy[fullPath] = options;
}

addProxy('/test-npx', '/api', 'https://test-api-2bfaoux6cq-uc.a.run.app/', 'http://localhost:3080/');
addProxy('/test-npx', '',     'https://test-npx-2bfaoux6cq-uc.a.run.app/', 'http://localhost:8080/');

addProxy('/quintozap', '/api', 'https://quintozap-api-2bfaoux6cq-uc.a.run.app/', 'http://localhost:3020/');
addProxy('/quintozap', '',     'https://quintozap-ngx-2bfaoux6cq-uc.a.run.app/', 'http://localhost:8020/');

addProxy('/api',  '', 'https://homaxi-api-2bfaoux6cq-uc.a.run.app/', 'http://localhost:3010/');
addProxy('/',     '', 'https://homaxi-ngx-2bfaoux6cq-uc.a.run.app/', 'http://localhost:8010/');

export default proxy;
