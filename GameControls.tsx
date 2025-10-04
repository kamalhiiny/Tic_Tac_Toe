import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Moon, Sun, RotateCcw, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";

interface GameControlsProps {
  difficulty: number;
  onDifficultyChange: (value: number[]) => void;
  onRestart: () => void;
  onFullReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const difficultyLabels = ["Easy", "Medium", "Unbeatable"];

export const GameControls = ({
  difficulty,
  onDifficultyChange,
  onRestart,
  onFullReset,
  soundEnabled,
  onToggleSound,
}: GameControlsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 bg-card p-6 rounded-2xl shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">AI Difficulty</label>
          <span className="text-sm font-bold text-primary">
            {difficultyLabels[difficulty]}
          </span>
        </div>
        <Slider
          value={[difficulty]}
          onValueChange={onDifficultyChange}
          min={0}
          max={2}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Easy</span>
          <span>Medium</span>
          <span>Hard</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
        <Button
          onClick={onFullReset}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Full Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="outline"
          className="w-full"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 mr-2" />
              Light
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </>
          )}
        </Button>
        <Button
          onClick={onToggleSound}
          variant="outline"
          className="w-full"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 mr-2" />
              Sound On
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 mr-2" />
              Sound Off
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
