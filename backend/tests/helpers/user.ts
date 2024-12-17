import { UserRepository } from '../../src/database/repository/user.repository';
import { Database } from '../../src/database';

export class UserTestHelper {
  private userRepository: UserRepository;

  constructor(database: Database) {
    this.userRepository = new UserRepository(database);
  }

  async createUser(data: {
    id: string;
    email: string;
    password: string;
    username: string;
    createdAt: Date;
  }) {
    return this.userRepository.createUser(data);
  }

  
}