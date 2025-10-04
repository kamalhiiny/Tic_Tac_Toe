import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PlayerSelectorProps {
  open: boolean;
  onSelect: (symbol: 'X' | 'O') => void;
}

export const PlayerSelector = ({ open, onSelect }: PlayerSelectorProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Choose Your Symbol</DialogTitle>
          <DialogDescription className="text-center">
            Pick X or O to start the game
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            onClick={() => onSelect('X')}
            className="h-24 text-4xl font-bold bg-[hsl(var(--player-x))] hover:bg-[hsl(var(--player-x)_/_0.9)] text-white"
          >
            X
          </Button>
          <Button
            onClick={() => onSelect('O')}
            className="h-24 text-4xl font-bold bg-[hsl(var(--player-o))] hover:bg-[hsl(var(--player-o)_/_0.9)] text-white"
          >
            O
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          X always goes first
        </p>
      </DialogContent>
    </Dialog>
  );
};
