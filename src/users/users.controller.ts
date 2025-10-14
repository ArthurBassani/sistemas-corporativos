import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserResponseDto } from "./dtos/user-response.dto";
import { plainToInstance } from "class-transformer";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({
    summary: "Criar usuário",
    description:
      "Cria um usuário com name, email, password e role (opcional). Retorna o usuário sem o hash da senha.",
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      exemploBasico: {
        summary: "Exemplo completo",
        value: {
          name: "Ada Lovelace",
          email: "ada@example.com",
          password: "s3nh@-forte",
          role: "teacher",
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Usuário criado com sucesso.",
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: "Payload inválido (validação do DTO)." })
  @ApiConflictResponse({ description: "E-mail ou CPF já registrado." })
  @ApiUnauthorizedResponse({ description: "Não autenticado (se houver autenticação)." })
  @ApiForbiddenResponse({ description: "Sem permissão (se houver autorização)." })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.service.create(dto);
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async getAll() {
    const users = await this.service.getAll();
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }
}
