import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuestionPapersComponent } from './my-question-papers.component';

describe('MyQuestionPapersComponent', () => {
  let component: MyQuestionPapersComponent;
  let fixture: ComponentFixture<MyQuestionPapersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQuestionPapersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQuestionPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
