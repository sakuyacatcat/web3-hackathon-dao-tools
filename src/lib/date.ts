export const remainingDate = (unixTime: number): string => {
  const diff = unixTime - new Date().getTime()

  if (diff <= 0) {
    return '00:00:00'
  }

  const hours = Math.floor(diff / 1000 / 60 / 60)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
