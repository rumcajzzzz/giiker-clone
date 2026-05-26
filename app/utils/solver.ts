export interface Block {
	id: string;
	width: number;
	height: number;
	x: number;
	y: number;
	color: string;
  }
  
  const GRID_WIDTH = 4;
  const GRID_HEIGHT = 5;
  
  export function serializeBlocks(blocks: Block[]): string {
	const grid = Array(20).fill(".");
	
	const sorted = [...blocks].sort((a, b) => a.id.localeCompare(b.id));
  
	for (const b of sorted) {
	  const char = b.id === "main" ? "M" : b.width === 2 ? "H" : b.height === 2 ? "V" : "S";
	  for (let r = 0; r < b.height; r++) {
		for (let c = 0; c < b.width; c++) {
		  const idx = (b.y + r) * GRID_WIDTH + (b.x + c);
		  if (idx >= 0 && idx < 20) {
			grid[idx] = char;
		  }
		}
	  }
	}
	return grid.join("");
  }
  
  export function solveKlotski(startBlocks: Block[]): { steps: number; nextMoveId: string | null } | null {
	const queue = [{ blocks: startBlocks, steps: 0, firstMoveId: null as string | null }];
	const visited = new Set<string>();
	visited.add(serializeBlocks(startBlocks));
  
	let head = 0;
  
	while (head < queue.length) {
	  const { blocks, steps, firstMoveId } = queue[head++];
  
	  const main = blocks.find((b) => b.id === "main");
	  if (main && main.x === 1 && main.y === 3) {
		return { steps, nextMoveId: firstMoveId };
	  }
  
	  const grid = Array(20).fill(null);
	  blocks.forEach((b) => {
		for (let r = 0; r < b.height; r++) {
		  for (let c = 0; c < b.width; c++) {
			grid[(b.y + r) * GRID_WIDTH + (b.x + c)] = b.id;
		  }
		}
	  });
  
	  for (let i = 0; i < blocks.length; i++) {
		const b = blocks[i];
		const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  
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
			const newBlocks = blocks.map((bl) => (bl.id === b.id ? { ...bl, x: nx, y: ny } : bl));
			const serialized = serializeBlocks(newBlocks);
  
			if (!visited.has(serialized)) {
			  visited.add(serialized);
			  queue.push({
				blocks: newBlocks,
				steps: steps + 1,
				firstMoveId: firstMoveId || b.id,
			  });
			}
		  }
		}
	  }
	}
  
	return null;
  }