export function createBreadcrumb(url: string) {
  if (!url) {
    return 'Home';
  }

  const urlParts = url
    .trim()
    .split('/')
    .filter((part) => !!part);
  const capitalizedParts = urlParts.map((part) => {
    return part
      .replaceAll('-', ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });

  if (
    capitalizedParts &&
    capitalizedParts.length > 0 &&
    capitalizedParts[0].toLowerCase() !== 'home'
  ) {
    capitalizedParts.unshift('Home');
  }
  return capitalizedParts.join(' > ');
}
