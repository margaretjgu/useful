export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO 8601 format
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  assignedUserId?: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  assignedUserId?: string;
}
  
export interface TaskRepository {
    createTask(task: Task): Promise<Task>;
    getTasks(): Promise<Task[]>;
}
  