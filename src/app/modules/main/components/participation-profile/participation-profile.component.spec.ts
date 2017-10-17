import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationProfileComponent } from './participation-profile.component';

describe('ParticipationProfileComponent', () => {
  let component: ParticipationProfileComponent;
  let fixture: ComponentFixture<ParticipationProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipationProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
