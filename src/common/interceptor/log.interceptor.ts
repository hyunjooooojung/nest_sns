import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LogInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        /**
         * 요청이 들어올 때 req 요청이 들어온 타임스탬프를 찍는다.
         * [REQUEST] {요청 path} {요청 시간}
         * 
         * 요청이 끝날 때 (응답이 나갈 때) 다시 타임스탬프를 찍는다.
         * [RESPONSE] {요청 path} {응답 시간} {소요시간 ms}
         */
        const now = new Date();

        const request = context.switchToHttp().getRequest();
        
        const path = request.originalUrl;
        console.log(`[REQUEST] ${path} ${now.toLocaleString()}`);

        // return next.handle()을 실행하는 순간 라우트의 로직이 실행되고 응답이 반환된다. -> Observable로
        return next
            .handle()
            .pipe(
                tap(
                    (observable: any) => console.log(`[RESPONSE] ${path} ${now.toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`)
                ),
            );
    }
}