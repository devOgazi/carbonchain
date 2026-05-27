import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreditsService } from './credits.service';
import { IssueCreditDto } from './dto/issue-credit.dto';
import { CreditMetadata } from '../shared';

@ApiTags('credits')
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @ApiOperation({ summary: 'Issue a new carbon credit' })
  @Post('issue')
  issueCredit(@Body() dto: IssueCreditDto): Promise<{ creditId: string }> {
    return this.creditsService.issueCredit(dto);
  }

  @ApiOperation({ summary: 'Get credit by ID' })
  @Get(':id')
  async getCredit(@Param('id') id: string): Promise<CreditMetadata> {
    return this.creditsService.getCredit(id);
  }

  @ApiOperation({ summary: 'List credits by project' })
  @Get('project/:projectId')
  async listByProject(
    @Param('projectId') projectId: string,
  ): Promise<string[]> {
    return this.creditsService.listCreditsByProject(projectId);
  }
}
