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
  build(context: string, dockerfile: string, tag: string) {
    return wrappedSpawn(
      `docker`, [ 'build', context, '-f', dockerfile, '-t', tag ]
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

  async getDigest(image: string, version: string) {
    const { stdout: inspectOut } = await wrappedExec(`docker image inspect ${image}:${version}`);
    const inspect = JSON.parse(inspectOut);
    const digest = inspect[0].RepoDigests.find((digest: string) => digest.match(image));
    return digest.substr(image.length + 1);
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

  async pruneAll(image: string, version: string) {
    const digest = await docker.getDigest(image, version);
    if (!digest) throw new Error(`No digest found!`);
    const { stdout, stderr } = await wrappedExec(`gcloud container images list-tags ${image} --filter="digest != ${digest}" --format=json`);
    const tags = JSON.parse(stdout);
    if (!tags.length) console.info(`Nothing to delete`);
    for (const tag of tags) {
      await gcloud.pruneOne(`${image}@${tag.digest}`);
    }
  }
};
