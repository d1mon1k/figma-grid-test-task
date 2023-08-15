import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GridProps } from './Grid.types';
import styles from './Grid.module.css';
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

  const [canvasSideSize, setCanvasSideSize] = useState(cellSize * 500);
  const [gridDimensions, setGridDimensions] = useState({
    width: FIGMA_GRID_WIDTH,
    height: FIGMA_GRID_HEIGHT,
  });

  // Represents current location of the row and column
  const [currentPosition, setCurrentPosition] = useState({
    rowStart: 0,
    columnStart: 0,
    rowEnd: 0,
    columnEnd: 0,
  });

  // Get canvas items to build grid in the current viewport
  const gridItems = useGridItems({
    currentPosition,
    cellSize,
    canvasSideSize,
    gridDimensions,
  });

  useEffect(() => {
    setGridDimensions({
      height: GRID_ROW_COUNT * cellSize,
      width: GRID_COLUMN_COUNT * cellSize,
    });
  }, [cellSize]);

  // Place initial scroll in the middle of the grid
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
        setCellSize((previousSize) => {
          if (event.deltaY > 0 && previousSize < MAX_CELL_SIZE) {
            return previousSize + 1;
          } else if (event.deltaY < 0 && previousSize > MIN_CELL_SIZE) {
            return previousSize - 1;
          } else {
            return previousSize;
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

  const gridStyle: React.CSSProperties = useMemo(() => {
    return {
      width: gridDimensions.width,
      height: gridDimensions.height,
    };
  }, [gridDimensions.height, gridDimensions.width]);

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
