import { exec, spawn } from 'child_process';
import * as pkgJson from '../../../package.json';
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
  const spawnName = `${cmd}${args ? ` ${args.join(' ')}` : ''}`;
  console.info(`Spawning ${spawnName}`);
  const start = Date.now();

  const timestamp = (data: string | any, logger: (str: string) => void) => {
    const time = (Date.now() - start).toString().padStart(6, ' ');
    const line = `${time}ms: ${typeof data === 'string' ? data : data.toString()}`;
    logger(line);
  };

  return new Promise<void>((resolve, reject) => {
    const process = spawn(cmd, args);
    process.stdout.on('data', data => timestamp(data, console.info));
    process.stderr.on('data', data => timestamp(data, console.error));
    process.on('exit', code => {
      if (code) console.error(`Process ended with status code ${code}`);
      const time = Date.now() - start;
      console.log(`Spawn ${spawnName} took ${time}ms`);
      code ? reject() : resolve();
    });
    process.on('error', error => {
      const time = Date.now() - start;
      console.log(`Spawn ${spawnName} error took ${time}ms`);
      reject(error);
    });
  });
}

export const docker = {
  build(dockerfile: string, tag: string, args: { [key: string]: string } = { }) {
    const buildArgs: string[] = [ ];
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
      `docker`, [ 'push', '--quiet', image ]
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
    console.info(`Will delete all ${image} without digest ${digest}`);
    const { stdout, stderr } = await wrappedExec(`gcloud container images list-tags ${image} --filter="digest != ${digest}" --format=json`);
    const tags = JSON.parse(stdout);
    if (!tags.length) console.info(`Nothing to delete`);
    for (const tag of tags) {
      await gcloud.pruneOne(`${image}@${tag.digest}`);
    }
  }
};
