export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token')
}

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = getAuthHeaders()
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })
}
