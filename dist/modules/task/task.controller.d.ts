import { TaskService } from './task.service';
export declare class TasksController {
    private readonly taskService;
    constructor(taskService: TaskService);
    findAll(): Promise<import("./task.entity").Task[]>;
    getTask(id: string): Promise<import("./task.entity").Task | null>;
    createTask(body: any): Promise<import("./task.entity").Task>;
    markTaskAsDone(id: string): Promise<import("./task.entity").Task | null>;
    markTaskAsPending(id: string): Promise<import("./task.entity").Task | null>;
    deleteTask(id: string): Promise<import("typeorm").DeleteResult>;
}
