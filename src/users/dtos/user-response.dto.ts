import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { UserRole } from "../domain/user-role.enum";

@Exclude()
export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  cpf!: string;

  @ApiProperty({ enum: UserRole })
  @Expose()
  role!: UserRole;

  @ApiProperty({ nullable: true })
  @Expose()
  avatarUrl!: string | null;

  @ApiProperty()
  @Expose()
  isActive!: boolean;
}
