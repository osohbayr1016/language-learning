const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const rootNodeModules = path.resolve(workspaceRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// 1. Keep Expo defaults + watch workspace packages (monorepo)
config.watchFolders = [...new Set([...(config.watchFolders ?? []), workspaceRoot])];

// 2. pnpm + node-linker=hoisted: deps live in repo root — check root first
config.resolver.nodeModulesPaths = [
  rootNodeModules,
  path.resolve(projectRoot, 'node_modules'),
];

// 3. Web / SSR bundling still resolves from package dir — force hoisted native modules
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  'expo-speech': path.join(rootNodeModules, 'expo-speech'),
};

module.exports = config;
