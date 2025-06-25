/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./public/doppler-push-notification-sw.js ***!
  \************************************************/
console.log("Service Worker Works");

function registerEvents(endpointUrl, eventType) {
  return fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        // TODO: handle logs properly
        console.error(
          `API response was not ok: ${response.statusText}\nEventType:${eventType}\nEndpoint: ${endpointUrl}`,
        );
      }
    })
    .catch((error) => {
      // TODO: handle logs properly
      console.error(
        `Failed registering event: ${error}\nEventType:${eventType}\nEndpoint: ${endpointUrl}`,
      );
    });
}

// Triggered when the service worker code changes, or when it is re-registered (done automatically by the browser)
self.addEventListener("install", (event) => {
  console.log("sw - install...");
  // Forces the new version of the SW pass to activate immediately
  self.skipWaiting();
});

// Triggered after install (done automatically by the browser)
self.addEventListener("activate", (event) => {
  console.log("sw - activate...");
  // Takes control of open tabs upon activation
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  console.log("Notification Received");

  const payload = event.data.json();
  console.log(payload);

  const options = {
    body: payload.body,
    image: payload.image || null,
    icon: payload.icon || null,
    badge:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjwVUff7yGWPZZ9rWNDR_JuvrRXQe3Q4N_2A&s",
    data: payload.data || {},
    actions: [
      {
        action: "accept_action",
        title: "Ver ofertas",
        icon: "https://previews.123rf.com/images/mikegreen/mikegreen1712/mikegreen171200076/92493321-precio-de-descuento-pixel-icono-de-silueta-de-vector-perfecto-48x48-listo-para-cuadr%C3%ADcula-24x24-para.jpg", // ícono del botón
      },
      {
        action: "cancel_action",
        title: "Salir",
        icon: "https://cdn-icons-png.flaticon.com/512/66/66847.png", // ícono del botón
      },
    ],
  };

  const promises = [];

  // Show notification (ensure SW stays alive)
  promises.push(self.registration.showNotification(payload.title, options));

  // If receivedEventEndpoint is defined, make a fetch request to that endpoint
  if (payload.data?.receivedEventEndpoint) {
    const endpointUrl = payload.data.receivedEventEndpoint;
    promises.push(registerEvents(endpointUrl, "received"));
  }

  // Wait for all
  event.waitUntil(Promise.all(promises));
});

self.addEventListener("notificationclick", (event) => {
  // Prevent the browser closing the notification automatically
  event.notification.close();

  console.log(event.notification.data);

  // Prepare promises
  const promises = [];

  if (
    event.action === "accept_action" &&
    event.notification.data?.acceptActionLink
  ) {
    promises.push(clients.openWindow(event.notification.data.acceptActionLink));
  } else if (
    event.action === "cancel_action" &&
    event.notification.data?.cancelActionLink
  ) {
    promises.push(clients.openWindow(event.notification.data.cancelActionLink));
  } else if (
    event.action !== "accept_action" &&
    event.action !== "cancel_action" &&
    event.notification.data?.clickLink
  ) {
    promises.push(clients.openWindow(event.notification.data.clickLink));
  }

  // If clickedEventEndpoint is defined, make a fetch request to that endpoint
  if (event.notification.data?.clickedEventEndpoint) {
    const endpointUrl = event.notification.data.clickedEventEndpoint;
    promises.push(registerEvents(endpointUrl, "clicked"));
  }

  // Wait for all
  event.waitUntil(Promise.all(promises));
});

/******/ })()
;