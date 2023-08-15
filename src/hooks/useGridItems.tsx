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
  gridDimensions: {
    width: number;
    height: number;
  };
};

const useGridItems = (params: UseGridItemsParams): JSX.Element[] => {
  const { currentPosition, canvasSideSize, cellSize, gridDimensions } = params;
  const { rowStart, rowEnd, columnStart, columnEnd } = currentPosition;
  const { width, height } = gridDimensions;

  return useMemo(() => {
    const items = [];

    for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
      // Loop through rows and columns to generate CanvasGrid items
      for (let columnIndex = columnStart; columnIndex <= columnEnd; columnIndex++) {
        // Calculate position for the canvas element on the grid
        const rowOffset = getRowOffset(canvasSideSize, rowIndex);
        const columnOffset = getColumnOffset(canvasSideSize, columnIndex);

        const canvasStyles: CSSProperties = {
          position: 'absolute',
          top: rowOffset,
          left: columnOffset,
        };

        let suitableHeight;
        if (rowOffset + canvasSideSize > height) {
          suitableHeight = height - rowOffset;

          if (suitableHeight < 0) continue;
        } else {
          suitableHeight = canvasSideSize;
        }

        let suitableWidth;
        if (columnOffset + canvasSideSize > width) {
          suitableWidth = width - columnOffset;

          if (suitableWidth < 0) continue;
        } else {
          suitableWidth = canvasSideSize;
        }

        items.push(
          <CanvasGrid
            key={`${rowIndex}:${columnIndex}`}
            width={suitableWidth}
            height={suitableHeight}
            styles={canvasStyles}
            cellSize={cellSize}
          />,
        );
      }
    }

    return items;
  }, [canvasSideSize, cellSize, columnEnd, columnStart, height, rowEnd, rowStart, width]);
};

export default useGridItems;
