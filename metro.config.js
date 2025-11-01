const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add xlsx and image extensions to asset extensions
config.resolver.assetExts.push('xlsx', 'jpg', 'jpeg', 'png', 'webp');

module.exports = config;


