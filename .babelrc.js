module.exports = {
    plugins: [
      'babel-plugin-transform-typescript-metadata',
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      '@babel/plugin-proposal-class-properties',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          shippedProposals: true,
          targets: {node: 8},
        },
      ],
      '@babel/preset-typescript',
    ]
  };