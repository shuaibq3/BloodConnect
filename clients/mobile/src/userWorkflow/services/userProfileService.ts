import { HttpClient } from '../../setup/clients/HttpClient'
import { ProfileError } from '../../utility/errors'
import { UserDetailsDTO } from '../../../../../commons/dto/UserDTO'

interface UserPreferredLocation {
  area: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface UserProfile extends
  Partial<Omit<UserDetailsDTO,
  'createdAt'
  | 'updatedAt'
  | 'deviceToken'
  | 'snsEndpointArn'
  | 'bloodGroup'
  | 'gender'
  | 'availableForDonation'>> {
  preferredDonationLocations?: UserPreferredLocation[];
  userId: string;
  city: string;
  bloodGroup: string;
  gender: string;
  availableForDonation: boolean;
}

interface APIResponse {
  success?: boolean;
  data?: UserProfile;
  message?: string;
  status: number;
}

export const fetchUserProfileFromApi = async(httpClient: HttpClient): Promise<APIResponse> => {
  try {
    const response = await httpClient.get<APIResponse>('/users')
    return {
      data: response.data,
      status: response.status
    }
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    throw new ProfileError(errorMessage)
  }
}

export const createUserProfile = async(payload: Record<string, unknown>, httpClient: HttpClient):
Promise<APIResponse> => {
  try {
    const response = await httpClient.post<APIResponse>('/users', payload)
    return {
      message: response.message,
      status: response.status
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}

export const updateUserProfile = async(payload: Record<string, unknown>, httpClient: HttpClient):
Promise<APIResponse> => {
  try {
    const response = await httpClient.patch<APIResponse>('/users', payload)
    return {
      message: response.message,
      status: response.status
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}
