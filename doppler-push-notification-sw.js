console.log('Service Worker Works');

self.addEventListener('push', e => {
    console.log('Notification Received');

    const payload = e.data.json();
    console.log(payload)

    const options = {
        body: payload.body,
        image: payload.image || null,
        icon: payload.icon || null,
        data: payload.data || {},
    };
    console.log(options);

    self.registration.showNotification(
        payload.title,
        options,  
    );

    // TODO: it could invoke the API to inform messageId reception by the browser
    if (payload.data?.messageId) {
        console.log(`pushing messageId: ${payload.data.messageId}`);
    }
});

self.addEventListener('notificationclick', (event) => {
    // Prevent the browser closing the notification automatically
    event.notification.close();

    console.log(event.notification.data);
    // Perform some action based on the notification click
    // For example, redirect to a specific URL
    if (event.notification.data?.clickLink) {
        const url = event.notification.data.clickLink;
        event.waitUntil(
            clients.openWindow(url)
        );
    }

    // TODO: it could invoke the API to inform messageId clicked
    if (event.notification.data?.messageId) {
        console.log(`clicking messageId: ${event.notification.data.messageId}`);
    }
});
