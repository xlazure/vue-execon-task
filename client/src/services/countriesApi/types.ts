import type { AxiosResponse } from 'axios'

interface CountryData {
  name: string
}
export interface DBData {
  name: string
  isChecked: boolean
  id: number
}

export type CountriesApiResponse = AxiosResponse<CountryData[]>
export type DatabaseApiResponse = AxiosResponse<DBData[]>
