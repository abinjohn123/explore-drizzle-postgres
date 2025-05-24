export const getRedirectUrl = () => {
  // TODO: set these before prod
  const environment = import.meta.env.VITE_ENVIRONMENT;
  const envRedirectUrl = import.meta.env.VITE_REDIRECT_URL;

  // If explicitly set and not 'auto', use it
  if (envRedirectUrl && envRedirectUrl !== 'auto') {
    return envRedirectUrl;
  }

  // For local development, use current origin
  if (
    environment === 'local' ||
    window.location.hostname.includes('192.168') ||
    window.location.hostname === 'localhost'
  ) {
    return `${window.location.origin}/`;
  }

  // Default fallback
  return `${window.location.origin}/`;
};
