console.log('Service Worker Works');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data)
    console.log('Notification Received');
    self.registration.showNotification(
        data.title,
        {
            body: data.body,
            image: 'https://png.pngtree.com/element_origin_min_pic/16/08/05/1057a3fae73b91b.jpg',
            icon: 'https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png',
            data: data.data && data.data.messageId,
        }
    );

    // TODO: it could invoke the API to inform messageId reception by the browser
    if (data.data?.messageId) {
        console.log(`pushing messageId: ${data.data.messageId}`);
    }
});

self.addEventListener('notificationclick', (event) => {
    // Prevent the browser closing the notification automatically
    event.notification.close();

    // Perform some action based on the notification click
    // For example, redirect to a specific URL
    const url = 'https://www.google.com';
    event.waitUntil(
        clients.openWindow(url)
    );

    // TODO: it could invoke the API to inform messageId clicked
    console.log(`clicking messageId: ${event.notification.data}`);
});
