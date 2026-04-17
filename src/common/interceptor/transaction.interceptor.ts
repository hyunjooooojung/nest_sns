import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, tap } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class TransactionInterceptor implements NestInterceptor{
    constructor(
        private readonly dataSource: DataSource,
    ){

    }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        // 트랜잭션 담당 쿼리 러너 생성
        const queryRunner = this.dataSource.createQueryRunner();

        // 쿼리 러너 연결 및 시작
        await queryRunner.connect();
        await queryRunner.startTransaction();

        request.queryRunner = queryRunner;

        return next.handle()
        .pipe(
            catchError(
                async (error) => {
                    await queryRunner.rollbackTransaction();
                    await queryRunner.release();
                    
                    throw new InternalServerErrorException(error.message);
                }
            ),
            tap(async () => {
                await queryRunner.commitTransaction();
                await queryRunner.release();
            })
        );
    }
}
