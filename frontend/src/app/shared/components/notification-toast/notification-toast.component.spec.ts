import { TestBed } from '@angular/core/testing';
import { NotificationToastComponent } from './notification-toast.component';

describe('NotificationToastComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationToastComponent],
    }).compileComponents();
  });

  it('renders nothing without toasts', () => {
    const fixture = TestBed.createComponent(NotificationToastComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.toasts')).toBeNull();
  });

  it('renders toasts and emits close events', () => {
    const fixture = TestBed.createComponent(NotificationToastComponent);
    fixture.componentRef.setInput('toasts', [
      { id: 1, kind: 'success', text: 'Código copiado' },
      { id: 2, kind: 'error', text: 'Algo falló' },
    ]);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.toast').length).toBe(2);
    expect(host.textContent).toContain('Código copiado');

    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    (host.querySelector('.toast__close') as HTMLButtonElement).click();
    expect(closed).toHaveBeenCalledWith(1);
  });
});
