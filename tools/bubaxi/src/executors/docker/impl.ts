import { ExecutorContext } from '@nrwl/devkit';
import { docker, packageJson } from '../common/util';
import { appendFileSync } from 'fs';

export interface DockerExecutorOptions {
  gcpProject: string;
  context?: string;
  dockerfile?: string;
  remoteHost: string;
  gcpHost: string;
  version: string;
  build: boolean;
  push: boolean;
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
    if (options.build || !options.push) {
      // Build from dist/apps
      await docker.build(dockerfile, remoteImage, {
        BUILD_PATH: buildPath
      });
    }

    if (options.push || !options.build) {
      // tag latest and gcr
      await docker.tag(remoteImage, remoteLatest);
      await docker.tag(remoteImage, gcpImage);

      // push all tags
      await Promise.all([
        docker.push(remoteImage),
        docker.push(gcpImage)
      ]);
      await docker.push(remoteLatest);

      // get gcr digest
      const digest = await docker.getDigest(gcpImage);
      appendFileSync('digests.env', `DIGEST_${projectName.toUpperCase()}=${digest}\n`);
    }

    return { success: true };
  } catch (error) {
    if (error) console.error(error);
    return { success: false };
  }
}
