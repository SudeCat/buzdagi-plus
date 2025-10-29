const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add xlsx to asset extensions so Metro can serve Excel files
config.resolver.assetExts.push('xlsx');

module.exports = config;

