import { Task } from '../task/task.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    tasks: Task[];
}
