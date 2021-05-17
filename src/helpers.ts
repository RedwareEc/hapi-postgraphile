export const toInt = (v: unknown, def = 0): number => {
  switch (typeof v) {
    case 'string':
      return parseInt(v, 0);
    case 'number':
      return v;
    default:
      return def;
  }
};
