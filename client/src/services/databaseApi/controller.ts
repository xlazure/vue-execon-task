import type { DBData, DatabaseApiResponse } from './types'
import DatabaseApiInstace from './instance'

const COLUMN_PATH = '/columns/'

async function handleApiError(apiCall: Promise<any>): Promise<any> {
  // eslint-disable-next-line no-useless-catch
  const res = await apiCall
  return res.data
}

export const getTableByName = async (tableName: string): Promise<DBData[]> => {
  return handleApiError(DatabaseApiInstace.get<DBData[]>(COLUMN_PATH + tableName))
}

export const addDataToColumn = async (columnName: string, data: DBData): Promise<any> => {
  return handleApiError(
    DatabaseApiInstace.post<DatabaseApiResponse>(COLUMN_PATH + columnName + '/single', data)
  )
}

export const setCounterToTable = async (counter: number): Promise<any> => {
  return handleApiError(DatabaseApiInstace.post<any>(COLUMN_PATH + 'counter', { counter }))
}

export const addMultipleDataToColumn = async (columnName: string, data: DBData[]): Promise<any> => {
  return handleApiError(DatabaseApiInstace.post<any>(COLUMN_PATH + columnName + '/multiple', data))
}

export const replaceOrAddToColumnC = async (data: DBData[]): Promise<any> => {
  return handleApiError(DatabaseApiInstace.post<any>(COLUMN_PATH + '/replaceC', data))
}

export const removeAllDataFormColumns = async (): Promise<any> => {
  return handleApiError(DatabaseApiInstace.delete<any>(COLUMN_PATH))
}

export const removeDataFromColumnById = async (columnName: string, uuid: string): Promise<any> => {
  return handleApiError(DatabaseApiInstace.delete<any>(`${COLUMN_PATH}${columnName}/${uuid}`))
}

export const setActiveItemFromTableById = async (
  columnName: string,
  uuid: string
): Promise<any> => {
  return handleApiError(
    DatabaseApiInstace.put<any>(`${COLUMN_PATH}setActive/${columnName}/${uuid}`)
  )
}

export const updateDataFormColumnById = async (
  columnName: string,
  updatedRecord: DBData
): Promise<any> => {
  return handleApiError(
    DatabaseApiInstace.put<any>(
      COLUMN_PATH + 'update/' + columnName + '/' + updatedRecord.uuid,
      updatedRecord
    )
  )
}
