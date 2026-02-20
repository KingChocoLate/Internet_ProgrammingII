import { Repository } from 'typeorm';
import { Task } from './task.entity';
export declare class TaskService {
    private tasksRepo;
    constructor(tasksRepo: Repository<Task>);
    create(taskData: Partial<Task>): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: number): Promise<Task | null>;
    update(id: number, updateData: Partial<Task>): Promise<Task | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
