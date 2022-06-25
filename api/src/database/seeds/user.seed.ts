import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enum/role.enum';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { username: 'user1', password: 'password', role: Role.User },
        { username: 'user2', password: 'password', role: Role.User },
        { username: 'user3', password: 'password', role: Role.User },
        { username: 'user4', password: 'password', role: Role.User },
        { username: 'user5', password: 'password', role: Role.User },
        { username: 'admin', password: 'password', role: Role.Admin },
      ])
      .execute();
  }
}
