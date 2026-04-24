const avatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
]

export function getRandomAvatar() {
  const index = Math.floor(Math.random() * avatars.length)
  return avatars[index]
}
