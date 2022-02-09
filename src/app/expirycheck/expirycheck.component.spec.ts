import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirycheckComponent } from './expirycheck.component';

describe('ExpirycheckComponent', () => {
  let component: ExpirycheckComponent;
  let fixture: ComponentFixture<ExpirycheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpirycheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpirycheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
