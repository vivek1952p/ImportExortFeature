import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Synctable } from './synctable';

describe('Synctable', () => {
  let component: Synctable;
  let fixture: ComponentFixture<Synctable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Synctable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Synctable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
