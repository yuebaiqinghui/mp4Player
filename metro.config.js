const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const config = {
    server: {
        port: 8081,
        host: '0.0.0.0',
    },
    watchFolders: [],
    resolver: {
        // extraNodeModules: {
        //     'node:stream': require.resolve('stream-browserify'),
        //     'node:buffer': require.resolve('buffer'),
        //   },
        // 添加 mjs 扩展名
        sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
