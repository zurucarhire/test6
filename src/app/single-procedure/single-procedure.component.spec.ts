import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProcedureComponent } from './single-procedure.component';

describe('SingleProcedureComponent', () => {
  let component: SingleProcedureComponent;
  let fixture: ComponentFixture<SingleProcedureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProcedureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
