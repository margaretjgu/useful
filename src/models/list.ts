export interface List {
  id: string;
  title: string;
  taskIds: string[];
  memberIds?: string[];
}

export interface ListInput {
  title: string;
  taskIds: string[];
  memberIds?: string[];
}

