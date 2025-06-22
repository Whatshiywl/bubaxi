import { environment } from './environments/environment';
import { Options } from "http-proxy-middleware";
import { join } from 'path';

const secure = environment.production;

const proxy: { [path: string]: Options } = { };

function addProxy(basePath: string, path: string, target: string) {
  const options: Options = {
    target,
    changeOrigin: true,
    secure,
    pathRewrite: { }
  };
  if (basePath.length > 1) options.pathRewrite[`^${basePath}`] = '';
  const fullPath = join(basePath, path);
  const willTrim = fullPath.length > 1 && fullPath.endsWith('/');
  const trimmed = willTrim ? fullPath.substring(0, fullPath.length - 1) : fullPath;
  options.pathFilter = trimmed;
  proxy[trimmed] = options;
}

const proxyEnv = environment.proxy;
Object.keys(proxyEnv).forEach(basePath => {
  const { paths } = proxyEnv[basePath];
  Object.keys(paths).forEach(path => {
    const target = paths[path];
    addProxy(basePath, path, target);
  });
});

export default proxy;
