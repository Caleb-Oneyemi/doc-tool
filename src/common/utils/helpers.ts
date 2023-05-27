import { nanoid } from 'nanoid/async'

export const generatePublicId = async (size?: number) => {
  if (!size) return nanoid()
  return nanoid(size)
}

export const formatValidationErrorMessage = (msg: string, field: string) => {
  let result = msg

  if (result.startsWith('String') || result.startsWith('Number')) {
    result = result.replace(/String|Number/, field)
  }

  if (result === 'Required') {
    result = `${field} is required`
  }

  return result
}
