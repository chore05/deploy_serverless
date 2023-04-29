import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
//import * as middy from 'middy'
//import middy from '@middy/core'
//import { cors } from 'middy/middlewares'
//import cors from '@middy/http-cors'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`createTodo call`)

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // creating a new TODO item
    const userId = getUserId(event);
    const result = await createTodo(userId, newTodo);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: result
      })
    }
  }

/*
handler.use(
  cors()
)
*/