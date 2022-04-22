import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopNavbarComponent } from './shop-navbar.component';

describe('ShopNavbarComponent', () => {
  let component: ShopNavbarComponent;
  let fixture: ComponentFixture<ShopNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
