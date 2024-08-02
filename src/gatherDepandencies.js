const fs = require('fs');

module.exports = (projectName, selectedPackages) => {
  const result = {
    name: projectName,
    dependencies: {},
  };

  for (const packagePath of selectedPackages) {
    console.log(`Collecting packages information for ${packagePath}...`);

    const packageContent = JSON.parse(fs.readFileSync(packagePath));

    for (const dependencyName of Object.keys(
      packageContent?.dependencies ?? {},
    )) {
      result.dependencies[dependencyName] = new Set(
        result.dependencies[dependencyName],
      );
      result.dependencies[dependencyName].add(
        packageContent.dependencies[dependencyName] ?? 'unknown',
      );
      result.dependencies[dependencyName] = Array.from(
        result.dependencies[dependencyName],
      );
    }

    for (const dependencyName of Object.keys(
      packageContent?.devDependencies ?? {},
    )) {
      result.dependencies[dependencyName] = new Set(
        result.dependencies[dependencyName],
      );
      result.dependencies[dependencyName].add(
        packageContent.devDependencies[dependencyName] ?? 'unknown',
      );
      result.dependencies[dependencyName] = Array.from(
        result.dependencies[dependencyName],
      );
    }
  }

  return result;
};
