import * as fs from 'fs';
import * as semver from 'semver';

export default (
  projectName: string,
  selectedPackages: string[],
): AnalyserReport => {
  const dependencies: Record<string, string[]> = {};

  for (const packagePath of selectedPackages) {
    console.log(`Collecting packages information for ${packagePath}...`);

    const packageContent = JSON.parse(fs.readFileSync(packagePath).toString());

    for (const dependencyName of Object.keys(
      packageContent?.dependencies ?? {},
    )) {
      const dependencySet = new Set(dependencies[dependencyName]);
      dependencySet.add(
        packageContent.dependencies[dependencyName] ?? 'unknown',
      );
      dependencies[dependencyName] = Array.from(dependencySet);
    }

    for (const dependencyName of Object.keys(
      packageContent?.devDependencies ?? {},
    )) {
      const dependencySet = new Set(dependencies[dependencyName]);
      dependencySet.add(
        packageContent.devDependencies[dependencyName] ?? 'unknown',
      );
      dependencies[dependencyName] = Array.from(dependencySet);
    }
  }

  const resultDependencies: Dependency[] = [];

  for (const dependencyName of Object.keys(dependencies)) {
    const sortedVersions = semver.sort(
      dependencies[dependencyName].map((version) =>
        semver.valid(semver.coerce(version)),
      ),
    );

    resultDependencies.push({
      name: dependencyName,
      versions: dependencies[dependencyName], // raw versions
      minVersion: sortedVersions?.[0],
      maxVersion: sortedVersions?.[sortedVersions.length - 1],
    });
  }

  return {
    projectName,
    reportDate: new Date().toLocaleDateString(),
    dependencies: resultDependencies,
  };
};
