export interface ColumnItem {
  id?: number
  name: string
  isChecked?: boolean
  isActive?: boolean
  uuid?: string;
}

export interface Columns {
  [key: string]: ColumnItem[]
}

export interface MyStoreState {
  columns: Columns
  loading: boolean
  error: string | null
  counter: number
  fetching: boolean
}
