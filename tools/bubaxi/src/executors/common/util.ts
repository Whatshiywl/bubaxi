import { exec, spawn } from 'child_process';
import * as pkgJson from '../../../../package.json';
export const packageJson = pkgJson;

export function wrappedExec(cmd: string) {
  console.info(`Executing ${cmd}`);
  return new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
  });
}

export function wrappedSpawn(cmd: string, args?: readonly string[]) {
  console.info(`Spawning ${cmd} ${args.join(' ')}`);
  return new Promise<void>((resolve, reject) => {
    const docker = spawn(cmd, args);
    docker.stdout.on('data', data => console.log(data.toString()));
    docker.stderr.on('data', data => console.error(data.toString()));
    docker.on('exit', code => {
      if (code) console.error(`Process ended with status code ${code}`);
      code ? reject() : resolve();
    });
    docker.on('error', error => reject(error));
  });
}

export const docker = {
  build(dockerfile: string, tag: string, args: { [key: string]: string } = { }) {
    const buildArgs = [ ];
    Object.keys(args).forEach(key => {
      buildArgs.push(`--build-arg`);
      buildArgs.push(`${key}=${args[key]}`);
    });
    return wrappedSpawn(
      `docker`, [ 'build', '.', '-f', dockerfile, '-t', tag, ...buildArgs ]
    );
  },

  tag(source: string, target: string) {
    return wrappedSpawn(
      `docker`, [ 'tag', source, target ]
    );
  },

  push(image: string) {
    return wrappedSpawn(
      `docker`, [ 'push', image ]
    );
  },

  pull(image: string) {
    return wrappedSpawn(
      `docker`, [ 'pull', image ]
    );
  },

  async getDigest(image: string) {
    const prefix = image.split(':')[0];
    const { stdout: inspectOut } = await wrappedExec(`docker image inspect ${image}`);
    const inspect = JSON.parse(inspectOut);
    const digest = inspect[0].RepoDigests.find((digest: string) => digest.match(prefix));
    return digest.substr(prefix.length + 1);
  }
};

export const gcloud = {
  deploy(service: string, image: string, region: string, serviceAcc: string) {
    return wrappedSpawn(
      `gcloud`, [
        'run', 'deploy',
        service,
        '--service-account', serviceAcc,
        '--image', image,
        '--region', region,
        '--platform', 'managed',
        '--quiet',
        '--allow-unauthenticated',
        '--concurrency', '5',
        '--labels', 'stage=prod'
      ]
    );
  },

  pruneOne(id: string) {
    return wrappedSpawn(
      `gcloud`, [
        'container', 'images', 'delete',
        '--force-delete-tags', '--quiet',
        id
      ]
    );
  },

  async pruneAll(image: string, digest: string) {
    if (!digest) throw new Error(`No digest found for ${image}!`);
    console.info(`Will delete all ${image} without digest ${digest}`);
    const { stdout, stderr } = await wrappedExec(`gcloud container images list-tags ${image} --filter="digest != ${digest}" --format=json`);
    const tags = JSON.parse(stdout);
    if (!tags.length) console.info(`Nothing to delete`);
    for (const tag of tags) {
      await gcloud.pruneOne(`${image}@${tag.digest}`);
    }
  }
};
