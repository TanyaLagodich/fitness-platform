export const getYoutubeThumbnail = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  const match =
    trimmed.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/) ||
    trimmed.match(/youtu\.be\/([0-9A-Za-z_-]{11})/);
  const id = match?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

export const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  const match =
    trimmed.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/) ||
    trimmed.match(/youtu\.be\/([0-9A-Za-z_-]{11})/);
  const id = match?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : '';
};

