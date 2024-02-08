import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {WebsitesService} from "../websites/websites.service";

@Injectable()
export class TriggerBuildInterceptor implements NestInterceptor {
    constructor(@Inject(WebsitesService) private readonly websiteService: WebsitesService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap(() => {
                this.websiteService.triggerWebsitesBuild()
            }),
        );
    }
}
