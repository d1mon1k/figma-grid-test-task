export const getEstimatedTotalHeight = (rowCount: number, cellSideSize: number) =>
  cellSideSize * rowCount;

export const getEstimatedTotalWidth = (columnCount: number, cellSideSize: number) =>
  cellSideSize * columnCount;

export const getColumnOffset = (cellSideSize: number, index: number): number =>
  cellSideSize * index;

// prettier-ignore
export const getRowOffset = (cellSideSize: number, index: number): number =>
  cellSideSize * index;
