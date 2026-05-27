import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RetirementService } from './retirement.service';
import { RetireDto } from './dto/retire.dto';
import { RetirementRecord } from '../shared';

@ApiTags('retirement')
@Controller('retirement')
export class RetirementController {
  constructor(private readonly retirementService: RetirementService) {}

  @ApiOperation({ summary: 'Retire a carbon credit' })
  @Post()
  retire(@Body() dto: RetireDto): Promise<{ retirementId: string }> {
    return this.retirementService.retire(dto);
  }

  @ApiOperation({ summary: 'Get retirement record by ID' })
  @Get(':id')
  getRetirement(@Param('id') id: string): Promise<RetirementRecord> {
    return this.retirementService.getRetirement(id);
  }

  @ApiOperation({ summary: 'List retirements by account address' })
  @Get('account/:address')
  getByAccount(@Param('address') address: string): Promise<string[]> {
    return this.retirementService.getRetirementsByAccount(address);
  }
}
