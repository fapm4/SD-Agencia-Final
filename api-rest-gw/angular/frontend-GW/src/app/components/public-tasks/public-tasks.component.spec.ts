import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTasksComponent } from './public-tasks.component';

describe('PublicTasksComponent', () => {
  let component: PublicTasksComponent;
  let fixture: ComponentFixture<PublicTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
