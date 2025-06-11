import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageToWordComponent } from './image-to-word.component';

describe('ImageToWordComponent', () => {
  let component: ImageToWordComponent;
  let fixture: ComponentFixture<ImageToWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageToWordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageToWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
