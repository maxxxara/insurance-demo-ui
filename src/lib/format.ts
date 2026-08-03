export const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} ბ`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} კბ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} მბ`;
};

export const extensionOf = (name: string) => {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot).toLowerCase() : '';
};
