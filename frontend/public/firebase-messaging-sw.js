importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

let messaging = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG") {
    firebase.initializeApp(event.data.config);
    messaging = firebase.messaging();
  }
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.notification?.title ?? "Helping Hands";
    const body = payload.notification?.body ?? "";
    const activityId = payload.data?.activityId;

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: "/favicon.png",
        badge: "/favicon.png",
        data: { activityId },
      }),
    );
  } catch {
    const text = event.data.text();
    try {
      const payload = JSON.parse(text);
      const title = payload.notification?.title ?? "Helping Hands";
      const body = payload.notification?.body ?? "";
      const activityId = payload.data?.activityId;

      event.waitUntil(
        self.registration.showNotification(title, {
          body,
          icon: "/favicon.png",
          badge: "/favicon.png",
          data: { activityId },
        }),
      );
    } catch {}
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const activityId = event.notification.data?.activityId;
  if (activityId) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url.includes("/activity/") && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(`/activity/${activityId}`);
          }
        }),
    );
  }
});
