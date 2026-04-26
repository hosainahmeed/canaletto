export const convertStatus = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'Open'
    case 'PARTIALLY_PAID':
      return 'Partially Paid'
    case 'PAID':
      return 'Paid'
    default:
      return status
  }
}