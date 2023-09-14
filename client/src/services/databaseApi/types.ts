import type { AxiosResponse } from 'axios'

export interface DBData {
  name: string
  isChecked?: boolean
  isActive?: boolean
  id?: number
  uuid?: string
  value?: number
}

export type DatabaseApiResponse = AxiosResponse<DBData[]>
