const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': async (ctx) => [
      2,
      'always',
      [
        ...(await getProjects(
          ctx,
          ({ name, projectType }) => !name.includes('e2e')
        )),
        'k8s',
        'repo',
        'docs',
      ],
    ],
  },
};
