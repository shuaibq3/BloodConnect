import StorageService from '../../src/utility/storageService'
import { signUp, confirmSignUp, signIn, signInWithRedirect, decodeJWT, fetchAuthSession, signOut } from 'aws-amplify/auth'
import { registerUser, submitOtp, loginUser, googleLogin, facebookLogin, UserRegistrationCredentials, decodeAccessToken, logoutUser, fetchSession } from '../../src/authentication/services/authService'

jest.mock('../../src/utility/storageService', () => ({
  getItem: jest.fn(),
  storeItem: jest.fn(),
  removeItem: jest.fn()
}))

describe('AuthService', () => {
  const mockRegisterInfo: UserRegistrationCredentials = {
    name: 'Ebrahim',
    email: 'ebrahim@example.com',
    phoneNumber: '+1234567890',
    password: 'Password123!'
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('decodeAccessToken', () => {
    test('should decode the JWT token correctly', () => {
      const token = 'mockToken'
      const decodedPayload = { sub: '12345', exp: Math.floor(Date.now() / 1000) + 60 };

      (decodeJWT as jest.Mock).mockReturnValue({ payload: decodedPayload })

      const result = decodeAccessToken(token)
      expect(decodeJWT).toHaveBeenCalledWith(token)
      expect(result).toEqual(decodedPayload)
    })

    test('should throw an error if token is null', () => {
      expect(() => decodeAccessToken(null)).toThrow("Token Can't be null.")
    })
  })

  describe('logoutUser', () => {
    test('should call signOut and remove tokens from storage', async() => {
      await logoutUser()

      expect(signOut).toHaveBeenCalled()
      expect(StorageService.removeItem).toHaveBeenCalledWith('accessToken')
      expect(StorageService.removeItem).toHaveBeenCalledWith('idToken')
    })

    test('should throw an error if logout fails', async() => {
      (signOut as jest.Mock).mockRejectedValue(new Error('Failed to Logout.'))
      await expect(logoutUser()).rejects.toThrow('Failed to Logout.')
    })
  })

  describe('fetchSession', () => {
    test('should fetch session and store tokens', async() => {
      const mockSession = {
        tokens: {
          accessToken: 'mockAccessToken',
          idToken: 'mockIdToken'
        }
      };
      (fetchAuthSession as jest.Mock).mockResolvedValue(mockSession)

      const result = await fetchSession()

      expect(fetchAuthSession).toHaveBeenCalled()
      expect(StorageService.storeItem).toHaveBeenCalledWith('accessToken', 'mockAccessToken')
      expect(StorageService.storeItem).toHaveBeenCalledWith('idToken', 'mockIdToken')
      expect(result).toEqual(mockSession.tokens)
    })

    test('should throw an error if session or tokens are undefined', async() => {
      (fetchAuthSession as jest.Mock).mockResolvedValue({})

      await expect(fetchSession()).rejects.toThrow('Failed to fetch session')
    })

    test('should throw an error if access token or ID token is missing', async() => {
      (fetchAuthSession as jest.Mock).mockResolvedValue({ tokens: {} })

      await expect(fetchSession()).rejects.toThrow('Failed to fetch session')
    })

    test('should throw an error if fetching session fails', async() => {
      (fetchAuthSession as jest.Mock).mockRejectedValue(new Error('Session fetch failed'))

      await expect(fetchSession()).rejects.toThrow('Failed to fetch session')
    })
  })

  describe('registerUser', () => {
    test('should return true if registration requires confirmation', async() => {
      (signUp as jest.Mock).mockResolvedValue({
        nextStep: { signUpStep: 'CONFIRM_SIGN_UP' }
      })
      const result = await registerUser(mockRegisterInfo)

      expect(signUp).toHaveBeenCalledWith({
        username: mockRegisterInfo.email,
        password: mockRegisterInfo.password,
        options: {
          userAttributes: {
            email: mockRegisterInfo.email,
            name: mockRegisterInfo.name,
            phone_number: mockRegisterInfo.phoneNumber
          }
        }
      })
      expect(result).toBe(true)
    })

    test('should return false if registration does not require confirmation', async() => {
      (signUp as jest.Mock).mockResolvedValue({
        nextStep: { signUpStep: 'DONE' }
      })

      const result = await registerUser(mockRegisterInfo)
      expect(result).toBe(false)
    })

    test('should throw an error if registration fails with a specific error message', async() => {
      (signUp as jest.Mock).mockRejectedValue(new Error('Username already exists'))
      await expect(registerUser(mockRegisterInfo)).rejects.toThrow(
        'Username already exists'
      )
    })

    test('should throw a generic error if registration fails without a specific error message', async() => {
      (signUp as jest.Mock).mockRejectedValue('Something went wrong.')
      await expect(registerUser(mockRegisterInfo)).rejects.toThrow(
        'Something went wrong.'
      )
    })
  })

  describe('submitOtp', () => {
    const email = 'ebrahim@example.com'
    const otp = '123456'

    test('should return true if OTP confirmation is successful', async() => {
      (confirmSignUp as jest.Mock).mockResolvedValue({
        nextStep: { signUpStep: 'DONE' }
      });

      (fetchAuthSession as jest.Mock).mockResolvedValue({ isSucessRegister: true })

      const result = await submitOtp(email, otp)
      expect(confirmSignUp).toHaveBeenCalledWith({
        username: email,
        confirmationCode: otp
      })
      expect(result).toBe(true)
    })

    test('should return false if OTP confirmation is not yet completed', async() => {
      (confirmSignUp as jest.Mock).mockResolvedValue({
        nextStep: { signUpStep: 'CONFIRM_SIGN_UP' }
      });

      (fetchAuthSession as jest.Mock).mockResolvedValue({ isSucessRegister: false })

      const result = await submitOtp(email, otp)
      expect(result).toEqual(false)
    })

    test('should throw an error if OTP confirmation fails', async() => {
      (confirmSignUp as jest.Mock).mockRejectedValue(new Error('Invalid OTP'))
      await expect(submitOtp(email, otp)).rejects.toThrow(
        'Invalid OTP'
      )
    })

    test('should throw a generic error if OTP confirmation fails without a specific error message', async() => {
      (confirmSignUp as jest.Mock).mockRejectedValue('Unexpected Error')
      await expect(submitOtp(email, otp)).rejects.toThrow(
        'Something went wrong.'
      )
    })
  })

  describe('loginUser', () => {
    const email = 'ebrahim@example.com'
    const password = 'Password123!'

    test('should return true if login is successful', async() => {
      (signIn as jest.Mock).mockResolvedValue({ isSignedIn: true });

      (fetchAuthSession as jest.Mock).mockResolvedValue({
        tokens: {
          accessToken: 'mockAccessToken',
          idToken: 'mockIdToken'
        }
      })

      const result = await loginUser(email, password)
      expect(signIn).toHaveBeenCalledWith({
        username: email,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH'
        }
      })
      expect(result).toEqual(true)
    })

    test('should return false if login is not successful', async() => {
      (signIn as jest.Mock).mockResolvedValue({ isSignedIn: false });

      (fetchAuthSession as jest.Mock).mockResolvedValue({
        tokens: {
          accessToken: 'mockAccessToken',
          idToken: 'mockIdToken'
        }
      })

      const result = await loginUser(email, password)
      expect(result).toEqual(false)
    })

    test('should throw an error if login fails with a specific error message', async() => {
      (signIn as jest.Mock).mockRejectedValue(new Error('Login failed'))
      await expect(loginUser(email, password)).rejects.toThrow(
        'Error logging in user: Login failed'
      )
    })

    test('should throw a generic error if login fails without a specific error message', async() => {
      (signIn as jest.Mock).mockRejectedValue('Unexpected Error')
      await expect(loginUser(email, password)).rejects.toThrow(
        'Error logging in user: Unexpected Error'
      )
    })
  })

  describe('googleLogin', () => {
    test('should call signInWithRedirect with Google provider', async() => {
      await googleLogin()
      expect(signInWithRedirect).toHaveBeenCalledWith({ provider: 'Google' })
    })

    test('should throw an error if Google sign-in fails with Error object', async() => {
      (signInWithRedirect as jest.Mock).mockRejectedValue(new Error('Google sign-in failed'))
      await expect(googleLogin()).rejects.toThrow('Error logging with google: Google sign-in failed')
    })

    test('should throw an error if Google sign-in fails with non-Error object', async() => {
      (signInWithRedirect as jest.Mock).mockRejectedValue('Unexpected error')
      await expect(googleLogin()).rejects.toThrow('Error logging with google: Unexpected error')
    })
  })

  describe('facebookLogin', () => {
    test('should call signInWithRedirect with Facebook provider', async() => {
      await facebookLogin()
      expect(signInWithRedirect).toHaveBeenCalledWith({ provider: 'Facebook' })
    })

    test('should throw an error if Facebook sign-in fails with Error object', async() => {
      (signInWithRedirect as jest.Mock).mockRejectedValue(new Error('Facebook sign-in failed'))
      await expect(facebookLogin()).rejects.toThrow('Error logging with facebook: Facebook sign-in failed')
    })

    test('should throw an error if Facebook sign-in fails with non-Error object', async() => {
      (signInWithRedirect as jest.Mock).mockRejectedValue('Unexpected error')
      await expect(facebookLogin()).rejects.toThrow('Error logging with facebook: Unexpected error')
    })
  })
})
