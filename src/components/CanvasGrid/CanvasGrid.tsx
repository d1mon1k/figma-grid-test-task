import React, { useEffect, useRef } from 'react';
import { CanvasProps } from './CanvasGrid.types';

const CanvasGrid: React.FC<CanvasProps> = (props) => {
  const { sideSize, styles, cellSize } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      ctx.clearRect(0, 0, sideSize, sideSize);
      ctx.translate(0.5, 0.5);
      ctx.beginPath();

      const rows = sideSize / cellSize;
      const cols = sideSize / cellSize;

      for (let i = 0; i <= rows; i++) {
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(sideSize, i * cellSize);
      }

      for (let i = 0; i < cols; i++) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, sideSize);
      }

      ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
      ctx.lineWidth = 1;

      ctx.stroke();
      ctx.translate(-0.5, -0.5); // Reset the translation
    }
  }, [cellSize]);

  return <canvas width={sideSize} height={sideSize} style={styles} ref={canvasRef} />;
};

export default CanvasGrid;
