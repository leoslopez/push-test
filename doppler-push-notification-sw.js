/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./public/doppler-push-notification-sw.js ***!
  \************************************************/
console.log("Service Worker Works");

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  // force this SW not to be put on 'waiting', but to go directly to 'activate'
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  // takes immediate control of all open pages without waiting for the user to close them
  event.waitUntil(clients.claim());
});

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

self.addEventListener("push", (event) => {
  console.log("Notification Received");

  const payload = event.data.json();
  console.log(payload);

  const options = {
    body: payload.body,
    image: payload.image || null,
    icon: payload.icon || null,
    data: payload.data || {},
    actions: payload.actions || [],
  };

  const asyncTasks = [];

  asyncTasks.push(self.registration.showNotification(payload.title, options));

  // If receivedEventEndpoint is defined, make a fetch request to that endpoint
  if (payload.data?.receivedEventEndpoint) {
    const endpointUrl = payload.data.receivedEventEndpoint;
    asyncTasks.push(registerEvents(endpointUrl, "received"));
  }

  if (asyncTasks.length > 0) {
    event.waitUntil(Promise.all(asyncTasks));
  }
});

self.addEventListener("notificationclick", (event) => {
  // Prevent the browser closing the notification automatically
  event.notification.close();

  const asyncTasks = [];
  const { data } = event.notification;

  console.log(data);

  if (event.action) {
    // when user clicks one of the actions
    console.log("Action clicked:", event.action);

    const actionLink = data?.actionClickLinks?.[event.action];
    if (actionLink) {
      asyncTasks.push(clients.openWindow(actionLink));
    }

    const actionEndpoint = data?.actionEventEndpoints?.[event.action];
    if (actionEndpoint) {
      asyncTasks.push(registerEvents(actionEndpoint, `action-${event.action}`));
    }
  } else {
    // when user clicks the notification body
    if (data?.clickLink) {
      asyncTasks.push(clients.openWindow(data.clickLink));
    }

    if (data?.clickedEventEndpoint) {
      asyncTasks.push(registerEvents(data.clickedEventEndpoint, "clicked"));
    }
  }

  if (asyncTasks.length > 0) {
    event.waitUntil(Promise.all(asyncTasks));
  }
});

/******/ })()
;