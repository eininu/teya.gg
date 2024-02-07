import {WebsitesService} from "../websites/websites.service";
import {NextFunction} from "express";
import {Injectable, NestMiddleware} from "@nestjs/common";

@Injectable()
export class TriggerBuildMiddleware implements NestMiddleware {
    constructor(private readonly websitesService: WebsitesService) {}
    public async use(req: Request, res: Response, next: NextFunction) {
        await this.websitesService.triggerWebsitesBuild();
        next();
    }
}