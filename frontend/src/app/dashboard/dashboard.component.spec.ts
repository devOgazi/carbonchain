import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { CreditStore } from '../core/store/credit.store';
import { StellarWalletService } from '../core/services/stellar-wallet.service';
import { ApiService } from '../core/services/api.service';
import { CreditMetadata, CreditStatus, RetirementRecord } from '@shared';
import { signal } from '@angular/core';

const mockCredit: CreditMetadata = {
  id: 'credit-001',
  project_id: 'proj-001',
  issuer: 'GISSUER',
  vintage_year: 2023,
  methodology: 'VCS',
  geography: 'BR',
  tonnes: '2000000',
  ipfs_hash: 'bafybei123',
  status: CreditStatus.Active,
  issued_at: 1700000000,
};

const mockRetirement: RetirementRecord = {
  id: 'ret-001',
  credit_id: 'credit-001',
  buyer: 'GBUYER',
  tonnes_retired: '1000000',
  reason: '2024 Scope 3',
  retired_at: 1700100000,
  tx_hash: 'txhash123456',
};

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let storeSpy: jasmine.SpyObj<CreditStore>;
  let walletSpy: jasmine.SpyObj<StellarWalletService>;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('CreditStore', ['loadByProject', 'select'], {
      credits: signal([mockCredit]),
      activeCredits: signal([mockCredit]),
      retiredCredits: signal([]),
      isLoading: signal(false),
      error: signal(null),
      selectedId: signal(null),
      selected: signal(null),
      totalTonnes: signal(BigInt(2000000)),
    });
    storeSpy.loadByProject.and.returnValue(Promise.resolve());

    walletSpy = jasmine.createSpyObj('StellarWalletService', ['connect', 'isConnected', 'publicKey', 'state', 'error'], {});
    walletSpy.isConnected.and.returnValue(true);
    walletSpy.publicKey.and.returnValue('GPUBKEY123');
    walletSpy.state.and.returnValue('connected');
    walletSpy.error.and.returnValue(null);

    apiSpy = jasmine.createSpyObj('ApiService', ['getRetirement']);
    apiSpy.getRetirement.and.returnValue(of(mockRetirement));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: CreditStore, useValue: storeSpy },
        { provide: StellarWalletService, useValue: walletSpy },
        { provide: ApiService, useValue: apiSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders portfolio summary stats', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Total Credits');
    expect(text).toContain('Active');
    expect(text).toContain('Retired');
    expect(text).toContain('Total Tonnes');
  });

  it('renders credit table rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('.credits-table__row') as NodeList;
    expect(rows.length).toBeGreaterThan(0);
  });

  it('shows retirement history section', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Retirement History');
  });

  it('shows "No retirements yet" when list is empty', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('No retirements yet');
  });

  it('formatTonnes converts correctly', () => {
    expect(component.formatTonnes('2000000')).toBe('2 t');
  });

  it('formatDate converts unix timestamp', () => {
    const result = component.formatDate(1700000000);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('selectCredit calls store.select', () => {
    component.selectCredit('credit-001');
    expect(storeSpy.select).toHaveBeenCalledWith('credit-001');
  });
});
