import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UserService);
    create(body: createUserDto): Promise<import("./user.entity").User>;
    findAll(): Promise<import("./user.entity").User[]>;
    findOne(id: string): Promise<import("./user.entity").User | null>;
    update(id: string, body: Partial<createUserDto>): Promise<import("./user.entity").User | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
