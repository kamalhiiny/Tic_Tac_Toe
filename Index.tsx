import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { GameControls } from "@/components/GameControls";
import { Scoreboard } from "@/components/Scoreboard";
import { PlayerSelector } from "@/components/PlayerSelector";
import { checkWinner, getWinningLine, isBoardFull, findBestMove } from "@/lib/minimax";
import { soundGenerator } from "@/lib/sounds";
import { useToast } from "@/hooks/use-toast";
import { Brain, Sparkles } from "lucide-react";

type CellValue = 'X' | 'O' | null;

const Index = () => {
  const { toast } = useToast();
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O' | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameOver, setGameOver] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [difficulty, setDifficulty] = useState(2); // 0: Easy, 1: Medium, 2: Unbeatable
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPlayerSelector, setShowPlayerSelector] = useState(true);
  
  // Scoreboard
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
  const isPlayerTurn = currentPlayer === playerSymbol;

  // Update sound generator when sound setting changes
  useEffect(() => {
    soundGenerator.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // AI turn handler
  useEffect(() => {
    if (!playerSymbol || gameOver || isPlayerTurn || aiThinking) return;

    setAiThinking(true);
    
    // Add delay to make AI feel more human
    setTimeout(() => {
      const bestMove = findBestMove(board, aiSymbol, playerSymbol, difficulty);
      if (bestMove !== -1) {
        makeMove(bestMove, aiSymbol);
      }
      setAiThinking(false);
    }, 500);
  }, [currentPlayer, gameOver, playerSymbol, isPlayerTurn, aiThinking]);

  const makeMove = (index: number, symbol: 'X' | 'O') => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);
    setLastMove(index);
    soundGenerator.playClick();

    // Check for winner
    const winner = checkWinner(newBoard);
    if (winner) {
      const line = getWinningLine(newBoard);
      setWinningLine(line);
      setGameOver(true);

      if (winner === playerSymbol) {
        setPlayerWins(prev => prev + 1);
        soundGenerator.playWin();
        toast({
          title: "🎉 You Won!",
          description: "Congratulations! You beat the AI!",
        });
      } else {
        setAiWins(prev => prev + 1);
        soundGenerator.playLose();
        toast({
          title: "AI Wins",
          description: "Better luck next time!",
          variant: "destructive",
        });
      }
      return;
    }

    // Check for draw
    if (isBoardFull(newBoard)) {
      setDraws(prev => prev + 1);
      setGameOver(true);
      soundGenerator.playDraw();
      toast({
        title: "It's a Draw!",
        description: "Well played by both sides!",
      });
      return;
    }

    // Switch player
    setCurrentPlayer(symbol === 'X' ? 'O' : 'X');
  };

  const handleCellClick = (index: number) => {
    if (!isPlayerTurn || aiThinking) return;
    makeMove(index, playerSymbol!);
  };

  const handlePlayerSelect = (symbol: 'X' | 'O') => {
    setPlayerSymbol(symbol);
    setShowPlayerSelector(false);
    setCurrentPlayer('X'); // X always goes first
    
    // If player chose O, let AI make the first move
    if (symbol === 'O') {
      setTimeout(() => {
        const firstMove = findBestMove(Array(9).fill(null), 'X', 'O', difficulty);
        makeMove(firstMove, 'X');
      }, 800);
    }
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
    setLastMove(null);
    setWinningLine(null);
    setAiThinking(false);
    
    // If player is O, AI makes first move
    if (playerSymbol === 'O') {
      setTimeout(() => {
        const firstMove = findBestMove(Array(9).fill(null), 'X', 'O', difficulty);
        makeMove(firstMove, 'X');
      }, 800);
    }
  };

  const fullReset = () => {
    restartGame();
    setPlayerWins(0);
    setAiWins(0);
    setDraws(0);
    setShowPlayerSelector(true);
    setPlayerSymbol(null);
  };

  const getStatusMessage = () => {
    if (gameOver) {
      const winner = checkWinner(board);
      if (winner === playerSymbol) return "🎉 You Won!";
      if (winner === aiSymbol) return "AI Wins";
      return "It's a Draw!";
    }
    if (aiThinking) return "AI is thinking...";
    if (isPlayerTurn) return "Your turn";
    return "AI's turn";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Tic-Tac-Toe
            </h1>
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <p className="text-muted-foreground">
            Challenge the unbeatable AI powered by Minimax algorithm
          </p>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold transition-all ${
            aiThinking ? 'bg-[hsl(var(--ai-thinking)_/_0.2)] text-accent animate-thinking' : 
            'bg-primary/10 text-primary'
          }`}>
            {aiThinking && <Brain className="w-5 h-5 animate-pulse" />}
            {getStatusMessage()}
          </div>
        </div>

        {/* Scoreboard */}
        {playerSymbol && (
          <div className="mb-6 animate-slide-up">
            <Scoreboard
              playerWins={playerWins}
              aiWins={aiWins}
              draws={draws}
              playerSymbol={playerSymbol}
            />
          </div>
        )}

        {/* Game Area */}
        <div className="grid md:grid-cols-[1fr,300px] gap-6">
          {/* Game Board */}
          {playerSymbol && (
            <div className="animate-slide-up">
              <GameBoard
                board={board}
                onCellClick={handleCellClick}
                disabled={!isPlayerTurn || gameOver || aiThinking}
                lastMove={lastMove}
                winningLine={winningLine}
              />
            </div>
          )}

          {/* Controls */}
          {playerSymbol && (
            <div className="animate-slide-up">
              <GameControls
                difficulty={difficulty}
                onDifficultyChange={(value) => setDifficulty(value[0])}
                onRestart={restartGame}
                onFullReset={fullReset}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Built with React + TypeScript • Minimax AI with Alpha-Beta Pruning</p>
        </div>
      </div>

      {/* Player Selection Dialog */}
      <PlayerSelector
        open={showPlayerSelector}
        onSelect={handlePlayerSelect}
      />
    </div>
  );
};

export default Index;
