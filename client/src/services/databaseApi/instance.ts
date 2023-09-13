const API: string = 'http://localhost:3000/api'

import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { DatabaseApiResponse } from './types'

const OnResponseSuccess = (response: DatabaseApiResponse): DatabaseApiResponse => response

const OnResponseFailure = (error: any): Promise<any> => {
  const httpStatus = error?.response?.status

  return Promise.reject({ error, httpStatus })
}

const instance: Readonly<AxiosInstance> = axios.create({
  baseURL: API,
  timeout: 5000
})

instance.defaults.headers.get.Accepts = 'application/json'
instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

instance.interceptors.response.use(OnResponseSuccess, OnResponseFailure)

export default instance
