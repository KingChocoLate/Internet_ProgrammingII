import { User } from '../user/user.entity';
export declare class Task {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    completedAt: Date;
    user: User;
}
