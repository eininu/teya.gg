import {Body, Controller, Delete, Get, Param, Patch, Query} from "@nestjs/common";
import {MonitoringService} from "./monitoring.service";
import {Monitoring} from "./entities/monitoring.entity";
import {GetMonitoringDomains, GetMonitoringDomainsQuery} from "./types/get-monitoring-domains.type";
import {DeleteResult} from "typeorm";

@Controller('monitoring')
export class MonitoringController {
    constructor(private readonly monitoringService: MonitoringService) {
    }

    @Get('monitoring-domains')
    public getMonitoringDomains(@Query() query: GetMonitoringDomainsQuery): Promise<GetMonitoringDomains | undefined> {
        return this.monitoringService.getMonitoringDomains(query)
    }

    @Patch('update/:id')
    public updateDomain(@Param('id') id: string , @Body() dto: Partial<Monitoring>): Promise<Monitoring | undefined> {
        return this.monitoringService.updateDomain(id, dto)
    }

    @Patch('update-date/:id')
    public updatedExpiredDate(@Param('id') id: string): Promise<Monitoring | undefined> {
        return this.monitoringService.updatedExpiredDate(id);
    }

    @Patch('update-all-dates')
    public updateAllDates(): Promise<Monitoring[] | void> {
        return this.monitoringService.updateAllDates();
    }


    @Delete('/:id')
    public deleteDomain(@Param('id') id: string): Promise<DeleteResult | void> {
        return this.monitoringService.deleteDomain(id);
    }
}