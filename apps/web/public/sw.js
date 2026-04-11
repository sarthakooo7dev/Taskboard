// event.data comes from backend push
self.addEventListener('push', function (event) {
  const data = event.data.json()

  self.registration.showNotification(data.title, {
    body: data.body, // 🔥 CRITICAL FIX
    tag: Date.now().toString(), // ensures uniqueness

    // optional but useful
    renotify: true,
  })
})
