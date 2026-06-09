import { CELL_BG, CELL_DEFAULT, DOT_GOAL, PLAYFIELD_BG } from "@/lib/compute-it/theme";
import type { CellColor, Position } from "@/lib/compute-it/types";

type GridProps = {
  map: CellColor[][];
  player: Position;
  goal: Position;
  shake?: boolean;
};

export default function Grid({ map, player, goal, shake }: GridProps) {
  const gridSize = map.length;
  const maxBoard = "min(64vmin, 460px)";
  const cellSize = `calc(${maxBoard} / ${gridSize})`;
  const goalCell = goal ?? { x: -1, y: -1 };

  return (
    <div
      className={`flex items-center justify-center ${shake ? "animate-shake" : ""}`}
    >
      <div
        className="inline-grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize})`,
          width: maxBoard,
        }}
      >
        {map.map((row, y) =>
          row.map((cellColor, x) => {
            const isPlayer = player.x === x && player.y === y;
            const isGoal = goalCell.x === x && goalCell.y === y;
            const dotColor = isGoal
              ? DOT_GOAL
              : cellColor === "normal"
                ? CELL_DEFAULT
                : CELL_BG[cellColor];
            return (
              <div
                key={`${x}-${y}`}
                className="relative flex items-center justify-center"
                style={{ width: cellSize, height: cellSize }}
              >
                <div
                  className="rounded-full shadow-sm"
                  style={{
                    width: "78%",
                    height: "78%",
                    backgroundColor: dotColor,
                  }}
                />
                {isPlayer && (
                  <div
                    className="absolute animate-pulse rounded-full"
                    style={{
                      width: "36%",
                      height: "36%",
                      backgroundColor: PLAYFIELD_BG,
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
