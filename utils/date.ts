export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  const date = new Date(`${year}-${month}-${day}`);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};