export const getEstimatedTotalHeight = (rowCount: number, cellSideSize: number) =>
  cellSideSize * rowCount;

export const getEstimatedTotalWidth = (columnCount: number, cellSideSize: number) =>
  cellSideSize * columnCount;
