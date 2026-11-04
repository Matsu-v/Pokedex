// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite imports a .wasm file on web. Without this the web export no longer bundles.
config.resolver.assetExts.push('wasm');

module.exports = config;
