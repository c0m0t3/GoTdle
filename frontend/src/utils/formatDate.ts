export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return ' - ';
  const date = new Date(dateString);
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatDateShort = (dateString: string | null | undefined) => {
  if (!dateString) return ' - ';
  const date = new Date(dateString);
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getBerlinDateString = (date: Date = new Date()) => {
  return date.toLocaleString('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
