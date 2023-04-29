import { TodosAccess } from '../dataLayer/todosAcess'
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
    const todo:TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: item.name,
        dueDate: item.dueDate,
        done: false,
        attachmentUrl: null
    }
    logger.info("Add Todo items to database ...");
    try{
        return await todosAcess.createTodo(todo)
    } catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function updateTodo(userId:string, todoId:string, item:UpdateTodoRequest)
:Promise<string>{
        logger.info("Updating to item...");
        try{
             return todosAcess.updateTodo(userId, todoId, item)
        } catch(err){
            logger.error("Error: ", createError(err.message));
        }
}

export async function deleteTodo(userId:string, todoId:string){
    logger.info("Deleting todo item...");
    try{
        await todosAcess.deleteTodo(todoId, userId)
    } catch(err){
        logger.error("Error: ", createError(err.message))
    }
}

export async function updateAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<String> {
    return todosAcess.updateAttachmentUrl(todoId, userId, attachmentUrl)
}
