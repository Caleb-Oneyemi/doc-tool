import { StatusTypes } from '../constants'

export interface QueryInput {
  page?: number
  limit?: number
  sort?: 'asc' | 'desc'
  owner?: string
  status?: keyof typeof StatusTypes
}
