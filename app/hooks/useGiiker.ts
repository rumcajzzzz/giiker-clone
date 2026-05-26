"use client";

import { useState, useEffect, useRef } from "react";
import { Block, solveKlotski } from "@/utils/solver";
import { generateRandomLevel } from "@/utils/generator";
import initialLevels from "@/app/levels.json";

interface HookConfig {
  mode?: "campaign" | "random";
  level?: number;
  difficulty?: "easy" | "medium" | "hard";
}

const GRID_WIDTH = 4;
const GRID_HEIGHT = 5;

export function useGiiker(config: HookConfig = {}) {
  const mode = config.mode || "campaign";
  const level = config.level || 1;
  const difficulty = config.difficulty || "medium";

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [initialSteps, setInitialSteps] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [bestNextMove, setBestNextMove] = useState<string | null>(null);
  
  // Zmieniamy logikę: isCalculating będzie tylko wizualnym statusem na pasku, ale NIE będzie blokować gry.
  const [isCalculating, setIsCalculating] = useState(false);
  const [hintActiveId, setHintActiveId] = useState<string | null>(null);

  // useRef, żeby trzymać numer identyfikacyjny ostatniego żądania obliczeń.
  // Dzięki temu zignorujemy wyniki starych obliczeń, jeśli gracz zdążył już zrobić kolejny ruch.
  const calcIdRef = useRef(0);

  const initGame = () => {
    setHasWon(false);
    setInitialSteps(null);
    setProgress(0);
    setBestNextMove(null);
    calcIdRef.current += 1; // Resetujemy token obliczeń

    if (mode === "random") {
      const generated = generateRandomLevel(difficulty);
      setBlocks(generated);
    } else {
      const foundLevel = initialLevels.find((l: any) => l.level === level) || initialLevels[0];
      if (foundLevel) {
        setBlocks(foundLevel.blocks);
      }
    }
  };

  useEffect(() => {
    initGame();
  }, [mode, level, difficulty]);

  // Nie-blokujące, asynchroniczne obliczanie trasy
  useEffect(() => {
    if (blocks.length === 0 || hasWon) return;

    // Inkrementujemy token za każdym razem, gdy stan klocków się zmieni (gracz wykonał ruch).
    const currentCalcId = ++calcIdRef.current;
    setIsCalculating(true);

    // Dajemy króciutki timeout (50ms), żeby pozwolić Reactowi wyrenderować przesunięty klocek na ekranie
    // zanim zablokujemy główny wątek JS potężnym przeliczaniem BFS.
    const timer = setTimeout(() => {
      const solution = solveKlotski(blocks);
      
      // Jeżeli w międzyczasie gracz zdążył ruszyć kolejnym klockiem, currentCalcId się nie zgodzi.
      // Wtedy ignorujemy ten wynik, bo jest już nieaktualny.
      if (currentCalcId !== calcIdRef.current) return;

      if (solution) {
        if (initialSteps === null) {
          setInitialSteps(solution.steps);
          setProgress(0);
        } else {
          let perc = Math.round(((initialSteps - solution.steps) / initialSteps) * 100);
          perc = Math.max(0, Math.min(100, perc));
          setProgress(perc);
        }
        setBestNextMove(solution.nextMoveId);
      }
      setIsCalculating(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [blocks, hasWon, initialSteps]);

  useEffect(() => {
    const mainBlock = blocks.find((b) => b.id === "main");
    if (mainBlock && mainBlock.x === 1 && mainBlock.y === 3) {
      setHasWon(true);
      setProgress(100);
    }
  }, [blocks]);

  const isCellOccupied = (x: number, y: number, ignoreBlockId: string, currentBlocks: Block[]) => {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return true;
    return currentBlocks.some((block) => {
      if (block.id === ignoreBlockId) return false;
      return x >= block.x && x < block.x + block.width && y >= block.y && y < block.y + block.height;
    });
  };

  const canMoveTo = (block: Block, newX: number, newY: number, currentBlocks: Block[]) => {
    if (newX < 0 || newX + block.width > GRID_WIDTH) return false;
    if (newY < 0 || newY + block.height > GRID_HEIGHT) return false;

    for (let row = 0; row < block.height; row++) {
      for (let col = 0; col < block.width; col++) {
        if (isCellOccupied(newX + col, newY + row, block.id, currentBlocks)) return false;
      }
    }
    return true;
  };

  const handleStart = (id: string, clientX: number, clientY: number) => {
    if (hasWon) return;
    setActiveBlockId(id);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!activeBlockId || !dragStart) return;

    const block = blocks.find((b) => b.id === activeBlockId);
    if (!block) return;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    // Zmniejszyłem lekko próg z 30 na 25, żeby gra wydawała się jeszcze bardziej "śliska" i responsywna
    const threshold = 25; 

    let moveX = 0;
    let moveY = 0;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) moveX = deltaX > 0 ? 1 : -1;
    } else {
      if (Math.abs(deltaY) > threshold) moveY = deltaY > 0 ? 1 : -1;
    }

    if (moveX !== 0 || moveY !== 0) {
      const newX = block.x + moveX;
      const newY = block.y + moveY;

      if (canMoveTo(block, newX, newY, blocks)) {
        setBlocks((prev) => prev.map((b) => (b.id === activeBlockId ? { ...b, x: newX, y: newY } : b)));
        setDragStart({ x: clientX, y: clientY });
      }
    }
  };

  const handleEnd = () => {
    setActiveBlockId(null);
    setDragStart(null);
  };

  const triggerHint = () => {
    // Nie blokujemy hintu nawet jak isCalculating jest true, 
    // zadowolimy się hintem z poprzedniego dobrego stanu (lepiej pokazać coś, niż zablokować klik).
    if (!bestNextMove) return; 
    setHintActiveId(bestNextMove);
    setTimeout(() => setHintActiveId(null), 1000);
  };

  return {
    blocks,
    progress,
    // Przekazujemy to tylko do paska UI, w GameControls zaraz zdejmiemy blokadę.
    isCalculating, 
    hasWon,
    hintActiveId,
    bestNextMove,
    triggerHint,
    resetLevel: initGame,
    handleStart,
    handleMove,
    handleEnd,
  };
}