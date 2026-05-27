import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from '../shared';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @ApiOperation({ summary: 'Create a sell offer' })
  @Post('offer')
  createOffer(@Body() dto: CreateOfferDto): Promise<{ offerId: string }> {
    return this.marketplaceService.createOffer(dto);
  }

  @ApiOperation({ summary: 'Get offer by ID' })
  @Get('offer/:id')
  getOffer(@Param('id', ParseIntPipe) id: number): Promise<Offer> {
    return this.marketplaceService.getOffer(id);
  }

  @ApiOperation({ summary: 'Get offers by seller address' })
  @Get('seller/:address')
  getOffersBySeller(@Param('address') address: string): Promise<string[]> {
    return this.marketplaceService.getOffersBySeller(address);
  }

  @ApiOperation({ summary: 'Cancel an offer' })
  @Delete('offer/:id/seller/:address')
  cancelOffer(
    @Param('address') address: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.marketplaceService.cancelOffer(address, id);
  }
}
