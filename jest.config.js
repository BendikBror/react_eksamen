module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // Use 'jsdom' if you need a browser-like environment
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
  };
  