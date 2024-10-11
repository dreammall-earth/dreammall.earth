export const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
