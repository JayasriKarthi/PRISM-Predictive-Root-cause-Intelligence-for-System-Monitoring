/**
 * API Client with automatic token refresh
 * 
 * This client automatically:
 * - Adds Authorization header with access_token
 * - Handles 401 errors by refreshing the token
 * - Retries the original request after token refresh
 */

interface RefreshResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token")
  
  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch("http://localhost:8000/api/v1/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      // Refresh token is invalid or expired
      // Clear tokens and redirect to login
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
      window.location.href = "/"
      return false
    }

    const data: RefreshResponse = await response.json()

    // Update tokens in localStorage
    localStorage.setItem("access_token", data.access_token)
    localStorage.setItem("refresh_token", data.refresh_token)

    return true
  } catch (error) {
    console.error("Failed to refresh token:", error)
    // Clear tokens on refresh failure
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    window.location.href = "/"
    return false
  }
}

/**
 * Fetch with automatic authentication and token refresh
 * 
 * @param url - Request URL
 * @param options - Fetch options (same as native fetch)
 * @param retryOn401 - Whether to retry on 401 (default: true, set to false to prevent infinite loops)
 * @returns Promise<Response>
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retryOn401: boolean = true
): Promise<Response> {
  // Get access token from localStorage
  const accessToken = localStorage.getItem("access_token")

  // Prepare headers
  const headers = new Headers(options.headers || {})
  
  // Add Authorization header if token exists
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  // Merge headers with existing options
  const requestOptions: RequestInit = {
    ...options,
    headers,
  }

  // Make the request
  let response = await fetch(url, requestOptions)

  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401 && retryOn401 && accessToken) {
    // Try to refresh the token
    const refreshSuccess = await refreshAccessToken()

    if (refreshSuccess) {
      // Get the new access token
      const newAccessToken = localStorage.getItem("access_token")
      
      if (newAccessToken) {
        // Update Authorization header with new token
        headers.set("Authorization", `Bearer ${newAccessToken}`)
        
        // Retry the original request with new token
        // Set retryOn401 to false to prevent infinite loops
        return fetchWithAuth(url, { ...options, headers }, false)
      }
    }
    
    // If refresh failed, return the original 401 response
    return response
  }

  return response
}

/**
 * Convenience method for GET requests
 */
export async function get(url: string, options: RequestInit = {}): Promise<Response> {
  return fetchWithAuth(url, { ...options, method: "GET" })
}

/**
 * Convenience method for POST requests
 */
export async function post(url: string, body?: any, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {})
  if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetchWithAuth(url, {
    ...options,
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Convenience method for PUT requests
 */
export async function put(url: string, body?: any, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {})
  if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetchWithAuth(url, {
    ...options,
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Convenience method for PATCH requests
 */
export async function patch(url: string, body?: any, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {})
  if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetchWithAuth(url, {
    ...options,
    method: "PATCH",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Convenience method for DELETE requests
 */
export async function del(url: string, options: RequestInit = {}): Promise<Response> {
  return fetchWithAuth(url, { ...options, method: "DELETE" })
}

