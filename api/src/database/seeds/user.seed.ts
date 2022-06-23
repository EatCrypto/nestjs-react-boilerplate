import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enum/role.enum';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    console.log('user seed');
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { username: 'thain', password: 'user', role: Role.User },
        { username: 'admin', password: 'admin', role: Role.Admin },
      ])
      .execute();
  }
}
