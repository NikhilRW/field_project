const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
};
