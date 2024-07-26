console.log('Service Worker Works (v1.0.0)');

function registerEvents(endpointUrl) {
    return fetch(endpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            // TODO: handle logs properly
            console.error('API response was not ok:', response.statusText);
        }
    })
    .catch(error => {
        // TODO: handle logs properly
        console.error('Failed to send click event to endpoint:', error);
    });
}

self.addEventListener('push', (event) => {
    console.log('Notification Received');

    const payload = event.data.json();
    console.log(payload);

    const options = {
        body: payload.body,
        image: payload.image || null,
        icon: payload.icon || null,
        data: payload.data || {},
    };
    console.log(options);

    self.registration.showNotification(payload.title, options);

    // If receivedEventEndpoint is defined, make a fetch request to that endpoint
    if (payload.data?.receivedEventEndpoint) {
        const endpointUrl = payload.data.receivedEventEndpoint;
        event.waitUntil(registerEvents(endpointUrl));
    }
});

self.addEventListener('notificationclick', (event) => {
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
        event.waitUntil(registerEvents(endpointUrl));
    }
});
