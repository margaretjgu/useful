export interface Group {
    id: string;
    name: string;
    listIds: string[];
    memberIds: string[];
}
  
export interface GroupInput {
    name: string;
    listIds: string[];
    memberIds: string[];
}
  