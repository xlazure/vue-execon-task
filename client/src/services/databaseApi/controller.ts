import type { DBData, DatabaseApiResponse } from "./types";
import DatabaseApiInstace from "./instance";

const COLUMN_PATH = "/columns/";

export const getColumnByName = async (
  columnName: string
): Promise<DBData[]> => {
  const res = await DatabaseApiInstace.get<DBData[]>(
    COLUMN_PATH + columnName
  );
  return res.data;
};

export const addDataToColumn = async (
  columnName: string,
  data: DBData
): Promise<any> => {
  try {
    console.log(data)
    const res = await DatabaseApiInstace.post<DatabaseApiResponse>(
      COLUMN_PATH + columnName + "/single",
      data
    );
    return res.data;
  } catch (error) {
    // throw error;
    console.log(error);
  }
};

export const addMultipleDataToColumn = async (
  columnName: string,
  data: DBData[]
): Promise<any> => {
  try {
    const res = await DatabaseApiInstace.post<any>(
      COLUMN_PATH + columnName + "/multiple",
      data
    );
    return res.data;
  } catch (error) {
    // throw error;
    console.log(error);
  }
};
export const replaceOrAddToColumnC = async (
  data: DBData[]
): Promise<any> => {
  try {
    const res = await DatabaseApiInstace.post<any>(
      COLUMN_PATH + "/replaceC",
      data
    );
    return res.data;
  } catch (error) {
    // throw error;
    console.log(error);
  }
};

export const removeAllDataFormColumns = async (
): Promise<any> => {
  const res = await DatabaseApiInstace.delete<any>(COLUMN_PATH);
  return res.data;
};

export const removeDataFromColumnById = async (columnName: string, id: number): Promise<any> => {
  try {
    const res = await DatabaseApiInstace.delete<any>(
      `${COLUMN_PATH}${columnName}/${id}`
    );
    console.log('delete...')
    return res.data;
  } catch (error) {
    // Handle errors here
    console.error(error);
    throw error; // You might want to throw the error to handle it at a higher level
  }
};


export const updateDataFormColumnById = async (columnName: string, updatedRecord: DBData): Promise<any> => {
  const res = await DatabaseApiInstace.put<any>(COLUMN_PATH + columnName + "/" + updatedRecord.id, updatedRecord);
  return res.data;
}
