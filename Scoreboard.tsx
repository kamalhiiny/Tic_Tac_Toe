import { Trophy, Target, Minus } from "lucide-react";

interface ScoreboardProps {
  playerWins: number;
  aiWins: number;
  draws: number;
  playerSymbol: 'X' | 'O';
}

export const Scoreboard = ({ playerWins, aiWins, draws, playerSymbol }: ScoreboardProps) => {
  const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center mb-2">
          <Trophy className="w-5 h-5 text-[hsl(var(--player-x))] mr-2" />
          <span className="text-sm font-medium">You ({playerSymbol})</span>
        </div>
        <div className="text-3xl font-bold text-[hsl(var(--player-x))]">{playerWins}</div>
      </div>
      
      <div className="bg-card rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center mb-2">
          <Minus className="w-5 h-5 text-muted-foreground mr-2" />
          <span className="text-sm font-medium">Draws</span>
        </div>
        <div className="text-3xl font-bold text-muted-foreground">{draws}</div>
      </div>

      <div className="bg-card rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center mb-2">
          <Target className="w-5 h-5 text-[hsl(var(--player-o))] mr-2" />
          <span className="text-sm font-medium">AI ({aiSymbol})</span>
        </div>
        <div className="text-3xl font-bold text-[hsl(var(--player-o))]">{aiWins}</div>
      </div>
    </div>
  );
};
