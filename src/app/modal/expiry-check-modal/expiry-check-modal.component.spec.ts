import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryCheckModalComponent } from './expiry-check-modal.component';

describe('ExpiryCheckModalComponent', () => {
  let component: ExpiryCheckModalComponent;
  let fixture: ComponentFixture<ExpiryCheckModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryCheckModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
