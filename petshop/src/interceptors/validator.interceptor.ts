import { NestInterceptor, ExecutionContext, CallHandler, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Contract } from "src/backoffice/contracts/contract";
import { Result } from "src/backoffice/models/result.model";
import { tap } from 'rxjs/operators';

@Injectable()
export class ValidatorInterceptor implements NestInterceptor {
    constructor(public contract: Contract) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): 
        import("rxjs").Observable<any> | Promise<import("rxjs").Observable<any>> {
        const now = Date.now();
        console.log('Antes...');

        const body = context.switchToHttp().getRequest().body;
        const valid = this.contract.validate(body);

        if(!valid) {
            throw new HttpException(
                new Result(
                    false, 
                    "Ops, algo saiu errado!", 
                    null,
                    this.contract.errors
                    ), 
                        HttpStatus.BAD_REQUEST
                    );    
        }

        return next
        .handle()
        .pipe(
            tap(() => console.log(`Depois... ${Date.now() - now}ms`)),
        );
    }
}