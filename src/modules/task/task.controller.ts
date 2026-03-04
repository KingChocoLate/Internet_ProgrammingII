import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Post('/')
  createTask(@Body() body: any) {
    const newTask = { ...body, createdAt: new Date().toISOString() };
    return this.taskService.create(newTask);
  }

  @Patch('/:id/done')
  markTaskAsDone(@Param('id') id: string) {
    return this.taskService.update(+id, { 
      completedAt: new Date().toISOString() 
    } as any);
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Param('id') id: string) {
    return this.taskService.update(+id, { 
      completedAt: null 
    } as any);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @Delete('/')
  clearAllTasks() {
    return this.taskService.clearAll();
  }
}
