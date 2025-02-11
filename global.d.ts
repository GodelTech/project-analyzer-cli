declare type Dependency = {
  name: string;
  minVersion?: string;
  maxVersion?: string;
  versions: string[];
};

declare type AnalyserReport = {
  projectName: string;
  reportDate: string;
  dependencies: Dependency[];
};
