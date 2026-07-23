import { TestBed } from '@angular/core/testing';
import { BaseModalComponent } from './base-modal.component';

describe('BaseModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseModalComponent],
    }).compileComponents();
  });

  it('is closed by default', () => {
    const fixture = TestBed.createComponent(BaseModalComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.modal')).toBeNull();
  });

  it('renders the title and emits confirm/cancel', () => {
    const fixture = TestBed.createComponent(BaseModalComponent);
    fixture.componentRef.setInput('opened', true);
    fixture.componentRef.setInput('title', '¿Abandonar la partida?');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('¿Abandonar la partida?');

    const confirmed = vi.fn();
    const cancelled = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    fixture.componentInstance.cancelled.subscribe(cancelled);

    (host.querySelector('.btn--primary') as HTMLButtonElement).click();
    (host.querySelector('.btn--ghost') as HTMLButtonElement).click();

    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(cancelled).toHaveBeenCalledTimes(1);
  });
});
