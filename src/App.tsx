import React, { useCallback, useEffect, useState } from 'react';
import Grid from './components/Grid/Grid';
import styles from './App.module.css';
import { INITIAL_CELL_SIZE } from './common/constants';

function App() {
  const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);

  return (
    <div className={styles.App}>
      <Grid cellSize={cellSize} setCellSize={setCellSize} />
    </div>
  );
}

export default App;
