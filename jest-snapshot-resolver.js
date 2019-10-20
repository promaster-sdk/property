// We need this so that we can run the compiled tests in lib/ folder but
// have the snapshots written/read from the src/ folder so they can be
// checked into source control
module.exports = {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    // console.log("testPath", testPath);
    return (
      testPath.replace("/lib/", "/src/").replace("__tests__", "__snapshots__") +
      snapshotExtension
    );
  },

  // resolves from snapshot to test path
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    // console.log("snapshotFilePath", snapshotFilePath);
    return snapshotFilePath
      .replace("/src/", "/lib/")
      .replace("__snapshots__", "__tests__")
      .slice(0, -snapshotExtension.length);
  },

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: "some/__tests__/example.test.js"
};
