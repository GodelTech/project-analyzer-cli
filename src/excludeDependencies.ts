const excludeDependencies = (
  report: AnalyserReport,
  depsListToExclude: string[] = [],
): AnalyserReport => {
  return {
    ...report,
    dependencies: report.dependencies.filter((dependency) => {
      return !depsListToExclude.includes(dependency.name);
    }),
  };
};

export default excludeDependencies;
