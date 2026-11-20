import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsEmail({}, { message: 'email must be a valid email address.' })
  @MaxLength(100)
  email: string;

  // Secure password policy (Lab 06): 8+ chars, upper, lower, number, symbol
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message: 'password must contain upper case, lower case, number and symbol.',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'role must be Admin, Supervisor or Operator.' })
  role?: Role;
}
