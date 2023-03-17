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
  prompt: {
    settings: {
      enableMultipleScopes: true,
    },
    messages: {},
    questions: {
      //   type: {
      //     description: 'please input type:',
      //   },
      //   scope: {
      //     description:
      //       '(rc file) Select the app or library affected by this change',
      //     messages: {
      //       'test-foo': 'test-bar',
      //     },
      //     enum: {
      //       foo: {
      //         description: 'foooo',
      //         title: 'foooooo',
      //       },
      //     },
      //   },
    },
  },
  // . . .
};
