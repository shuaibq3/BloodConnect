import { DonorSearchService } from '../../bloodDonationWorkflow/DonorSearchService'
import {
  DonationStatus,
  DonorSearchDTO
} from '../../../../commons/dto/DonationDTO'
import Repository from '../../models/policies/repositories/Repository'
import { generateUniqueID } from '../../utils/idGenerator'
import { generateGeohash } from '../../utils/geohash'
import { validateInputWithRules } from '../../utils/validator'
import {
  currentDate,
  donorRoutingAttributesMock,
  mockDonorSearchDTO
} from '../mocks/mockDonationRequestData'
import { mockRepository } from '../mocks/mockRepositories'
import {
  BloodDonationModel
} from '../../models/dbModels/BloodDonationModel'
import { StepFunctionModel } from '../../models/stepFunctions/StepFunctionModel'
import { mockUserDetailsWithStringId } from '../mocks/mockUserData'

jest.mock('../../utils/idGenerator', () => ({
  generateUniqueID: jest.fn()
}))

jest.mock('../../utils/geohash', () => ({
  generateGeohash: jest.fn()
}))

jest.mock('../../utils/validator', () => ({
  validateInputWithRules: jest.fn()
}))

describe('DonorSearchService', () => {
  const donorSearchRepository: jest.Mocked<Repository<DonorSearchDTO>> =
    mockRepository
  const stepFunctionModel: jest.Mocked<StepFunctionModel> = {
    startExecution: jest.fn()
  }
  const mockModel = new BloodDonationModel()

  beforeEach(() => {
    jest.resetAllMocks();
    (generateUniqueID as jest.Mock).mockReturnValue('uniqueID');
    (generateGeohash as jest.Mock).mockReturnValue('geohash123');
    (validateInputWithRules as jest.Mock).mockReturnValue(null)
    jest
      .spyOn(mockModel, 'getPrimaryIndex')
      .mockReturnValue({ partitionKey: 'PK', sortKey: 'SK' })
    process.env.MAX_RETRY_COUNT = '5'
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('routeDonorRequest', () => {
    test('should initiate donor search process if retry count is below max and request is not completed or expired', async() => {
      const donorSearchService = new DonorSearchService()
      donorSearchRepository.getItem.mockResolvedValue(mockDonorSearchDTO)

      const result = await donorSearchService.routeDonorRequest(
        donorRoutingAttributesMock,
        'queueSource',
        mockUserDetailsWithStringId,
        donorSearchRepository,
        stepFunctionModel
      )

      expect(donorSearchRepository.getItem).toHaveBeenCalledWith(
        'DONOR_SEARCH#seeker123',
        `DONOR_SEARCH#${currentDate}#req123`
      )
      expect(donorSearchRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...donorRoutingAttributesMock,
          retryCount: 1
        })
      )
      expect(stepFunctionModel.startExecution).toHaveBeenCalledWith(
        expect.objectContaining({
          seekerId: mockDonorSearchDTO.seekerId,
          requestPostId: mockDonorSearchDTO.id,
          createdAt: mockDonorSearchDTO.createdAt,
          donationDateTime: mockDonorSearchDTO.donationDateTime,
          neededBloodGroup: mockDonorSearchDTO.neededBloodGroup,
          bloodQuantity: mockDonorSearchDTO.bloodQuantity,
          urgencyLevel: mockDonorSearchDTO.urgencyLevel,
          geohash: mockDonorSearchDTO.geohash,
          city: 'Dhaka'
        }),
        expect.any(String)
      )
      expect(result).toBe(
        'Request updated and donor search process initiated.'
      )
    })

    test('should return expiration message if retry count reaches maximum', async() => {
      const donorSearchService = new DonorSearchService()
      const expiredMockDonorSearchDTO: DonorSearchDTO = {
        ...mockDonorSearchDTO,
        retryCount: 6
      }

      donorSearchRepository.getItem.mockResolvedValue(expiredMockDonorSearchDTO)

      const result = await donorSearchService.routeDonorRequest(
        donorRoutingAttributesMock,
        'queueSource',
        mockUserDetailsWithStringId,
        donorSearchRepository,
        stepFunctionModel
      )

      expect(result).toBe(
        'Donor search process completed after reaching the maximum retry limit.'
      )
    })

    test('should return error message if blood donation is already completed or expired', async() => {
      const donorSearchService = new DonorSearchService()
      donorSearchRepository.getItem.mockResolvedValue({
        ...mockDonorSearchDTO,
        status: DonationStatus.COMPLETED
      })

      const result = await donorSearchService.routeDonorRequest(
        donorRoutingAttributesMock,
        'queueSource',
        mockUserDetailsWithStringId,
        donorSearchRepository,
        stepFunctionModel
      )

      expect(result).toBe('Donor search has already been completed.')
      expect(stepFunctionModel.startExecution).not.toHaveBeenCalled()
    })
  })
})
