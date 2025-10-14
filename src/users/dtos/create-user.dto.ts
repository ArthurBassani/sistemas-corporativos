import { IsEmail, IsEnum, IsOptional, IsString, Length, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "../domain/user-role.enum";
import { Expose } from "class-transformer";

export class CreateUserDto {
  @ApiProperty({ minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ format: "email" })
  @IsEmail()
  email!: string;

  @ApiProperty({ format: "cpf" })
  cpf!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ enum: UserRole, enumName: "UserRole" })
  @IsOptional()
  @IsEnum(UserRole, { message: "role deve ser student | teacher | admin" })
  role?: UserRole;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}
