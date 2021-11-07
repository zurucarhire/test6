import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NilNavBarComponent } from './nil-nav-bar.component';

describe('NilNavBarComponent', () => {
  let component: NilNavBarComponent;
  let fixture: ComponentFixture<NilNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NilNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NilNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
