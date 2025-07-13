const projectName = process.env.PROJECT_NAME;
const allVars = process.env.ALL_VARS_JSON ? JSON.parse(process.env.ALL_VARS_JSON) : {};
const allSecrets = process.env.ALL_SECRETS_JSON ? JSON.parse(process.env.ALL_SECRETS_JSON) : {};

const allVarsAndSecrets = { ...allVars, ...allSecrets };

const envVars = {};
const prefix = `${projectName.toUpperCase().replaceAll('-', '_')}__`;

Object.keys(allVarsAndSecrets)
  .filter(key => key.startsWith(prefix))
  .forEach(key => {
    const cleanKey = key.replace(prefix, '');
    envVars[cleanKey] = allVarsAndSecrets[key];
  });

// Write environment variables to a .env file for Terraform
const fs = require('fs');

const envFileContent = `TF_VAR_env_vars=${JSON.stringify(envVars)}`;

// Write to .env file
fs.writeFileSync('.env', envFileContent);

console.log(`Written ${Object.keys(envVars).length} environment variables to .env file`);
