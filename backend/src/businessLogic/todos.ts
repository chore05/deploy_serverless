import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// Implementation of businessLogic
const logger = createLogger("Todo Logic");
const todosAcess = new TodosAccess();

export async function getTodosForUser(userId:string):Promise<TodoItem[]> {
    logger.info("Querying database for Todo items ...");
    try{
        return await todosAcess.getTodosForUser(userId)
    } catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function createTodo(userId:string, item:CreateTodoRequest):Promise<TodoItem>{
    const todoId:uuid = uuid.v4();
    const s3BucketName:string = process.env.ATTACHMENT_S3_BUCKET;
    const key:string = `${todoId}-img`
    const todo:TodoItem = {
        'userId': userId,
        'todoId': todoId,
        'name': item.name,
        'createdAt': Date.now().toString(),
        'dueDate': item.dueDate,
        'done': false,
        'attachmentUrl': `https://${s3BucketName}.s3.amazonaws.com/${key}`
    }
    logger.info("Add Todo items to database ...");
    try{
        return await todosAcess.createTodo(todo)
    } catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function updateTodo(userId:string, todoId:string, item:UpdateTodoRequest)
:Promise<UpdateTodoRequest>{
        logger.info("Updating to item...");
        try{
             return todosAcess.updateTodo(userId, todoId, item)
        } catch(err){
            logger.error("Error: ", createError(err.message));
        }
}

export async function deleteTodo(userId:string, todoId:string){
    logger.info("Deleteing todo item...");
    try{
        await todosAcess.deleteTodo(userId, todoId)
    } catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function createAttachmentPresignedUrl(todoId:string): Promise<string>{
    logger.info("Creating signed url ...");
    const attachmentUtils = new AttachmentUtils()
    try{
        return await attachmentUtils.createUploadUrl(todoId)
    } catch(err){
        logger.error("Error: ", createError(err.message));
    }
}