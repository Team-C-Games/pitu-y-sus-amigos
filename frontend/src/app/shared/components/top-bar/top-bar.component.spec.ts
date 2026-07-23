import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TopBarComponent } from './top-bar.component';

describe('TopBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders safely without inputs (defaults)', () => {
    const fixture = TestBed.createComponent(TopBarComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('El Laberinto Mágico');
    expect(host.textContent).toContain('Sin conexión');
  });

  it('shows connection and player info', () => {
    const fixture = TestBed.createComponent(TopBarComponent);
    fixture.componentRef.setInput('connectionStatus', 'connected');
    fixture.componentRef.setInput('playerName', 'Pitu');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('Conectado');
    expect(host.textContent).toContain('Pitu');
  });
});
