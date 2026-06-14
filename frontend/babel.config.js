module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          web: {
            unstable_transformImportMeta: true,
          },
        },
      ],
    ],
    plugins: [["react-native-unistyles/plugin", { root: "src" }]],
  };
};
