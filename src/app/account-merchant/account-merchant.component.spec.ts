import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMerchantComponent } from './account-merchant.component';

describe('AccountMerchantComponent', () => {
  let component: AccountMerchantComponent;
  let fixture: ComponentFixture<AccountMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMerchantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
