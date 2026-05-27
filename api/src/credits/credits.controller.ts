import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CreditsService, IssueCreditDto } from './credits.service';
import { CreditMetadata } from '../shared';
import { ThrottlerGuard, Throttle } from '../common/throttler.guard';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  /** POST /credits/issue — 5 requests per minute per IP */
  @UseGuards(ThrottlerGuard)
  @Throttle({ limit: 5, ttl: 60_000 })
  @Post('issue')
  issueCredit(@Body() dto: IssueCreditDto): Promise<{ creditId: string }> {
    return this.creditsService.issueCredit(dto);
  }

  @Get(':id')
  async getCredit(@Param('id') id: string): Promise<CreditMetadata> {
    return this.creditsService.getCredit(id);
  }

  @Get('project/:projectId')
  async listByProject(
    @Param('projectId') projectId: string,
  ): Promise<string[]> {
    return this.creditsService.listCreditsByProject(projectId);
  }
}
