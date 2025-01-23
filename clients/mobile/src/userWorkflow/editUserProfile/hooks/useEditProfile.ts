import { useMemo, useState } from 'react'
import {
  validateDateOfBirth,
  validateHeight, validateInput, validatePhoneNumber,
  validateRequired, validateWeight,
  ValidationRule
} from '../../../utility/validator'
import { useRoute } from '@react-navigation/native'
import { useFetchClient } from '../../../setup/clients/useFetchClient'
import { initializeState } from '../../../utility/stateUtils'
import { Alert } from 'react-native'
import { useUserProfile } from '../../context/UserProfileContext'
import useFetchData from '../../../setup/clients/useFetchData'
import { updateUserProfile } from '../../services/userProfileService'
import { EditProfileRouteProp } from '../../../setup/navigation/navigationTypes'
import { EditProfileData } from '../../userProfile/UI/Profile'

type ProfileFields = keyof Omit<ProfileData, 'location'>

type ProfileData = {
  [K in keyof EditProfileData as K extends string ? (string extends K ? never : K) : never]: EditProfileData[K];
} & {
  weight: string | undefined;
}

type ProfileDataErrors = {
  [key in ProfileFields]?: string | null;
}

const validationRules: Record<keyof Omit<ProfileData, 'location'>, ValidationRule[]> = {
  name: [validateRequired],
  dateOfBirth: [validateDateOfBirth, validateRequired],
  weight: [validateRequired, validateWeight],
  height: [validateRequired, validateHeight],
  gender: [validateRequired],
  phone: [validateRequired, validatePhoneNumber]
}

export const useEditProfile = (): any => {
  const { fetchUserProfile } = useUserProfile()
  const route = useRoute<EditProfileRouteProp>()
  const fetchClient = useFetchClient()
  const { userDetails } = route.params

  const [profileData, setProfileData] = useState(() => {
    if (!Array.isArray(userDetails.phoneNumbers) || userDetails.phoneNumbers.length === 0) {
      throw new Error('userDetails.phoneNumbers must contain at least one value')
    }

    return {
      ...userDetails,
      phone: userDetails.phoneNumbers[0]
    }
  })
  const [errors, setErrors] = useState<ProfileDataErrors>(
    initializeState<ProfileDataErrors>(Object.keys(validationRules) as ProfileFields[], null)
  )

  const [executeUpdateProfile, loading, , updateError] = useFetchData(
    async (payload: Partial<ProfileData>) => {
      const response = await updateUserProfile(payload, fetchClient)

      if (response.status !== 200) {
        throw new Error('Failed to update profile')
      }
      await fetchUserProfile()
    },
    {
      parseError: (error) => (error instanceof Error ? error.message : 'Unknown error')
    }
  )

  const handleInputChange = (field: ProfileFields, value: string): void => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value
    }))

    handleInputValidation(field, value)
  }

  const handleInputValidation = (field: ProfileFields, value: string): void => {
    setErrors((prevErrors) => {
      const errorMsg = validateInput(value, validationRules[field])
      if (prevErrors[field] === errorMsg) return prevErrors
      return { ...prevErrors, [field]: errorMsg }
    })
  }

  const handleSave = async (): Promise<void> => {
    const newErrors: Record<string, string | null> = {}
    const validationFields = Object.keys(validationRules) as ProfileFields[]
    validationFields.forEach(field => {
      const value = profileData[field]
      const rules = validationRules[field]
      newErrors[field] = validateInput(value, rules)
    })

    setErrors(newErrors)

    if (Object.values(newErrors).some((error) => error)) {
      Alert.alert('Please fix the highlighted errors.')
      return
    }

    const { phone, ...rest } = profileData
    userDetails.phoneNumbers[0] = phone

    try {
      const requestPayload = {
        ...rest,
        weight: parseFloat(profileData.weight)
      }

      await executeUpdateProfile(requestPayload)
      if (updateError !== null) {
        throw new Error('Failed to update profile')
      } else {
        await fetchUserProfile()
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update profile.')
    }
  }

  const hasErrors = useMemo(
    () => Object.values(errors).some((error) => error),
    [errors]
  )

  const areRequiredFieldsFilled = useMemo(
    () =>
      Object.keys(validationRules).every((key) => {
        const value = profileData[key as keyof ProfileData]
        return value !== null && value !== undefined && value.toString().trim() !== ''
      }),
    [profileData]
  )

  const isButtonDisabled = hasErrors || !areRequiredFieldsFilled

  return {
    profileData,
    loading,
    errors,
    handleInputChange,
    handleSave,
    isButtonDisabled
  }
}
