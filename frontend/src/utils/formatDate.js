export const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date)) return '';

  const options = {
    year: 'numeric',
    month: 'short', // e.g., Jan, Feb, Mar
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}