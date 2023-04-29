import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import * as middy from 'middy'
//import middy from '@middy/core'
//import { cors, httpErrorHandler } from 'middy/middlewares'
//import cors from '@middy/http-cors'
//import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`updateTodo call`)

  const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId = getUserId(event);
    const updated = await updateTodo(userId, todoId, updatedTodo);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        updated
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