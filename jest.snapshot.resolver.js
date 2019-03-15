module.exports = {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    return (
      testPath.replace("test/lib/", "test/__snapshots__/") + snapshotExtension
    );
  },

  // resolves from snapshot to test path
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    return snapshotFilePath
      .replace("test/__snapshots__/", "test/lib/")
      .slice(0, -snapshotExtension.length);
  },

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: "/some/test/lib/example.test.js"
};

//module.exports.resolveSnapshotPath(module.exports.testPathForConsistencyCheck);
