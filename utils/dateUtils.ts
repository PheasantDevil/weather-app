export const formatDateTime = (
  dateTime: string | number,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date =
    typeof dateTime === 'string'
      ? new Date(dateTime)
      : new Date(dateTime * 1000);
  return date.toLocaleString(locale, options);
};

export const formatDate = (
  dateTime: string | number,
  locale: string
): string => {
  return formatDateTime(dateTime, locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (
  dateTime: string | number,
  locale: string
): string => {
  return formatDateTime(dateTime, locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};
