import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GridProps } from './Grid.types';
import styles from './Grid.module.css';
import { getEstimatedTotalHeight, getEstimatedTotalWidth } from '../../helpers/grid';
import {
  FIGMA_GRID_HEIGHT,
  FIGMA_GRID_WIDTH,
  GRID_COLUMN_COUNT,
  GRID_ROW_COUNT,
  MAX_CELL_SIZE,
  MIN_CELL_SIZE,
} from '../../common/constants';
import useGridItems from '../../hooks/useGridItems';
import useMetaPressed from '../../hooks/useMetaPressed';

const Grid: React.FC<GridProps> = (props) => {
  const { cellSize, setCellSize } = props;
  const containerEl = useRef<HTMLDivElement | null>(null);
  const metaPressed = useMetaPressed();

  // TODO: create logic for getting appropriate canvasSideSize
  const [canvasSideSize, setCanvasSideSize] = useState(cellSize * 10);

  // Represents current location of the scroll
  const [currentPosition, setCurrentPosition] = useState({
    rowStart: 0,
    columnStart: 0,
    rowEnd: 0,
    columnEnd: 0,
  });

  // Get canvas items to build grid in the current viewport
  const gridItems = useGridItems({ currentPosition, cellSize, canvasSideSize });

  useEffect(() => {
    const suitableCanvasSideSize =
      cellSize < 20
        ? cellSize * 85
        : cellSize < 40
        ? cellSize * 45
        : cellSize < 60
        ? cellSize * 35
        : cellSize * 20;

    setCanvasSideSize(suitableCanvasSideSize);
  }, [cellSize]);

  // Place scroll in the middle of the grid
  useEffect(() => {
    if (containerEl.current) {
      containerEl.current.scrollTo({
        top: FIGMA_GRID_HEIGHT / 2,
        left: FIGMA_GRID_WIDTH / 2,
        behavior: 'smooth',
      });
    }
  }, []);

  // Change grid's cell size depending on the direction of the scroll wheel
  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (metaPressed) {
        setCellSize((prevCellSize) => {
          if (event.deltaY > 0) {
            return prevCellSize < MAX_CELL_SIZE ? prevCellSize + 3 : prevCellSize;
          } else {
            return prevCellSize > MIN_CELL_SIZE ? prevCellSize - 3 : prevCellSize;
          }
        });
      }
    },
    [metaPressed, setCellSize],
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      /* The current grid position is being shifted, chasing the scroll */
      if (containerEl.current) {
        const scrollTop = event.currentTarget.scrollTop;
        const scrollLeft = event.currentTarget.scrollLeft;

        const containerHeight = containerEl.current.clientHeight;
        const containerWidth = containerEl.current.clientWidth;

        const rowOffset = Math.floor(scrollTop / canvasSideSize);
        const columnOffset = Math.floor(scrollLeft / canvasSideSize);

        // Get an extra area so that user does not see glimpsing during the scroll
        const extraRows = Math.floor((containerHeight * 0.5) / canvasSideSize);
        const extraColumns = Math.floor((containerWidth * 0.5) / canvasSideSize);

        setCurrentPosition({
          rowStart: Math.floor(rowOffset - extraRows),
          columnStart: Math.floor(columnOffset - extraColumns),
          rowEnd: Math.ceil(containerHeight / canvasSideSize + extraRows + rowOffset),
          columnEnd: Math.ceil(containerWidth / canvasSideSize + extraColumns + columnOffset),
        });
      }
    },
    [canvasSideSize],
  );

  const gridStyle: React.CSSProperties = useMemo(
    () => ({
      width: getEstimatedTotalWidth(GRID_COLUMN_COUNT, cellSize),
      height: getEstimatedTotalHeight(GRID_ROW_COUNT, cellSize),
    }),
    [cellSize],
  );

  return (
    <div
      ref={containerEl}
      onWheel={handleWheel}
      onScroll={handleScroll}
      className={styles.gridContainer}>
      <div className={styles.grid} style={gridStyle}>
        {gridItems}
      </div>
    </div>
  );
};
export default Grid;
