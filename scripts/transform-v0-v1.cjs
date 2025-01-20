if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}
// Read the file and print its contents.
const fs = require('fs');
const semver = require('semver');
const filename = process.argv[2];

fs.readFile(filename, 'utf8', function (err, data) {
  if (err) throw err;
  const json = JSON.parse(data);
  const report = {
    projectName: json.name,
    reportDate: null,
    dependencies: Object.keys(json.dependencies).map((dependencyName) => {
      const sortedVersions = semver.sort(
        json.dependencies[dependencyName].map((version) =>
          semver.valid(semver.coerce(version)),
        ),
      );

      return {
        name: dependencyName,
        versions: json.dependencies[dependencyName], // raw versions
        minVersion: sortedVersions?.[0],
        maxVersion: sortedVersions?.[sortedVersions.length - 1],
      };
    }),
  };

  const extIndex = process.argv[2].indexOf('.json');
  let fileName = process.argv[2];
  if (extIndex !== -1) {
    fileName = fileName.slice(0, extIndex) + '-v1.json';
  } else {
    // in case it's not a file with json extension
    fileName = fileName + '-v1.json';
  }

  fs.writeFileSync(fileName, JSON.stringify(report, null, 2));
});
