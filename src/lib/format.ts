export const shortName = (text: string, max: number) => {
  const t = text.split(',')[0].trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
};
