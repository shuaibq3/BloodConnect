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

  private async loadIdToken(): Promise<void> {
    this.idToken = await StorageService.getItem('idToken')
  }

  private async setupRequestHeaders(headers: Record<string, string>): Promise<Record<string, string>> {
    // if (this.idToken === null) {
    //   await this.loadIdToken()
    // }
    const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...headers }
    // if (this.idToken !== null) {
    //   requestHeaders.Authorization = `Bearer ${this.idToken}`
    // }
    // console.log('HEADER')
    try {
      const { idToken } = await authService.fetchSession()
      requestHeaders.Authorization = `Bearer ${idToken}`
    } catch (error) {
      if (this.logoutUser !== undefined) {
        await this.logoutUser()
      }
      throw new Error('Failed to refresh session')
    }

    // const payload = authService.decodeAccessToken(this.idToken)
    // if (this.idToken !== null && payload.exp !== undefined && payload.exp < Math.floor(Date.now() / 1000)) {
    //   try {
    //     const { idToken } = await authService.fetchSession()
    //     if (idToken !== '' && this.logoutUser !== undefined) {
    //       await this.logoutUser()
    //       throw new Error('Session refresh failed: ID token is missing')
    //     }
    //     this.idToken = idToken
    //   } catch (error) {
    //     if (this.logoutUser !== undefined) {
    //       await this.logoutUser()
    //     }
    //     throw new Error('Failed to refresh session')
    //   }
    // }
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

  private async fetchWithAuth<T>(url: string, method: string, body: string | null, headers: Record<string, string>): Promise<FetchResponse<T>> {
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

      const responseData = await response.json() as T
      return { ...responseData, status: response.status }
    } catch (error) {
      const status = error instanceof FetchClientError ? error.status : 500
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      throw new FetchClientError(message, status)
    }
  }
}
