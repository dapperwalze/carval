import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminGuard, Authguard } from '../guards';
import { ApprovedBodyDto, CreateReportDto } from './dtos';
import { ReportsService } from './reports.service';
import { GetUser } from '../users/decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors';
import { ReportDto, GetEstimateDto } from './dtos';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('get-estimate')
  getEstimate(@Query() query: GetEstimateDto) {
    console.log({ query });
    return this.reportsService.createEstimate(query);
  }

  @Post('create')
  @UseGuards(Authguard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @GetUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApprovedBodyDto,
  ) {
    const { approved } = body;
    return this.reportsService.changeApproval(id, approved);
  }
}
