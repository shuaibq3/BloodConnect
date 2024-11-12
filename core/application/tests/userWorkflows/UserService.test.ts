import { UserService } from '../../userWorkflows/UserService'
import { generateUniqueID } from '../../utils/idGenerator'
import { getEmailVerificationMessage, getPasswordResetVerificationMessage, getAppUserWellcomeMailMessage } from '../../userWorkflows/userMessages'
import { mockUserWithStringId } from '../mocks/mockUserData'
import { mockRepository } from '../mocks/mockRepositories'
import Repository from '../../technicalImpl/policies/repositories/Repository'
import { UserDTO, UserDetailsDTO, LocationDTO } from '../../../../commons/dto/UserDTO'
import { UpdateUserAttributes } from '../../userWorkflows/Types'
import LocationModel from '../../technicalImpl/dbModels/LocationModel'

jest.mock('../../utils/idGenerator')
jest.mock('../../userWorkflows/userMessages')

describe('UserService Tests', () => {
  const userService = new UserService()
  const userRepository = mockRepository as jest.Mocked<Repository<UserDTO>>
  const userDetailsRepository = mockRepository as jest.Mocked<Repository<UserDetailsDTO>>
  const locationRepository = mockRepository as jest.Mocked<Repository<LocationDTO>>
  const locationModel = new LocationModel()

  const mockUserAttributes = {
    email: 'ebrahim@example.com',
    name: 'Ebrahim',
    phone_number: '1234567890',
    createdAt: '2023-09-16T12:00:00.000Z'
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (generateUniqueID as jest.Mock).mockReturnValue('12345')
    userRepository.query.mockResolvedValue({ items: [], lastEvaluatedKey: undefined })
    process.env.AFTER_DONATION_UNAVAILABLE_PERIOD = '4'
  })

  test('should create a new user successfully', async() => {
    userRepository.create.mockResolvedValue(mockUserWithStringId)
    const result = await userService.createNewUser(mockUserAttributes, userRepository)

    expect(result).toBe(mockUserWithStringId)
    expect(generateUniqueID).toHaveBeenCalledTimes(1)
    expect(userRepository.create).toHaveBeenCalledWith({
      ...mockUserWithStringId
    })
  })

  test('should throw an error on failure', async() => {
    const errorMessage = 'Database error'
    const originalError = new Error(errorMessage)

    mockRepository.create.mockRejectedValue(originalError)
    await expect(userService.createNewUser(mockUserAttributes, mockRepository))
      .rejects.toThrow(new Error(errorMessage))
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
  })

  test('should get post-signup message correctly', () => {
    const mockMessage = { title: 'Welcome to Blood Connect!', content: 'Verify your email' };
    (getEmailVerificationMessage as jest.Mock).mockReturnValue(mockMessage)

    const result = userService.getPostSignUpMessage('Ebrahim', '1234')
    expect(getEmailVerificationMessage).toHaveBeenCalledWith('Ebrahim', '1234')
    expect(result).toEqual(mockMessage)
  })

  test('should get forgot password message correctly', () => {
    const mockMessage = { body: 'Reset your password for Blood Connect', subject: 'Reset your password' };
    (getPasswordResetVerificationMessage as jest.Mock).mockReturnValue(mockMessage)

    const result = userService.getForgotPasswordMessage('Ebrahim', '1234')
    expect(getPasswordResetVerificationMessage).toHaveBeenCalledWith('Ebrahim', '1234')
    expect(result).toEqual(mockMessage)
  })
  test('should update user successfully', async() => {
    const mockUpdateAttributes = {
      userId: '12345',
      name: 'Updated Ebrahim',
      dateOfBirth: '1990-01-01',
      phoneNumbers: ['1234567890'],
      bloodGroup: 'A+',
      lastDonationDate: '2023-06-01',
      height: 170,
      weight: 65,
      availableForDonation: 'yes',
      gender: 'male',
      NIDFront: 's3://bucket/nid/1a2b3c4d5e-front.jpg',
      NIDBack: 's3://bucket/nid/1a2b3c4d5e-back.jpg',
      lastVaccinatedDate: '2023-05-01'
    }

    const { userId, ...mockResponse } = mockUpdateAttributes

    userRepository.update.mockResolvedValue(mockUserWithStringId)

    const result = await userService.updateUser(mockUpdateAttributes as unknown as UpdateUserAttributes, userDetailsRepository, locationRepository, locationModel)

    expect(result).toBe('Updated your Profile info')
    expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      ...mockResponse,
      age: expect.any(Number),
      id: mockUpdateAttributes.userId,
      updatedAt: expect.any(String)
    }))
  })

  describe('getAppUserWellcomeMail', () => {
    test('should get welcome mail message correctly', () => {
      const userName = 'Suzan'
      const mockMessage = {
        title: 'Welcome to BloodConnect: Thank You for Signing Up!',
        content: 'Welcome to BloodConnect! We are excited to have you.'
      };
      (getAppUserWellcomeMailMessage as jest.Mock).mockReturnValue(mockMessage)

      const result = userService.getAppUserWellcomeMail(userName)

      expect(getAppUserWellcomeMailMessage).toHaveBeenCalledWith(userName)
      expect(result).toEqual(mockMessage)
    })

    test('should handle empty username', () => {
      const mockMessage = {
        title: 'Welcome to BloodConnect: Thank You for Signing Up!',
        content: 'Welcome to BloodConnect! We are excited to have you.'
      };
      (getAppUserWellcomeMailMessage as jest.Mock).mockReturnValue(mockMessage)

      const result = userService.getAppUserWellcomeMail('')

      expect(getAppUserWellcomeMailMessage).toHaveBeenCalledWith('')
      expect(result).toEqual(mockMessage)
    })

    test('should handle special characters in username', () => {
      const userName = 'John@123#$%'
      const mockMessage = {
        title: 'Welcome to BloodConnect: Thank You for Signing Up!',
        content: 'Welcome to BloodConnect! We are excited to have you.'
      };
      (getAppUserWellcomeMailMessage as jest.Mock).mockReturnValue(mockMessage)

      const result = userService.getAppUserWellcomeMail(userName)

      expect(getAppUserWellcomeMailMessage).toHaveBeenCalledWith(userName)
      expect(result).toEqual(mockMessage)
    })

    test('should handle very long usernames', () => {
      const longUserName = 'VeryLongUserNameThatMightCauseIssuesIfNotHandledProperly'
      const mockMessage = {
        title: 'Welcome to BloodConnect: Thank You for Signing Up!',
        content: 'Welcome to BloodConnect! We are excited to have you.'
      };
      (getAppUserWellcomeMailMessage as jest.Mock).mockReturnValue(mockMessage)

      const result = userService.getAppUserWellcomeMail(longUserName)

      expect(getAppUserWellcomeMailMessage).toHaveBeenCalledWith(longUserName)
      expect(result).toEqual(mockMessage)
    })
  })
})
