import { Block, solveKlotski } from "./solver";

const GRID_WIDTH = 4;
const GRID_HEIGHT = 5;

const SEED_1_CLASSIC: Block[] = [
  { id: "main", width: 2, height: 2, x: 1, y: 3, color: "#ef4444" }, 
  { id: "v1", width: 1, height: 2, x: 0, y: 0, color: "#facc15" },
  { id: "v2", width: 1, height: 2, x: 3, y: 0, color: "#facc15" },
  { id: "v3", width: 1, height: 2, x: 0, y: 2, color: "#facc15" },
  { id: "v4", width: 1, height: 2, x: 3, y: 2, color: "#facc15" },
  { id: "h1", width: 2, height: 1, x: 1, y: 0, color: "#3b82f6" },
  { id: "s1", width: 1, height: 1, x: 1, y: 1, color: "#22c55e" },
  { id: "s2", width: 1, height: 1, x: 2, y: 1, color: "#22c55e" },
  { id: "s3", width: 1, height: 1, x: 0, y: 4, color: "#22c55e" },
  { id: "s4", width: 1, height: 1, x: 3, y: 4, color: "#22c55e" }
];

const SEED_2_HORIZONTAL: Block[] = [
  { id: "main", width: 2, height: 2, x: 1, y: 3, color: "#ef4444" },
  { id: "h1", width: 2, height: 1, x: 0, y: 0, color: "#3b82f6" },
  { id: "h2", width: 2, height: 1, x: 2, y: 0, color: "#3b82f6" },
  { id: "h3", width: 2, height: 1, x: 1, y: 1, color: "#3b82f6" },
  { id: "v1", width: 1, height: 2, x: 0, y: 3, color: "#facc15" },
  { id: "v2", width: 1, height: 2, x: 3, y: 3, color: "#facc15" },
  { id: "s1", width: 1, height: 1, x: 0, y: 1, color: "#22c55e" },
  { id: "s2", width: 1, height: 1, x: 3, y: 1, color: "#22c55e" },
  { id: "s3", width: 1, height: 1, x: 0, y: 2, color: "#22c55e" },
  { id: "s4", width: 1, height: 1, x: 3, y: 2, color: "#22c55e" }
];

const SEED_3_TINY: Block[] = [
  { id: "main", width: 2, height: 2, x: 1, y: 3, color: "#ef4444" },
  { id: "v1", width: 1, height: 2, x: 0, y: 0, color: "#facc15" },
  { id: "v2", width: 1, height: 2, x: 3, y: 0, color: "#facc15" },
  { id: "v3", width: 1, height: 2, x: 0, y: 2, color: "#facc15" },
  { id: "v4", width: 1, height: 2, x: 3, y: 2, color: "#facc15" },
  { id: "s1", width: 1, height: 1, x: 1, y: 0, color: "#22c55e" },
  { id: "s2", width: 1, height: 1, x: 2, y: 0, color: "#22c55e" },
  { id: "s3", width: 1, height: 1, x: 1, y: 1, color: "#22c55e" },
  { id: "s4", width: 1, height: 1, x: 2, y: 1, color: "#22c55e" },
  { id: "s5", width: 1, height: 1, x: 0, y: 4, color: "#22c55e" },
  { id: "s6", width: 1, height: 1, x: 3, y: 4, color: "#22c55e" }
];

const SEED_4_MOBILITY: Block[] = [
  { id: "main", width: 2, height: 2, x: 1, y: 3, color: "#ef4444" },
  { id: "h1", width: 2, height: 1, x: 1, y: 0, color: "#3b82f6" },
  { id: "v1", width: 1, height: 2, x: 0, y: 2, color: "#facc15" },
  { id: "v2", width: 1, height: 2, x: 3, y: 2, color: "#facc15" },
  { id: "s1", width: 1, height: 1, x: 0, y: 0, color: "#22c55e" },
  { id: "s2", width: 1, height: 1, x: 3, y: 0, color: "#22c55e" },
  { id: "s3", width: 1, height: 1, x: 0, y: 1, color: "#22c55e" },
  { id: "s4", width: 1, height: 1, x: 1, y: 1, color: "#22c55e" },
  { id: "s5", width: 1, height: 1, x: 2, y: 1, color: "#22c55e" },
  { id: "s6", width: 1, height: 1, x: 3, y: 1, color: "#22c55e" },
  { id: "s7", width: 1, height: 1, x: 0, y: 4, color: "#22c55e" },
  { id: "s8", width: 1, height: 1, x: 3, y: 4, color: "#22c55e" }
];

const ALL_SEEDS = [SEED_1_CLASSIC, SEED_2_HORIZONTAL, SEED_3_TINY, SEED_4_MOBILITY];

function serializeState(blocks: Block[]): string {
  return blocks.map(b => `${b.id}${b.x}${b.y}`).sort().join("");
}

function getValidMoves(currentBlocks: Block[]): Block[][] {
  const moves: Block[][] = [];
  const grid = Array(20).fill(null);

  currentBlocks.forEach((b) => {
    for (let r = 0; r < b.height; r++) {
      for (let c = 0; c < b.width; c++) {
        grid[(b.y + r) * GRID_WIDTH + (b.x + c)] = b.id;
      }
    }
  });

  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (let i = 0; i < currentBlocks.length; i++) {
    const b = currentBlocks[i];
    for (const [dx, dy] of dirs) {
      const nx = b.x + dx;
      const ny = b.y + dy;

      if (nx < 0 || nx + b.width > GRID_WIDTH || ny < 0 || ny + b.height > GRID_HEIGHT) continue;

      let collision = false;
      for (let r = 0; r < b.height; r++) {
        for (let c = 0; c < b.width; c++) {
          const cellOwner = grid[(ny + r) * GRID_WIDTH + (nx + c)];
          if (cellOwner !== null && cellOwner !== b.id) {
            collision = true;
            break;
          }
        }
        if (collision) break;
      }

      if (!collision) {
        const nextState = currentBlocks.map((bl) => (bl.id === b.id ? { ...bl, x: nx, y: ny } : bl));
        moves.push(nextState);
      }
    }
  }
  return moves;
}

export function generateRandomLevel(difficulty: "easy" | "medium" | "hard"): Block[] {
  const difficultyRanges = {
    easy: { min: 7, max: 14, shuffleSteps: 25 },
    medium: { min: 16, max: 32, shuffleSteps: 55 },
    hard: { min: 40, max: 85, shuffleSteps: 150 },
  };

  const range = difficultyRanges[difficulty];
  let attempts = 0;
  const maxAttempts = 60; 

  let bestFallbackBlocks: Block[] = [];
  let closestDistance = Infinity;

  while (attempts < maxAttempts) {
    attempts++;
    
    const randomSeed = ALL_SEEDS[Math.floor(Math.random() * ALL_SEEDS.length)];
    let currentBlocks = JSON.parse(JSON.stringify(randomSeed));
    let previousStateStr = serializeState(currentBlocks);

    for (let i = 0; i < range.shuffleSteps; i++) {
      const possibleMoves = getValidMoves(currentBlocks);
      const forwardMoves = possibleMoves.filter(m => serializeState(m) !== previousStateStr);
      const movesToUse = forwardMoves.length > 0 ? forwardMoves : possibleMoves;

      const randomIndex = Math.floor(Math.random() * movesToUse.length);
      previousStateStr = serializeState(currentBlocks);
      currentBlocks = movesToUse[randomIndex];
    }

    const solution = solveKlotski(currentBlocks);
    const mainBlock = currentBlocks.find((b: Block) => b.id === "main");

    if (solution && solution.steps > 0) {
      if (difficulty === "hard" && mainBlock && mainBlock.y > 1) {
        continue;
      }
      
      if (difficulty === "medium" && mainBlock && mainBlock.y > 2) {
        continue;
      }

      if (solution.steps >= range.min && solution.steps <= range.max) {
        return currentBlocks;
      }

      const distance = Math.min(
        Math.abs(solution.steps - range.min),
        Math.abs(solution.steps - range.max)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        bestFallbackBlocks = currentBlocks;
      }
    }
  }

  if (bestFallbackBlocks.length > 0) {
    return bestFallbackBlocks;
  }

  const emergencyMoves = getValidMoves(ALL_SEEDS[0]);
  return emergencyMoves[0];
}