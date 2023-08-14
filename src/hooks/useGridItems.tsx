import React, { CSSProperties, useMemo } from 'react';
import { getColumnOffset, getRowOffset } from '../helpers/grid';
import CanvasGrid from '../components/CanvasGrid/CanvasGrid';

type UseGridItemsParams = {
  currentPosition: {
    rowStart: number;
    columnStart: number;
    rowEnd: number;
    columnEnd: number;
  };
  canvasSideSize: number;
  cellSize: number;
};

const useGridItems = (params: UseGridItemsParams): JSX.Element[] => {
  const { currentPosition, canvasSideSize, cellSize } = params;
  const { rowStart, rowEnd, columnStart, columnEnd } = currentPosition;

  return useMemo(() => {
    const items = [];

    for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
      // Loop through rows and columns to generate CanvasGrid items
      for (let columnIndex = columnStart; columnIndex <= columnEnd; columnIndex++) {
        // Calculate position for the canvas element on the grid
        const canvasStyles: CSSProperties = {
          position: 'absolute',
          top: getRowOffset(canvasSideSize, rowIndex),
          left: getColumnOffset(canvasSideSize, columnIndex),
        };

        items.push(
          <CanvasGrid
            key={`${rowIndex}:${columnIndex}`}
            sideSize={canvasSideSize}
            styles={canvasStyles}
            cellSize={cellSize}
          />,
        );
      }
    }

    return items;
  }, [canvasSideSize, cellSize, columnEnd, columnStart, rowEnd, rowStart]);
};

export default useGridItems;
