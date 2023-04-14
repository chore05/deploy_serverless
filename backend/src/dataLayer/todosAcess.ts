import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// DataLayer logic layer implementation
export class TodosAccess{
    constructor(
        private readonly docClient:DocumentClient = XAWS.DynamoDB.DocumentClient(),
        private readonly tableName:string = process.env.TODOS_TABLE
    ){}

    async getTodosForUser(userId:string): Promise<TodoItem[]>{
        logger.info("Get All todo items for a user");
        const idx = process.env.TODOS_CREATED_AT_INDEX;
        const results = await this.docClient.query({
            TableName: this.tableName,
            IndexName: idx,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return results.Items as TodoItem[]
    }

    async createTodo(newTodo:TodoItem):Promise<TodoItem>{
        logger.info("Create new todo item")
         this.docClient.put({
            TableName: this.tableName,
            Item: newTodo
        })
        return newTodo
    }

    async updateTodo(userId:string, todoId:string, update:UpdateTodoRequest):Promise<TodoUpdate>{
        logger.info("Updating todo item")
        const result = await this.docClient.update({
            TableName: this.tableName,
            Key: {
                'userId': userId,
                'todoId': todoId
            },
            ExpressionAttributeNames:{
                '#TN': 'name',
                '#TDD': 'dueDate',
                '#TD': 'done'
            },
            ExpressionAttributeValues: {
                ':name': update.name,
                ':dueDate': update.dueDate,
                ':done': update.done
            },
            UpdateExpression: 'SET #TN=:name, #TDD=:dueDate, #TD=done',
            ReturnValues: 'UPDATED_TODOS'
        }).promise()

        return result.Attributes as TodoUpdate
    }

    async deleteTodo(userId:string, todoId:string){
        await this.docClient.delete({
            TableName: this.tableName,
            Key: {
                'userId': userId,
                'todoId': todoId
            }
        }).promise()
    }
}