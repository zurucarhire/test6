import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailModalComponent } from './shop-detail-modal.component';

describe('ShopDetailModalComponent', () => {
  let component: ShopDetailModalComponent;
  let fixture: ComponentFixture<ShopDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
