import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "./domain/user-role.enum";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ConflictException } from "@nestjs/common";
import { Repository, QueryFailedError } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async getAll() {
    const users = await this.repo.find();
    return users.map((u) => this.stripSensitive(u));
  }

  async create(dto: CreateUserDto) {
    const email = this.normalizeEmail(dto.email);
    const name = this.normalizeName(dto.name);
    const cpf = this.normalizeCpf(dto.cpf);

    const exists = await this.repo.findOne({ where: { email, cpf } });
    if (exists) throw new ConflictException("E-mail ou CPF já registrado.");

    const pepper = process.env.HASH_PEPPER ?? "";
    const entity = this.repo.create(
      new User({
        name,
        email,
        cpf: cpf,
        passwordHash: await this.hash(dto.password + pepper),
        role: dto.role ?? UserRole.CANDIDATE,
      }),
    );
    try {
      const saved = await this.repo.save(entity);
      return this.stripSensitive(saved);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === "23505") {
        throw new ConflictException("E-mail já registrado.");
      }
      throw err;
    }
  }

  private normalizeName(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0].toUpperCase() + part.substring(1).toLowerCase())
      .join(" ");
  }

  private normalizeCpf(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private stripSensitive(u: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = u;
    return safe;
  }

  private async hash(plain: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
  }
}
