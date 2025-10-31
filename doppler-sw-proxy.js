// URL con versionado opcional para forzar actualizaciones si cambió el SW remoto
const remoteSWUrl = 'https://hubint.fromdoppler.com/public/sw-remote.js?v=1';

try {
  importScripts(remoteSWUrl);
  console.log('SW remoto cargado desde', remoteSWUrl);
} catch (err) {
  console.error('Error cargando SW remoto:', err);
}
