import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const QueryRunner = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();

        if(!request.queryRunner) {
            throw new InternalServerErrorException(
                'QueryRunner Decorator를 사용하려면 TransactionInterceptor를 적용해야 합니다.',
            )
        }
        
        return request.queryRunner;
    }
);