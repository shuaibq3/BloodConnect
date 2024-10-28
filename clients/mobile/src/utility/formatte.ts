export const formatteDate = (date: string | Date): string => {
  const dte = new Date(date)
  const formattedDate = dte.toLocaleString(undefined, {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return formattedDate
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  phoneNumber = phoneNumber.trim()
  if (phoneNumber.startsWith('01')) {
    return phoneNumber.replace('01', '+8801')
  }

  return phoneNumber
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('user already exists')) {
      return 'User already exists, Please Login.'
    }

    if (errorMessage.includes('network error')) {
      return 'Please check your connection.'
    }

    if (errorMessage.includes('timeout')) {
      return 'Request timed out, Please try again later.'
    }

    return 'An unexpected error occurred: ' + error.message
  }

  return 'An unknown error occurred.'
}
