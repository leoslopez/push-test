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
  
  self.addEventListener("push", (event) => {
    console.log("Notification Received");
  
    const payload = event.data.json();
    console.log(payload);
  
    const options = {
      body: payload.body,
      image: payload.image || null,
      icon: payload.icon || null,
      data: payload.data || {},
    };
  
    self.registration.showNotification(payload.title, options);
  
    // If receivedEventEndpoint is defined, make a fetch request to that endpoint
    if (payload.data?.receivedEventEndpoint) {
      const endpointUrl = payload.data.receivedEventEndpoint;
      event.waitUntil(registerEvents(endpointUrl, "received"));
    }
  });
  
  self.addEventListener("notificationclick", (event) => {
    // Prevent the browser closing the notification automatically
    event.notification.close();
  
    console.log(event.notification.data);
  
    // Redirect to a specific URL
    if (event.notification.data?.clickLink) {
      const url = event.notification.data.clickLink;
      event.waitUntil(clients.openWindow(url));
    }
  
    // If clickedEventEndpoint is defined, make a fetch request to that endpoint
    if (event.notification.data?.clickedEventEndpoint) {
      const endpointUrl = event.notification.data.clickedEventEndpoint;
      event.waitUntil(registerEvents(endpointUrl, "clicked"));
    }
  });
  
  /******/ })()
  ;