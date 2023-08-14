import React, { useRef } from 'react';
import { GridProps } from './Grid.types';
import styles from './Grid.module.css';
import { getEstimatedTotalHeight, getEstimatedTotalWidth } from '../../helpers/grid';
import { GRID_COLUMN_COUNT, GRID_ROW_COUNT } from '../../common/constants';

const Grid: React.FC<GridProps> = (props) => {
  const { cellSize } = props;

  const containerEl = useRef<HTMLDivElement | null>(null);

  const gridStyle: React.CSSProperties = {
    width: getEstimatedTotalWidth(GRID_COLUMN_COUNT, cellSize),
    height: getEstimatedTotalHeight(GRID_ROW_COUNT, cellSize),
  };

  return (
    <div ref={containerEl} className={styles.gridContainer}>
      <div className={styles.grid} style={gridStyle}></div>
    </div>
  );
};
export default Grid;
