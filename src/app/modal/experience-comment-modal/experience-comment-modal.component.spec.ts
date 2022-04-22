import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceCommentModalComponent } from './experience-comment-modal.component';

describe('ExperienceCommentModalComponent', () => {
  let component: ExperienceCommentModalComponent;
  let fixture: ComponentFixture<ExperienceCommentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
