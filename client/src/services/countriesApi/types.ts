import type { AxiosResponse } from 'axios'

interface CountryData {
  name: string
}

export type CountriesApiResponse = AxiosResponse<CountryData[]>
