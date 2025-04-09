export function getValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return Array.isArray(acc) && !isNaN(Number(key)) ? acc[Number(key)] : acc[key];
    }
    return undefined;
  }, obj);
}