(()=>{function n(n,t){return fetch(n,{method:"POST",headers:{"Content-Type":"application/json"}}).then((i=>{i.ok||console.error(`API response was not ok: ${i.statusText}\nEventType:${t}\nEndpoint: ${n}`)})).catch((i=>{console.error(`Failed registering event: ${i}\nEventType:${t}\nEndpoint: ${n}`)}))}console.log("Service Worker Works"),self.addEventListener("push",(t=>{console.log("Notification Received");const i=t.data.json();console.log(i);const o={body:i.body,image:i.image||null,icon:i.icon||null,data:i.data||{}};if(self.registration.showNotification(i.title,o),i.data?.receivedEventEndpoint){const o=i.data.receivedEventEndpoint;t.waitUntil(n(o,"received"))}})),self.addEventListener("notificationclick",(t=>{if(t.notification.close(),console.log(t.notification.data),t.notification.data?.clickLink){const n=t.notification.data.clickLink;t.waitUntil(clients.openWindow(n))}if(t.notification.data?.clickedEventEndpoint){const i=t.notification.data.clickedEventEndpoint;t.waitUntil(n(i,"clicked"))}}))})();