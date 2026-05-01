/**
 * Converts various image host URLs to direct download links where necessary.
 * Specifically handles Google Drive "view" links.
 */
export function getDirectImageUrl(url: string): string {
  if (!url) return '';

  // Handle Google Drive links
  if (url.includes('drive.google.com')) {
    // Extract file ID
    // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Format 2: https://drive.google.com/open?id=FILE_ID
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
  }

  return url;
}
