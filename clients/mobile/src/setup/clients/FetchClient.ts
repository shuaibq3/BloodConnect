/* eslint-disable no-console */
import { HttpClient } from './HttpClient'
import { FetchClientError } from './FetchClientError'
import StorageService from '../../utility/storageService'
import authService from '../../authentication/services/authService'

export type FetchResponse<T> = T & { status: number }

export class FetchClient implements HttpClient {
  private idToken: string | null = null
  private readonly baseURL: string
  private readonly logoutUser?: () => Promise<void>

  constructor(baseURL: string, logoutUser?: () => Promise<void>) {
    this.baseURL = baseURL
    this.logoutUser = logoutUser
    void this.loadIdToken()
  }

  public async loadIdToken(): Promise<void> {
    this.idToken = await StorageService.getItem('idToken')
  }

  public async setupRequestHeaders(headers: Record<string, string>): Promise<Record<string, string>> {
    const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...headers }
    try {
      const { idToken } = await authService.fetchSession()
      requestHeaders.Authorization = `Bearer ${idToken}`
    } catch (error) {
      if (this.logoutUser !== undefined) {
        await this.logoutUser()
      }
      throw new Error('Failed to refresh session')
    }
    return requestHeaders
  }

  async get<T>(url: string, params: Record<string, any> = {}, headers: Record<string, string> = {}): Promise<FetchResponse<T>> {
    const queryString = new URLSearchParams(params).toString()
    return await this.fetchWithAuth<T>(`${url}?${queryString}`, 'GET', null, headers)
  }

  async post<T>(url: string, body: Record<string, any>, headers: Record<string, string> = {}): Promise<FetchResponse<T>> {
    return await this.fetchWithAuth<T>(url, 'POST', JSON.stringify(body), headers)
  }

  async patch<T>(url: string, body: Record<string, any>, headers: Record<string, string> = {}): Promise<FetchResponse<T>> {
    return await this.fetchWithAuth<T>(url, 'PATCH', JSON.stringify(body), headers)
  }

  private sanitizeJson(text: string): string {
    // Handle empty response
    if ((text.length === 0) || text.trim() === '') {
      return '{}'
    }

    // Fix common JSON formatting issues
    return text
      // Fix numeric fields with missing values
      .replace(/:\s*,/g, ': null,')
      // Fix extra commas before closing brackets
      .replace(/,(\s*[\]}])/g, '$1')
      // Fix escaped quotes
      .replace(/\\"/g, '"')
      // Remove any BOM or invalid characters
      .replace(/^\uFEFF/, '')
      // Clean up whitespace
      .trim()
  }

  public async fetchWithAuth<T>(url: string, method: string, body: string | null, headers: Record<string, string>): Promise<FetchResponse<T>> {
    try {
      const requestHeaders = await this.setupRequestHeaders(headers)
      const fullUrl = `${this.baseURL}${url}`
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new FetchClientError(errorText, response.status)
      }

      // newly added
      const responseText = await response.text()

      try {
        // Handle empty response
        if (responseText.length === 0 || responseText.trim() === '') {
          const emptyResponse: FetchResponse<T> = {
            status: response.status
          } as unknown as FetchResponse<T>
          return emptyResponse
        }

        // Try to parse the sanitized response
        const sanitizedText = this.sanitizeJson(responseText)
        const parsedData = JSON.parse(sanitizedText)
        const responseData: FetchResponse<T> = {
          ...parsedData,
          status: response.status
        }
        return responseData
      } catch (parseError) {
        console.error('JSON Parse Error:', {
          originalText: responseText,
          error: parseError
        })
        throw new FetchClientError('Failed to parse response as JSON', response.status)
      }
    } catch (error) {
      const status = error instanceof FetchClientError ? error.status : 500
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      throw new FetchClientError(message, status)
    }
  }
}

// import { HttpClient } from './HttpClient'
// import { FetchClientError } from './FetchClientError'
// import StorageService from '../../utility/storageService'
// import authService from '../../authentication/services/authService'

// export type FetchResponse<T> = T & { status: number }

// export class FetchClient implements HttpClient {
//   private idToken: string | null = null
//   private readonly baseURL: string
//   private readonly logoutUser?: () => Promise<void>

//   constructor(baseURL: string, logoutUser?: () => Promise<void>) {
//     this.baseURL = baseURL
//     this.logoutUser = logoutUser
//     void this.loadIdToken()
//   }

//   public async loadIdToken(): Promise<void> {
//     this.idToken = await StorageService.getItem('idToken')
//   }

//   public async setupRequestHeaders(headers: Record<string, string>): Promise<Record<string, string>> {
//     const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...headers }
//     try {
//       const { idToken } = await authService.fetchSession()
//       requestHeaders.Authorization = `Bearer ${idToken}`
//     } catch (error) {
//       if (this.logoutUser !== undefined) {
//         await this.logoutUser()
//       }
//       throw new Error('Failed to refresh session')
//     }
//     return requestHeaders
//   }

//   async get<T>(url: string, params: Record<string, any> = {}, headers: Record<string, string> = {}): Promise<FetchResponse<T>> {
//     const queryString = new URLSearchParams(params).toString()
//     return await this.fetchWithAuth<T>(`${url}?${queryString}`, 'GET', null, headers)
//   }

//   async post<T>(url: string, body: Record<string, any>, headers: Record<string, string> = {}): Promise<FetchResponse<T>> {
//     return await this.fetchWithAuth<T>(url, 'POST', JSON.stringify(body), headers)
//   }

//   async patch<T>(url: string, body: Record<string, any>, headers: Record<string, string> = {}): Promise<FetchResponse<T>> {
//     return await this.fetchWithAuth<T>(url, 'PATCH', JSON.stringify(body), headers)
//   }

//   public async fetchWithAuth<T>(url: string, method: string, body: string | null, headers: Record<string, string>): Promise<FetchResponse<T>> {
//     try {
//       const requestHeaders = await this.setupRequestHeaders(headers)
//       const fullUrl = `${this.baseURL}${url}`
//       const response = await fetch(fullUrl, {
//         method,
//         headers: requestHeaders,
//         body
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         throw new FetchClientError(errorText, response.status)
//       }

//       const responseData = await response.json() as T        // Would fail on malformed JSON
//       return { ...responseData, status: response.status }
//     } catch (error) {
//       const status = error instanceof FetchClientError ? error.status : 500
//       const message = error instanceof Error ? error.message : 'An unknown error occurred'
//       throw new FetchClientError(message, status)
//     }
//   }
// }
