import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GridProps } from './Grid.types';
import styles from './Grid.module.css';
import { getEstimatedTotalHeight, getEstimatedTotalWidth } from '../../helpers/grid';
import { GRID_COLUMN_COUNT, GRID_ROW_COUNT } from '../../common/constants';
import useGridItems from '../../hooks/useGridItems';

const Grid: React.FC<GridProps> = (props) => {
  const { cellSize } = props;

  const containerEl = useRef<HTMLDivElement | null>(null);

  // TODO: create logic for getting appropriate canvasSideSize
  const [canvasSideSize, setCanvasSideSize] = useState(cellSize * 10);
  // Represents current location of the scroll
  const [currentPosition, setCurrentPosition] = useState({
    rowStart: 0,
    columnStart: 0,
    rowEnd: 0,
    columnEnd: 0,
  });

  const gridItems = useGridItems({ currentPosition, cellSize, canvasSideSize });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      /* In this callback, the current grid position is shifted, chasing the scroll */
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
          rowEnd: Math.ceil(containerHeight / cellSize + extraRows + rowOffset),
          columnEnd: Math.ceil(containerWidth / cellSize + extraColumns + columnOffset),
        });
      }
    },
    [canvasSideSize, cellSize],
  );

  const gridStyle: React.CSSProperties = useMemo(
    () => ({
      width: getEstimatedTotalWidth(GRID_COLUMN_COUNT, cellSize),
      height: getEstimatedTotalHeight(GRID_ROW_COUNT, cellSize),
    }),
    [cellSize],
  );

  return (
    <div ref={containerEl} onScroll={handleScroll} className={styles.gridContainer}>
      <div className={styles.grid} style={gridStyle}>
        {gridItems}
      </div>
    </div>
  );
};
export default Grid;
