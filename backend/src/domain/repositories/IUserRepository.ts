import { User, CreateUserDTO, UpdateUserDTO } from '../entities/User';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(limit?: number, offset?: number): Promise<User[]>;
  update(id: string, data: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
  count(): Promise<number>;
}
