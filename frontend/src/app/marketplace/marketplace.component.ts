import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '@shared';
import { MarketplaceListComponent } from './marketplace-list.component';
import { OfferDetailComponent } from './offer-detail.component';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, MarketplaceListComponent, OfferDetailComponent],
  template: `
    <div class="marketplace">
      <h1>Marketplace</h1>

      <app-marketplace-list (offerSelected)="selectedOffer.set($event)" />

      @if (selectedOffer()) {
        <div class="overlay" (click)="selectedOffer.set(null)" aria-hidden="true"></div>
        <div class="modal">
          <app-offer-detail
            [offer]="selectedOffer()!"
            (closed)="selectedOffer.set(null)"
            (buy)="onBuy($event)"
          />
        </div>
      }
    </div>
  `,
  styles: [`
    .marketplace { max-width: 960px; margin: 0 auto; padding: 1rem; }
    h1 { margin-bottom: 1.5rem; }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 10; }
    .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 11; }
  `],
})
export class MarketplaceComponent {
  protected readonly selectedOffer = signal<Offer | null>(null);

  onBuy(offer: Offer): void {
    // TODO: wire up to retirement/purchase flow
    alert(`Buy flow for offer ${offer.id} — coming soon.`);
    this.selectedOffer.set(null);
  }
}
