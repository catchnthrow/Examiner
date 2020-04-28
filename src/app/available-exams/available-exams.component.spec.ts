import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableExamsComponent } from './available-exams.component';

describe('AvailableExamsComponent', () => {
  let component: AvailableExamsComponent;
  let fixture: ComponentFixture<AvailableExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
