const excludeDependencies = (
  report: AnalyserReport,
  depsListToExclude: string[] = [],
): AnalyserReport => {
  return {
    ...report,
    dependencies: Object.keys(report.dependencies).reduce(
      (acc: Record<string, string[]>, depName: string) => {
        if (!depsListToExclude.includes(depName)) {
          acc[depName] = report.dependencies[depName];
        }

        return acc;
      },
      {},
    ),
  };
};

export default excludeDependencies;
