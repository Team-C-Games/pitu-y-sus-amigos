import { TestBed } from '@angular/core/testing';
import { LoadingOverlayComponent } from './loading-overlay.component';

describe('LoadingOverlayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingOverlayComponent],
    }).compileComponents();
  });

  it('is hidden by default', () => {
    const fixture = TestBed.createComponent(LoadingOverlayComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.overlay')).toBeNull();
  });

  it('shows the provided message when visible', () => {
    const fixture = TestBed.createComponent(LoadingOverlayComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('message', 'Reconectando con la partida…');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.overlay')).not.toBeNull();
    expect(host.textContent).toContain('Reconectando con la partida…');
  });
});
