const colorPalette = [
  "#1B6CA8",
  "#27AE60",
  "#E74C3C",
  "#F39C12",
  "#9B59B6",
  "#E91E63",
  "#00ACC1",
  "#FF5722",
];

export const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";

  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return `${first}${last}`.toUpperCase();
};

export const getColorFromName = (name: string) => {
  if (!name) return colorPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % colorPalette.length;
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
};
