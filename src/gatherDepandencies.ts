import * as fs from 'fs';

export default (
  projectName: string,
  selectedPackages: string[],
): AnalyserReport => {
  const result: AnalyserReport = {
    name: projectName,
    dependencies: {},
  };

  for (const packagePath of selectedPackages) {
    console.log(`Collecting packages information for ${packagePath}...`);

    const packageContent = JSON.parse(fs.readFileSync(packagePath).toString());

    for (const dependencyName of Object.keys(
      packageContent?.dependencies ?? {},
    )) {
      const dependencySet = new Set(result.dependencies[dependencyName]);
      dependencySet.add(
        packageContent.dependencies[dependencyName] ?? 'unknown',
      );
      result.dependencies[dependencyName] = Array.from(dependencySet);
    }

    for (const dependencyName of Object.keys(
      packageContent?.devDependencies ?? {},
    )) {
      const dependencySet = new Set(result.dependencies[dependencyName]);
      dependencySet.add(
        packageContent.devDependencies[dependencyName] ?? 'unknown',
      );
      result.dependencies[dependencyName] = Array.from(dependencySet);
    }
  }

  return result;
};
