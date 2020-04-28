import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExamComponent } from './admin-exam.component';

describe('AdminExamComponent', () => {
  let component: AdminExamComponent;
  let fixture: ComponentFixture<AdminExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
