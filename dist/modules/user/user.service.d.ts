import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private usersRepo;
    constructor(usersRepo: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    update(id: number, updateData: Partial<User>): Promise<User | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
