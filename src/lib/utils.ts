export function snapToGrid(gridCellSize: number, pos: { x: number; y: number }) {
	const x = Math.round(pos.x / gridCellSize) * gridCellSize;
	const y = Math.round(pos.y / gridCellSize) * gridCellSize;
}
