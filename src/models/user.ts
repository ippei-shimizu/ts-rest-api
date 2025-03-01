export interface User {
  id: number;
  name: string;
  email: string;
}

export const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john_doe@example.com' },
  { id: 2, name: 'Mary Smith', email: 'mary_smith@example.com' },
  { id: 3, name: 'Kevin Brown', email: 'kevin_brown@example.com' },
];
