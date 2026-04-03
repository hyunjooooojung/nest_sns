import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>
    ) {}

    async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>): Promise<UsersModel> {
        // 1) nickname 중복 체크
        // exist(): 조건에 해당하는 값이 있으면 true 반환
        const isNicknameExists = await this.usersRepository.exists({
            where: {
                nickname: user.nickname,
            }
        });
        if (isNicknameExists) {
            throw new BadRequestException('이미 존재하는 닉네임입니다.');
        }

        // 2) email 중복 체크
        const isEmailExists = await this.usersRepository.exists({
            where: {
                email: user.email,
            }
        });
        if (isEmailExists) {
            throw new BadRequestException('이미 존재하는 이메일입니다.');
        }

        // 3) 사용자 생성
        const newUser = this.usersRepository.create({
            nickname: user.nickname,
            email: user.email,
            password: user.password,
        });

        const savedUser = await this.usersRepository.save(newUser);
        return savedUser;
    }

    async getAllUsers() {
        return this.usersRepository.find();
    }

    async findUserByEmail(email: string) {
        return this.usersRepository.findOne({
            where: { email },
        });
    }
}
