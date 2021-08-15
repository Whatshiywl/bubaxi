import { ExecutorContext } from '@nrwl/devkit';
import { docker, packageJson } from '../common/util';

export interface DockerExecutorOptions {
  gcpProject: string;
  context?: string;
  dockerfile?: string;
  repo: string;
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

  const buildContext = options.context || project?.targets.build?.options?.outputPath || `dist/apps/${projectName}`;
  const dockerfile = options.dockerfile || `${project ? `${project.root}/Dockerfile` : `apps/${projectName}/Dockerfile`}`;

  const repoPrefix = process.env.DOCKER_HUB_REMOTE_REPO || options.repo;
  const repo = `${repoPrefix ? `${repoPrefix}/` : ''}${gcpProjectID}_${projectName}`;

  const version = `${process.env.version || options.version || packageJson.version || 'latest'}`;
  const image = `${repo}:${version}`;
  const latest = `${repo}:latest`;

  try {
    await docker.build(buildContext, dockerfile, image);
    await docker.tag(image, latest);
    await docker.push(image);
    await docker.push(latest);
    return { success: true };
  } catch (error) {
    if (error) console.error(error);
    return { success: false };
  }
}
