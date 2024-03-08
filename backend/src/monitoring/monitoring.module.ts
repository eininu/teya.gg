import {Global, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Monitoring} from "./entities/monitoring.entity";
import {MonitoringController} from "./monitoring.controller";
import {MonitoringService} from "./monitoring.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Monitoring])],
    controllers: [MonitoringController],
    providers: [MonitoringService],
    exports: [MonitoringService],
})
export class MonitoringModule {}