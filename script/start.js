import child_process from 'child_process';

const developer = process.argv[2];

child_process.exec(
  `cross-env __DEVELOPER__=${developer} vite --config vite/vite.development.ts`,
  (error, stdout, stderr) => {
    if (error) {
      console.error('exec error: ', error);
      return;
    }
  },
);
