const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Exclude macOS AppleDouble metadata files (starting with ._) from bundling
if (config.resolver.blockList) {
  if (Array.isArray(config.resolver.blockList)) {
    config.resolver.blockList.push(/.*\/\._.*/);
  } else {
    config.resolver.blockList = [config.resolver.blockList, /.*\/\._.*/];
  }
} else {
  config.resolver.blockList = [/.*\/\._.*/];
}

module.exports = withNativeWind(config, { input: "./src/global.css" });
