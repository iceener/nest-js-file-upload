const name = process.env.APP_NAME || 'uploader';
export const apps = [
  {
    name,
    script: './src/main.js',
    // We need dotenv but from the command line (env-cmd cannot do this :( )
    node_args: '-r dotenv/config',
  },
];
