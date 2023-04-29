import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import * as middy from 'middy'
//import middy from '@middy/core'
//import { cors, httpErrorHandler } from 'middy/middlewares'
//import cors from '@middy/http-cors'
//import httpErrorHandler from '@middy/http-error-handler'
import { AttachmentUtils } from '../../helpers/attachmentUtils'
import { updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

const image_bucket_name = process.env.ATTACHMENT_S3_BUCKET;
const attachmentUtil = new AttachmentUtils()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`generateUploadUrl call`)
  const todoId = event.pathParameters.todoId
  const AttachmentUrl: string = `https://${image_bucket_name}.s3.amazonaws.com/${todoId}`;

  await updateAttachmentUrl(todoId, getUserId(event), AttachmentUrl)

  // Return a presigned URL to upload a file for a TODO item with the provided id
  const uploadUrl = await attachmentUtil.createUploadUrl(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}

/*
handler
  .use(httpErrorHandler())
  .use(
    cors()
  )
*/