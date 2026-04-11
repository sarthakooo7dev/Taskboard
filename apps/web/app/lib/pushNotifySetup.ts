export async function setupPush(userId: string) {
  const permission = await Notification.requestPermission()

  if (permission !== 'granted') {
    console.log('❌ Push permission denied')
    return
  }

  const vapidKey = urlBase64ToUint8Array(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  )
  await navigator.serviceWorker.register('/sw.js')
  // 🔥 wait for activation (VERY IMPORTANT)
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidKey,
  })

  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      subscription,
    }),
  })

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)

    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)

    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
  }
}
