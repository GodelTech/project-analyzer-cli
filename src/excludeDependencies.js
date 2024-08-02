const excludeDependencies = (report, depsListToExclude = []) => {
  return {
    ...report,
    dependencies: Object.keys(report.dependencies).reduce((acc, depName) => {
      if (!depsListToExclude.includes(depName)) {
        acc[depName] = report.dependencies[depName];
      }

      return acc;
    }, {}),
  };
};

module.exports = excludeDependencies;
