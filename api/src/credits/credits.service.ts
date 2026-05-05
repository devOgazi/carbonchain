import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StellarService } from '../stellar/stellar.service';
import { xdr, scValToNative, nativeToScVal } from '@stellar/stellar-sdk';
import { CreditMetadata, CreditStatus } from '../../../shared';

@Injectable()
export class CreditsService {
  private readonly logger = new Logger(CreditsService.name);
  private readonly contractId: string;

  constructor(
    private stellarService: StellarService,
    private configService: ConfigService,
  ) {
    this.contractId = this.configService.get<string>('CREDIT_REGISTRY_CONTRACT_ID') || '';
  }

  async getCredit(creditId: string): Promise<CreditMetadata> {
    try {
      this.logger.log(`Fetching credit metadata for ID: ${creditId}`);
      
      const args = [nativeToScVal(Buffer.from(creditId, 'hex'), { type: 'bytes' })];
      const retval = await this.stellarService.readContract(this.contractId, 'get_credit', args);
      
      if (!retval) {
        throw new NotFoundException(`Credit with ID ${creditId} not found on-chain`);
      }

      const native = scValToNative(retval);
      return this.mapToCreditMetadata(creditId, native);
    } catch (error) {
      this.logger.error(`Failed to fetch credit ${creditId}: ${error.message}`);
      throw error;
    }
  }

  async listCreditsByProject(projectId: string): Promise<string[]> {
    try {
      this.logger.log(`Listing credits for project: ${projectId}`);
      
      const args = [nativeToScVal(projectId, { type: 'string' })];
      const retval = await this.stellarService.readContract(this.contractId, 'list_credits_by_project', args);
      
      if (!retval) {
        return [];
      }

      const native = scValToNative(retval) as Buffer[];
      return native.map(buf => buf.toString('hex'));
    } catch (error) {
      this.logger.error(`Failed to list credits for project ${projectId}: ${error.message}`);
      return [];
    }
  }

  private mapToCreditMetadata(id: string, native: any): CreditMetadata {
    return {
      id,
      project_id: native.project_id.toString(),
      issuer: native.issuer.toString(), // Address to string
      vintage_year: Number(native.vintage_year),
      methodology: native.methodology.toString(),
      geography: native.geography.toString(),
      tonnes: native.tonnes.toString(), // i128 to string
      ipfs_hash: native.ipfs_hash.toString(),
      status: native.status as CreditStatus,
      issued_at: Number(native.issued_at),
    };
  }
}
