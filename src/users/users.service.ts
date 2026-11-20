import { ConflictException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  // Creates the first Admin account automatically if the users table is empty
  async onModuleInit() {
    const count = await this.usersRepo.count();
    if (count === 0) {
      await this.create({
        fullName: 'System Administrator',
        email: this.config.get<string>('ADMIN_EMAIL', 'admin@factory.com'),
        password: this.config.get<string>('ADMIN_PASSWORD', 'Admin@1234'),
        role: Role.Admin,
      });
      this.logger.log('Default Admin account created.');
    }
  }

  async create(dto: CreateUserDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email is already registered.');

    const passwordHash = await bcrypt.hash(dto.password, 10); // never store plain text
    const user = this.usersRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      role: dto.role ?? Role.Operator,
    });
    const saved = await this.usersRepo.save(user);
    const { passwordHash: _hidden, ...safeUser } = saved;
    return safeUser;
  }

  findAll() {
    return this.usersRepo.find({ order: { userId: 'ASC' } });
  }

  findById(userId: number) {
    return this.usersRepo.findOne({ where: { userId } });
  }

  // Used only by login: includes the hidden passwordHash column
  findByEmailWithPassword(email: string) {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async updateFailedAttempts(userId: number, failedAttempts: number) {
    await this.usersRepo.update(userId, { failedAttempts });
  }
}
