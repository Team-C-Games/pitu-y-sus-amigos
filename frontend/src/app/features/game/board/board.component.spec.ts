import { TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { BoardVisualState } from './models';

const DEMO_STATE: BoardVisualState = {
  size: 6,
  cells: [
    {
      position: { row: 1, column: 4 },
      kind: 'objective',
      symbol: '◈',
      label: 'Objetivo: Prisma arcano',
    },
  ],
  pieces: [
    { id: 'p1', color: '#3ee0ff', label: 'Pitu', position: { row: 0, column: 0 }, isActive: true },
    { id: 'p2', color: '#a78bfa', label: 'Nova', position: { row: 0, column: 5 } },
  ],
  walls: [{ position: { row: 2, column: 2 }, orientation: 'vertical', justRevealed: true }],
};

describe('BoardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BoardComponent] }).compileComponents();
  });

  function createBoard(interactive = false) {
    const fixture = TestBed.createComponent(BoardComponent);
    fixture.componentRef.setInput('boardVisualState', DEMO_STATE);
    fixture.componentRef.setInput('interactive', interactive);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a 6x6 grid of tiles', () => {
    const fixture = createBoard();
    const tiles = (fixture.nativeElement as HTMLElement).querySelectorAll('app-tile');
    expect(tiles.length).toBe(36);
  });

  it('renders objective symbols, pieces and revealed walls', () => {
    const fixture = createBoard();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('◈');
    expect(host.querySelectorAll('app-piece').length).toBe(2);
    expect(host.querySelectorAll('app-wall').length).toBe(1);
  });

  it('emits the selected tile only when interactive', () => {
    const fixture = createBoard(true);
    const selected = vi.fn();
    fixture.componentInstance.tileSelected.subscribe(selected);

    const tiles = (fixture.nativeElement as HTMLElement).querySelectorAll('app-tile');
    (tiles[7] as HTMLElement).click();

    expect(selected).toHaveBeenCalledWith({ row: 1, column: 1 });
  });

  it('does not emit selections for spectators', () => {
    const fixture = createBoard(false);
    const selected = vi.fn();
    fixture.componentInstance.tileSelected.subscribe(selected);

    const tiles = (fixture.nativeElement as HTMLElement).querySelectorAll('app-tile');
    (tiles[0] as HTMLElement).click();

    expect(selected).not.toHaveBeenCalled();
  });
});
