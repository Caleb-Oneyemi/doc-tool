import { Response } from '../models/response'
import { CreateResponseInput, ResponseAttributes } from '../models/types'

export const createResponse = async (input: CreateResponseInput) => {
  return Response.addOne(input)
}

export const getResponseById = async (id: string) => {
  return Response.findById(id).populate({
    path: 'question',
    select: 'fields -_id',
  })
}

export const getResponses = async () => {
  return Response.find({})
}

export const getResponseByIdAndOwnerId = async (id: string, userId: string) => {
  return Response.findOne({ _id: id, owner: userId }).populate({
    path: 'question',
    select: 'fields owner -_id',
  })
}

export const updateResponse = async (
  id: string,
  input: Pick<ResponseAttributes, 'fields' | 'status'>,
) => {
  return Response.findOneAndUpdate(
    { _id: id },
    { $set: input },
    { new: true },
  ).exec()
}
