import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import * as middy from 'middy'
//import middy from '@middy/core'
//import { cors, httpErrorHandler } from 'middy/middlewares'
//import cors from '@middy/http-cors'
//import httpErrorHandler from '@middy/http-error-handler'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  logger.info(`deleteTodo call`)
    const todoId = event.pathParameters.todoId
    // Remove a TODO item by id
    const userId = getUserId(event);
    await deleteTodo(userId, todoId);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: `Deleted item: ${todoId}`
    }
  }

/*
handler
  .use(httpErrorHandler())
  .use(
    cors()
  )
*/