/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./public/doppler-push-notification-sw.js ***!
  \************************************************/
// doppler-push-notification-sw.js — Doppler SW Proxy Loader
// ==========================================================
// Este archivo se hospeda en el dominio del cliente.
// Su único propósito es cargar el Service Worker real
// desde los servidores de Doppler, sin que el cliente
// deba volver a actualizar este archivo en el futuro.

const remoteSwUrl =  true ?
  "https://hubint.fromdoppler.com/public/sw/latest/doppler-remote-sw.js" : 0;

const proxyVersion =  true ?
  "1.0.0" : 0;

try {
  importScripts(remoteSwUrl);
  console.log(`[Doppler SW Proxy v${proxyVersion}] Remote SW loaded from: ${remoteSwUrl}`);
} catch (err) {
  console.error(
    `[Doppler SW Proxy v${proxyVersion}] Failed to load remote SW:`,
    err
  );
}

/******/ })()
;