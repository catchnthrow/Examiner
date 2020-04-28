import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuestionPaperComponent } from './new-question-paper.component';

describe('NewQuestionPaperComponent', () => {
  let component: NewQuestionPaperComponent;
  let fixture: ComponentFixture<NewQuestionPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewQuestionPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewQuestionPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
