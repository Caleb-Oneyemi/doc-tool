type ResponseRecord = Record<string, any>

export type ResponseData = Array<ResponseRecord> | ResponseRecord | null | void

export interface SuccessResponse {
  data: ResponseData
  isSuccess: true
}

export interface ErrorResult {
  message: string
  field?: string
}

export interface ErrorResponse {
  errors: Array<ErrorResult>
  isSuccess: false
}
