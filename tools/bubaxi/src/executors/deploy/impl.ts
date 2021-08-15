import { ExecutorContext } from '@nrwl/devkit';
import { docker, gcloud, packageJson } from '../common/util';

export interface DeployExecutorOptions {
  gcpProject: string;
  source: string;
  target: string;
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

  const sourcePrefix = process.env.DOCKER_HUB_REMOTE_REPO || options.source;
  const sourceRepo = `${sourcePrefix ? `${sourcePrefix}/` : ''}${gcpProjectID}_${projectName}`;

  const targetPrefix = `${process.env.GCP_REGISTRY_HOST || options.target}`;
  const targetRepo = `${targetPrefix}/${gcpProjectID}/${projectName}`;

  const version = `${process.env.version || options.version || packageJson.version || 'latest'}`;
  const source = `${sourceRepo}:${version}`;
  const target = `${targetRepo}:${version}`;

  const serviceAcc = options.serviceAcc;
  const region = options.region;

  try {
    // Pull image from Docker Hub
    await docker.pull(source);

    // Re-tag image for grc
    await docker.tag(source, target);

    // Push image to grc
    await docker.push(target);

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
