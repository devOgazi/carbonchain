import { Controller, Get, Param } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditMetadata } from '../../../shared';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get(':id')
  async getCredit(@Param('id') id: string): Promise<CreditMetadata> {
    return this.creditsService.getCredit(id);
  }

  @Get('project/:projectId')
  async listByProject(@Param('projectId') projectId: string): Promise<string[]> {
    return this.creditsService.listCreditsByProject(projectId);
  }
}
