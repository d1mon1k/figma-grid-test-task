import React, { useEffect, useRef } from 'react';
import { CanvasProps } from './CanvasGrid.types';

const CanvasGrid: React.FC<CanvasProps> = (props) => {
  const { styles, cellSize, width, height } = props;
  const appropriateWidth = width % cellSize === 0 ? width : Math.floor(width + (width % cellSize));
  const appropriateHeight =
    height % cellSize === 0 ? height : Math.floor(height + (height % cellSize));

  console.log('width % cellSize', width % cellSize);
  console.log('width / cellSize', width / cellSize);
  console.log(cellSize);
  console.log(appropriateWidth);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.translate(0.5, 0.5);
      ctx.beginPath();

      const rows = height / cellSize;
      const cols = width / cellSize;

      for (let i = 0; i <= rows; i++) {
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(width, i * cellSize);
      }

      for (let i = 0; i < cols; i++) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
      }

      ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
      ctx.lineWidth = 1;

      ctx.stroke();
      // Reset the translation
      ctx.translate(-0.5, -0.5);
    }
  }, [cellSize, height, width]);

  return (
    <canvas width={appropriateWidth} height={appropriateHeight} style={styles} ref={canvasRef} />
  );
};

export default CanvasGrid;
