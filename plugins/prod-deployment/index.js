module.exports = {
  onPreBuild: async ({utils: {build, run}}) => {
    console.log('Evaluating for publish');

    if (process.env.CONTEXT !== 'production') {
      try {
        const {stdout, stderr, exitCode} = await run('git', ['fetch']);
        console.log(stdout);
        await run('git', ['describe', '--tags', '--exact-match']);
      } catch (error) {
        if (error.exitCode !== 0)
          build.cancelBuild('Bulid is not tagged for release');
      }
    } else {
      console.log('Not a production build');
    }

    if (process.env.CONTEXT === 'branch-preview') {
      if (process.env.BRANCH !== 'master') {
        build.cancelBuild('Will only build branch previews if master');
      }
    }
  },
};
