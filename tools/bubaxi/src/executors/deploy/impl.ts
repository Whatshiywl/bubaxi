import { ExecutorContext } from '@nx/devkit';
import { gcloud, packageJson } from '../common/util';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

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
  const { projectName, projectsConfigurations } = context;
  if (!projectName) {
    console.log('No project name provided, cannot deploy!');
    return { success: false };
  }
  const gcpProjectID = process.env.GCP_PROJECT || options.gcpProject;
  const project = projectsConfigurations.projects[projectName];

  const buildPath: string =
    project?.targets?.build?.options?.outputPath || `dist/apps/${projectName}`;
  const versionFile = join(buildPath, 'version');

  const targetPrefix = `${process.env.GCP_REGISTRY_HOST || options.gcpHost}`;
  const targetRepo = `${targetPrefix}/${gcpProjectID}/${projectName}`;

  const fileVersion = existsSync(versionFile)
    ? readFileSync(versionFile).toString().trim()
    : '';
  const version = `${
    process.env.version ||
    options.version ||
    fileVersion ||
    packageJson.version ||
    'latest'
  }`;
  const target = `${targetRepo}:${version}`;

  const serviceAcc = options.serviceAcc;
  const region = options.region;

  try {
    // Deploy to Cloud Run
    await gcloud.deploy(projectName, target, region, serviceAcc);

    // Clean up other images
    const digests = readFileSync('digests.env').toString();
    const digest = digests
      .split('\n')
      .find((line) => line.match(`DIGEST_${projectName.toUpperCase()}`))
      ?.split('=')[1];
    if (!digest) throw new Error(`No digest found for image ${targetRepo}!`);
    await gcloud.pruneAll(targetRepo, digest);

    return { success: true };
  } catch (error) {
    if (error) console.error(error);
    return { success: false };
  }
}
