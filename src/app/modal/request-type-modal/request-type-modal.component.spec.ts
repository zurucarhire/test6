import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTypeModalComponent } from './request-type-modal.component';

describe('RequestTypeModalComponent', () => {
  let component: RequestTypeModalComponent;
  let fixture: ComponentFixture<RequestTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
