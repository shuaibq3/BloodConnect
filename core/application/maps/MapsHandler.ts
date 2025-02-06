import { z } from 'zod'
import {
  PlaceAutocompleteRequest,
  GeocodeRequest,
  APIResponse,
  PlaceAutocompleteResponse,
  GeocodeResponse
} from './dto/Maps'
import { MapsService } from './MapsService'

const geocodeSchema = z.object({
  address: z.string().optional(),
  latlng: z.string().optional(),
  place_id: z.string().optional(),
  language: z.string().optional(),
  region: z.string().optional()
}).refine(data => (
  data?.address ?? data?.latlng ?? data?.place_id
), {
  message: 'At least one of address, latlng, or place_id must be provided'
})

const placeAutocompleteSchema = z.object({
  input: z.string().min(1),
  types: z.enum(['geocode', 'establishment']),
  sessiontoken: z.string().optional(),
  components: z.string().optional(),
  location: z.string().optional(),
  radius: z.number().positive().optional(),
  language: z.string().optional()
})

export class MapsHandler {
  private readonly mapsService: MapsService

  constructor() {
    this.mapsService = new MapsService()
  }

  async getPlaceAutocomplete(params: PlaceAutocompleteRequest): Promise<APIResponse<PlaceAutocompleteResponse>> {
    const validatedParams = placeAutocompleteSchema.parse(params)

    return await this.mapsService.getPlaceAutocomplete(validatedParams)
  }

  async getGeocode(params: GeocodeRequest): Promise<APIResponse<GeocodeResponse>> {
    const validatedParams = geocodeSchema.parse(params)

    return await this.mapsService.getGeocode(validatedParams)
  }
}
