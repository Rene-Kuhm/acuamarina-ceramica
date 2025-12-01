const { execSync } = require('child_process');

const port = process.env.PORT || 3000;
const command = `next start -H 0.0.0.0 -p ${port}`;

console.log(`Starting Next.js on port ${port}...`);
execSync(command, { stdio: 'inherit' });
