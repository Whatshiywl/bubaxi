import { ExecutorContext } from '@nrwl/devkit';
import { docker, gcloud, packageJson } from '../common/util';

export interface DeployExecutorOptions {
  gcpProject: string;
  gcpHost: string;
  version: string;
  serviceAcc: string;
  region: string;
}

export default async function dockerExecutor(
  options: DeployExecutorOptions,
  context: ExecutorContext
) {
  console.info(`Executing "deploy"...`);
  const { projectName } = context;
  const gcpProjectID = process.env.GCP_PROJECT || options.gcpProject;

  const targetPrefix = `${process.env.GCP_REGISTRY_HOST || options.gcpHost}`;
  const targetRepo = `${targetPrefix}/${gcpProjectID}/${projectName}`;

  const version = `${process.env.version || options.version || packageJson.version || 'latest'}`;
  const target = `${targetRepo}:${version}`;

  const serviceAcc = options.serviceAcc;
  const region = options.region;

  try {
    // Deploy to Cloud Run
    await gcloud.deploy(projectName, target, region, serviceAcc);

    // Clean up other images
    await gcloud.pruneAll(targetRepo, version);

    return { success: true };
  } catch (error) {
    if (error) console.error(error);
    return { success: false };
  }
}
