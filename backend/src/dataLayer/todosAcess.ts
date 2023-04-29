// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWS = require('aws-sdk')
const AWSXRay = require('aws-xray-sdk')

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

 const logger = createLogger('TodosAccess')

// DataLayer logic layer implementation
export class TodosAccess{
    constructor(
        private readonly docClient:DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly tableName = process.env.TODOS_TABLE, 
        private readonly idx = process.env.TODOS_CREATED_AT_INDEX
    ){}

    async getTodosForUser(userId:string): Promise<TodoItem[]>{
        logger.info("Get All todo items for a user");
        
        const results = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.idx,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return results.Items as TodoItem[]
    }

    async createTodo(newTodo:TodoItem):Promise<TodoItem>{
        logger.info("Create new todo item")
        await this.docClient.put({
            TableName: this.tableName,
            Item: newTodo
        }).promise()

        return newTodo
    }

    async updateTodo(userId:string, todoId:string, update:TodoUpdate):Promise<string>{
        logger.info("Updating todo item")
        await this.docClient.update({
            TableName: this.tableName,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
              "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": update.name,
                ":dueDate": update.dueDate,
                ":done": update.done
            }
        }).promise()

        return "Todo item updated"
    }

    async deleteTodo(todoId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.tableName,
            Key: {
                userId,
                todoId
            }
        }).promise()
    }
    async updateAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<String> {
        logger.info(`Updating attachment URL`)
    
        await this.docClient.update({
          TableName: this.tableName,
          Key: {
            userId,
            todoId
          },
          UpdateExpression: "set attachmentUrl = :a",
          ExpressionAttributeValues: {
            ':a': attachmentUrl
          }
        }).promise()

        return "Attachment Updated"
    
    }
    
}