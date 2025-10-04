type CellValue = 'X' | 'O' | null;
type Board = CellValue[];

/**
 * Check if there's a winner on the board
 * Returns the winning symbol or null
 */
export const checkWinner = (board: Board): CellValue => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

/**
 * Get the winning line indices if there's a winner
 */
export const getWinningLine = (board: Board): number[] | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
};

/**
 * Check if the board is full (draw)
 */
export const isBoardFull = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

/**
 * Minimax algorithm with alpha-beta pruning
 * Returns the best score for the current player
 */
const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiSymbol: CellValue,
  playerSymbol: CellValue
): number => {
  const winner = checkWinner(board);
  
  // Terminal states
  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const score = minimax(board, depth + 1, false, alpha, beta, aiSymbol, playerSymbol);
        board[i] = null;
        maxScore = Math.max(score, maxScore);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true, alpha, beta, aiSymbol, playerSymbol);
        board[i] = null;
        minScore = Math.min(score, minScore);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return minScore;
  }
};

/**
 * Get available moves (empty cells)
 */
const getAvailableMoves = (board: Board): number[] => {
  return board.reduce((acc: number[], cell, index) => {
    if (cell === null) acc.push(index);
    return acc;
  }, []);
};

/**
 * Find the best move for the AI using Minimax algorithm
 * Difficulty: 0 = Easy, 1 = Medium, 2 = Unbeatable
 */
export const findBestMove = (
  board: Board,
  aiSymbol: CellValue,
  playerSymbol: CellValue,
  difficulty: number = 2
): number => {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) return -1;

  // Easy difficulty: 70% random moves
  if (difficulty === 0 && Math.random() < 0.7) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium difficulty: 40% random moves
  if (difficulty === 1 && Math.random() < 0.4) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Unbeatable mode or smart move for Easy/Medium
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = aiSymbol;
    const score = minimax(board, 0, false, -Infinity, Infinity, aiSymbol, playerSymbol);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};
