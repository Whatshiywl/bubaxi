import { environment } from './environments/environment';
import { Options } from "http-proxy-middleware";
import { join } from 'path';
import { ServiceDiscovery } from './service-discovery';

const secure = environment.production;
const serviceDiscovery = new ServiceDiscovery();

// Static proxy configuration (fallback to local development)
const staticProxy: { [path: string]: Options } = {};

function addProxy(basePath: string, path: string, target: string) {
  const options: Options = {
    target,
    changeOrigin: true,
    secure,
    pathRewrite: {}
  };
  if (basePath.length > 1) options.pathRewrite[`^${basePath}`] = '';
  const fullPath = join(basePath, path);
  const willTrim = fullPath.length > 1 && fullPath.endsWith('/');
  const trimmed = willTrim ? fullPath.substring(0, fullPath.length - 1) : fullPath;
  options.pathFilter = trimmed;
  staticProxy[trimmed] = options;
}

// Initialize static proxy from environment (for local development)
const proxyEnv = environment.proxy || {};
Object.keys(proxyEnv).forEach(basePath => {
  const { paths } = proxyEnv[basePath];
  Object.keys(paths).forEach(path => {
    const target = paths[path];
    addProxy(basePath, path, target);
  });
});

// Dynamic proxy that combines static and discovered services
export function createDynamicProxy(): { [path: string]: Options } {
  const dynamicProxy: { [path: string]: Options } = { ...staticProxy };

  // Override with discovered services
  const discoveredServices = serviceDiscovery.getAllServiceUrls();

  for (const [serviceName, serviceUrl] of discoveredServices) {
    const basePath = `/${serviceName}`;

    // Create proxy for /serviceName/api -> serviceUrl
    const apiOptions: Options = {
      target: serviceUrl,
      changeOrigin: true,
      secure,
      pathRewrite: {},
      pathFilter: basePath
    };
    apiOptions.pathRewrite[`^${basePath}`] = ''

    dynamicProxy[basePath] = apiOptions;

    console.log(`🔗 Mapped ${basePath} -> ${serviceUrl}`);
  }

  return dynamicProxy;
}

// Initialize service discovery
export async function initializeServiceDiscovery(): Promise<void> {
  console.log('🚀 Initializing service discovery...');

  try {
    await serviceDiscovery.discoverServices();
    console.log('✅ Service discovery initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize service discovery:', error);
    console.log('📝 Falling back to static proxy configuration');
  }
}

// Export service discovery instance for health checks
export { serviceDiscovery };

// Default export for backward compatibility
export default staticProxy;
