import { QueryInput } from '../../common'
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

export const getResponses = async ({
  page = 1,
  limit = 10,
  sort = 'desc',
  owner,
  status,
}: QueryInput) => {
  const filter = owner ? { owner } : {}
  if (status) {
    Object.assign(filter, { status })
  }
  return Response.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate({
      path: 'question',
      select: 'fields -_id',
    })
}

export const getResponseCount = async (owner?: string, status?: string) => {
  const filter = owner ? { owner } : {}
  if (status) {
    Object.assign(filter, { status })
  }
  return Response.countDocuments(filter).exec()
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
