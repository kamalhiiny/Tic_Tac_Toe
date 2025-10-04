import { cn } from "@/lib/utils";

type CellValue = 'X' | 'O' | null;

interface GameBoardProps {
  board: CellValue[];
  onCellClick: (index: number) => void;
  disabled: boolean;
  lastMove: number | null;
  winningLine: number[] | null;
}

export const GameBoard = ({ board, onCellClick, disabled, lastMove, winningLine }: GameBoardProps) => {
  const isWinningCell = (index: number) => winningLine?.includes(index);
  const isLastMove = (index: number) => lastMove === index;

  return (
    <div className="grid grid-cols-3 gap-3 p-6 bg-card rounded-2xl shadow-lg">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
          className={cn(
            "aspect-square rounded-xl text-5xl font-bold transition-all duration-300",
            "flex items-center justify-center",
            "disabled:cursor-not-allowed",
            // Base styles
            "bg-[hsl(var(--board-cell))]",
            // Hover effect
            !cell && !disabled && "hover:bg-[hsl(var(--board-hover))] hover:scale-105",
            !cell && !disabled && "hover:shadow-[var(--shadow-cell-hover)]",
            // Shadow
            "shadow-[var(--shadow-cell)]",
            // Last move highlight
            isLastMove(index) && "ring-4 ring-primary ring-opacity-50",
            // Winning cell highlight
            isWinningCell(index) && "animate-pulse-glow bg-[hsl(var(--winning-glow)_/_0.2)]",
            // Cell value colors
            cell === 'X' && "text-[hsl(var(--player-x))]",
            cell === 'O' && "text-[hsl(var(--player-o))]"
          )}
        >
          {cell && (
            <span className="animate-slide-up">
              {cell}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
