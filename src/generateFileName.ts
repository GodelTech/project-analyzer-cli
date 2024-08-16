import { getFormattedDate } from './date';

export default (projectName?: string): string => {
  const date = getFormattedDate();

  const projectNameToFileName =
    projectName?.split(' ').join('-').toLowerCase() || 'report';

  return `${projectNameToFileName}-${date}.json`;
};
