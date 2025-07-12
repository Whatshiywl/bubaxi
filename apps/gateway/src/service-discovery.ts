import { GoogleAuth } from 'google-auth-library';

export interface ServiceInfo {
  name: string;
  url: string;
  status: 'available' | 'unavailable';
}

export class ServiceDiscovery {
  private auth: GoogleAuth | null = null;
  private projectId: string;
  private region: string;
  private expectedServices: string[];
  private serviceUrls: Map<string, string> = new Map();
  private isCloudEnvironment: boolean;

  constructor() {
    this.projectId = process.env.PROJECT_ID || '';
    this.region = process.env.REGION || 'us-central1';
    this.expectedServices = (process.env.EXPECTED_API_SERVICES || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Check if we're in a cloud environment
    this.isCloudEnvironment = !!(this.projectId && this.region && this.expectedServices.length > 0);

    if (this.isCloudEnvironment) {
      try {
        this.auth = new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        console.log('🔍 Service Discovery initialized for cloud environment');
      } catch (error) {
        console.warn('⚠️  Failed to initialize Google Auth, falling back to local mode:', error.message);
        this.isCloudEnvironment = false;
      }
    } else {
      console.log('🏠 Service Discovery initialized for local development');
    }

    console.log(`📋 Expected services: ${this.expectedServices.join(', ')}`);
  }

  async discoverServices(): Promise<ServiceInfo[]> {
    if (!this.isCloudEnvironment) {
      console.log('🏠 Running in local mode, skipping service discovery');
      return [];
    }

    const services: ServiceInfo[] = [];

    for (const serviceName of this.expectedServices) {
      try {
        const serviceUrl = await this.getCloudRunServiceUrl(serviceName);
        if (serviceUrl) {
          this.serviceUrls.set(serviceName, serviceUrl);
          services.push({
            name: serviceName,
            url: serviceUrl,
            status: 'available'
          });
          console.log(`✅ Found service: ${serviceName} -> ${serviceUrl}`);
        } else {
          services.push({
            name: serviceName,
            url: '',
            status: 'unavailable'
          });
          console.log(`⚠️  Service not found: ${serviceName}`);
        }
      } catch (error) {
        services.push({
          name: serviceName,
          url: '',
          status: 'unavailable'
        });
        console.log(`❌ Error discovering service ${serviceName}:`, error.message);
      }
    }

    return services;
  }

  private async getCloudRunServiceUrl(serviceName: string): Promise<string | null> {
    if (!this.auth) {
      return null;
    }

    try {
      const authClient = await this.auth.getClient();
      const serviceFullName = `${serviceName}-api`; // Convert homaxi -> homaxi-api

      const url = `https://run.googleapis.com/v2/projects/${this.projectId}/locations/${this.region}/services/${serviceFullName}`;

      const response = await authClient.request({
        url,
        method: 'GET'
      });

      if (response.status === 200) {
        const serviceData = response.data as any;
        const serviceUrl = serviceData.urls?.[0];
        return serviceUrl || null;
      }

      return null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Service doesn't exist yet
      }
      throw error;
    }
  }

  getServiceUrl(serviceName: string): string | null {
    return this.serviceUrls.get(serviceName) || null;
  }

  getAllServiceUrls(): Map<string, string> {
    return new Map(this.serviceUrls);
  }

  async getAvailableServices(): Promise<ServiceInfo[]> {
    const services = await this.discoverServices();
    return services.filter(s => s.status === 'available');
  }

  isInCloudMode(): boolean {
    return this.isCloudEnvironment;
  }
}
