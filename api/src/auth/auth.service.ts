import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Account,
  Transaction,
  StrKey,
} from '@stellar/stellar-sdk';
import { StellarKeypairService } from '../stellar/stellar-keypair.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly networkPassphrase: string;
  private readonly serverHomeDomain: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly keypairService: StellarKeypairService,
  ) {
    const network = this.configService.get<string>('STELLAR_NETWORK', 'TESTNET');
    this.networkPassphrase = network === 'PUBLIC' ? Networks.PUBLIC : Networks.TESTNET;
    this.serverHomeDomain = this.configService.get<string>('HOME_DOMAIN', 'localhost');
  }

  /**
   * SEP-10 §3.1 — Build a challenge transaction.
   * The server signs a transaction with a random nonce operation (manageData)
   * and returns it for the client wallet to sign.
   */
  async generateChallenge(
    clientAccount: string,
  ): Promise<{ transaction: string; network_passphrase: string }> {
    if (!clientAccount || !StrKey.isValidEd25519PublicKey(clientAccount)) {
      throw new BadRequestException('Invalid Stellar account address');
    }

    const serverKeypair = this.keypairService.getAdminKeypair();

    // SEP-10 requires sequence 0 for the challenge account
    const account = new Account(serverKeypair.publicKey(), '-1');

    const nonce = Buffer.from(Keypair.random().rawPublicKey()).toString('base64');

    const tx = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(
        Operation.manageData({
          name: `${this.serverHomeDomain} auth`,
          value: nonce,
          source: clientAccount,
        }),
      )
      .setTimeout(300) // 5-minute window per SEP-10
      .build();

    tx.sign(serverKeypair);

    return {
      transaction: tx.toEnvelope().toXDR('base64'),
      network_passphrase: this.networkPassphrase,
    };
  }
}
