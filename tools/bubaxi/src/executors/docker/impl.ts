import { ExecutorContext } from '@nrwl/devkit';
import { docker, packageJson } from '../common/util';

export interface DockerExecutorOptions {
  gcpProject: string;
  context?: string;
  dockerfile?: string;
  remoteHost: string;
  gcpHost: string;
  version: string;
}

export default async function dockerExecutor(
  options: DockerExecutorOptions,
  context: ExecutorContext
) {
  console.info(`Executing "docker"...`);
  const { projectName, workspace } = context;
  const gcpProjectID = process.env.GCP_PROJECT || options.gcpProject;
  const project = workspace.projects[projectName];

  const buildPath = options.context || project?.targets.build?.options?.outputPath || `dist/apps/${projectName}`;
  const dockerfile = options.dockerfile || `${project ? `${project.root}/Dockerfile` : `apps/${projectName}/Dockerfile`}`;

  const remotePrefix = process.env.DOCKER_HUB_REMOTE_REPO || options.remoteHost;
  const remoteRepo = `${remotePrefix ? `${remotePrefix}/` : ''}${gcpProjectID}_${projectName}`;

  const gcpPrefix = `${process.env.GCP_REGISTRY_HOST || options.gcpHost}`;
  const gcpRepo = `${gcpPrefix}/${gcpProjectID}/${projectName}`;

  const version = `${process.env.version || options.version || packageJson.version || 'latest'}`;
  const remoteImage = `${remoteRepo}:${version}`;
  const remoteLatest = `${remoteRepo}:latest`;
  const gcpImage = `${gcpRepo}:${version}`;

  try {
    // Build from dist/apps
    await docker.build(dockerfile, remoteImage, {
      BUILD_PATH: buildPath
    });

    // tag latest and gcr
    await docker.tag(remoteImage, remoteLatest);
    await docker.tag(remoteImage, gcpImage);

    // push all tags
    await docker.push(remoteImage);
    await docker.push(remoteLatest);
    await docker.push(gcpImage);

    return { success: true };
  } catch (error) {
    if (error) console.error(error);
    return { success: false };
  }
}
