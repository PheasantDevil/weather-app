export const formatDateTime = (
  dateTime: string | number,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : new Date(dateTime * 1000);
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatDate = (
  dateTime: string | number,
  locale: string
): string => {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : new Date(dateTime * 1000);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (
  dateTime: string | number,
  locale: string
): string => {
  if (typeof dateTime === 'string' && dateTime.length === 5) {
    // "HH:mm" 形式の場合はそのまま返す
    return dateTime;
  }

  const date = typeof dateTime === 'string' ? new Date(dateTime) : new Date(dateTime * 1000);
  
  if (isNaN(date.getTime())) {
    // 無効な日付の場合は空文字列を返す
    console.error(`Invalid date: ${dateTime}`);
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
