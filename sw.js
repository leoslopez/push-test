console.log('Service Worker Works');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data)
    console.log('Notification Received');
    self.registration.showNotification(data.title, {
        body: data.message,
        data: data.messageId,
    });

    // TODO: it could invoke the API to inform messageId reception by the browser
    console.log(`pushing messageId: ${data.messageId}`);
});

self.addEventListener('notificationclick', (event) => {
    // Prevent the browser closing the notification automatically
    event.notification.close();

    // Perform some action based on the notification click
    // For example, redirect to a specific URL
    const url = 'https://ejemplo.com';
    event.waitUntil(
        clients.openWindow(url)
    );

    // TODO: it could invoke the API to inform messageId clicked
    console.log(`clicking messageId: ${event.notification.data}`);
});
