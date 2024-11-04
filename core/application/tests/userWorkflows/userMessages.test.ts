import { getEmailVerificationMessage, getPasswordResetVerificationMessage, getAppUserWellcomeMailMessage } from '../../userWorkflows/userMessages'
import { GenericMessage } from '../../../../commons/dto/MessageDTO'
import { EMAIL_VERIFICATION_TITLE, EMAIL_VERIFICATION_CONTENT, PASSWORD_RESET_CONTENT, PASSWORD_RESET_TITLE, APP_USER_WELCOME_MAIL_TITLE, APP_USER_WELCOME_MAIL_CONTENT } from '../../utils/messageConstants'
import { replaceTemplatePlaceholders } from '../../utils/formatString'

describe('User Message Functions', () => {
  const userName = 'Ebrahim'
  const securityCode = '123456'

  test('should generate email verification message', () => {
    const expectedMessage: GenericMessage = {
      title: EMAIL_VERIFICATION_TITLE,
      content: replaceTemplatePlaceholders(EMAIL_VERIFICATION_CONTENT, userName, securityCode)
    }

    const result = getEmailVerificationMessage(userName, securityCode)

    expect(result).toEqual(expectedMessage)
    expect(result.content).toContain(userName)
    expect(result.content).toContain(securityCode)
  })

  test('should generate password reset verification message', () => {
    const expectedMessage: GenericMessage = {
      title: PASSWORD_RESET_TITLE,
      content: replaceTemplatePlaceholders(PASSWORD_RESET_CONTENT, userName, securityCode)
    }

    const result = getPasswordResetVerificationMessage(userName, securityCode)

    expect(result).toEqual(expectedMessage)
    expect(result.content).toContain(userName)
    expect(result.content).toContain(securityCode)
  })

  test('should generate app user welcome mail message', () => {
    const expectedMessage: GenericMessage = {
      title: APP_USER_WELCOME_MAIL_TITLE,
      content: replaceTemplatePlaceholders(APP_USER_WELCOME_MAIL_CONTENT, userName)
    }

    const result = getAppUserWellcomeMailMessage(userName)

    expect(result).toEqual(expectedMessage)
    expect(result.content).toContain(userName)
  })
})
