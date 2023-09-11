import CountriesApiInstace from './instance'
import type { CountriesApiResponse } from './types'

export const getAllCountries = async (): Promise<CountriesApiResponse> => {
  const res = await CountriesApiInstace.get<CountriesApiResponse>('/all')
  return res.data
}
