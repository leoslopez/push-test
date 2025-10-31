const remoteSWUrl = 'https://hubint.fromdoppler.com/public/sw-remote.js';

try {
  importScripts(remoteSWUrl);
  console.log('SW remoto cargado desde', remoteSWUrl);
} catch (err) {
  console.error('Error cargando SW remoto:', err);
}
