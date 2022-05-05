import React, { ChangeEvent, useState } from 'react';
import Rect from '../Rect';

interface matrixData {
  col: number; row: number; alive: boolean;
}

let timerID = 0;

const Upload = () => {
  const [initialState, setInitialState] = useState<string | null>(null);
  const [generation, setGeneration] = useState<number>(0);
  const [matrix, setMatrix] = useState<matrixData[][]>();
  let toogleCheck = true;


  const reset = () => {
    setMatrix([]);
    clearInterval(timerID);
    setGeneration(0);
    timerID = 0;
  }

  const fileUpload = (e: ChangeEvent<HTMLInputElement | null>) => {
    reset();
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result);
      setInitialState(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const createEmptyGrid = () => {
    reset();
    const data: string[] | undefined = initialState?.split('-');
    const grid = [];

    if (data) {
      for (let i = 0; i < Number(data[1]); i++) {
        let subGrid = [];
        for (let j = 0; j < Number(data[2]); j++) {
          subGrid.push({ col: j, row: i, alive: false });
        }
        grid.push(subGrid);
      }

      for (let i = 0; i < Number(data[0]); i++) {
        const randomRow = Math.floor(Math.random() * grid.length);
        const randomColum = Math.floor(Math.random() * grid[0].length);
        grid[randomRow][randomColum].alive = true;
      }
      setGeneration(Number(data[0]));

    }
    setMatrix(grid);
  }

  const start = () => {

    if (matrix) {
      const rowsLength = matrix.length - 1;
      const colsLength = matrix[0].length - 1;
      const matrixTemp = [...matrix];

      if (toogleCheck) {
        matrixTemp.map((rows) => rows.map((item) => {
          let neighbours = 0;
          //1 to left
          if (item.col > 0 && matrixTemp[item.row][item.col - 1].alive)
            neighbours++;
          //1 to left above
          if (item.col > 0 && item.row > 0 && matrixTemp[item.row - 1][item.col - 1].alive)
            neighbours++;
          //1 above
          if (item.row > 0 && matrixTemp[item.row - 1][item.col].alive)
            neighbours++;
          //1 to right above
          if (item.row > 0 && item.col < colsLength && matrixTemp[item.row - 1][item.col + 1].alive)
            neighbours++;
          //1 to right
          if (item.col < colsLength && matrixTemp[item.row][item.col + 1].alive)
            neighbours++;
          //1 to right below
          if (item.col < colsLength && item.row < rowsLength && matrixTemp[item.row + 1][item.col + 1].alive)
            neighbours++;
          //1 below
          if (item.row < rowsLength && matrixTemp[item.row + 1][item.col].alive)
            neighbours++;
          //1 to left below
          if (item.row < rowsLength && item.col > 0 && matrixTemp[item.row + 1][item.col - 1].alive)
            neighbours++;

          if (neighbours === 3)
            matrixTemp[item.row][item.col].alive = true;
        }));
        toogleCheck = false;
      }
      else {
        matrixTemp.map((rows) => rows.map((item) => {
          let neighbours = 0;
          //1 a esquerda
          if (item.col > 0 && matrixTemp[item.row][item.col - 1].alive)
            neighbours++;
          //1 a esquerda e acima
          if (item.col > 0 && item.row > 0 && matrixTemp[item.row - 1][item.col - 1].alive)
            neighbours++;
          //1 acima
          if (item.row > 0 && matrixTemp[item.row - 1][item.col].alive)
            neighbours++;
          //1 acima e a direita
          if (item.row > 0 && item.col < colsLength && matrixTemp[item.row - 1][item.col + 1].alive)
            neighbours++;
          //1 a direita
          if (item.col < colsLength && matrixTemp[item.row][item.col + 1].alive)
            neighbours++;
          //1 a direita e abaixo
          if (item.col < colsLength && item.row < rowsLength && matrixTemp[item.row + 1][item.col + 1].alive)
            neighbours++;
          //1 abaixo
          if (item.row < rowsLength && matrixTemp[item.row + 1][item.col].alive)
            neighbours++;
          //1 abaixo e esquerda
          if (item.row < rowsLength && item.col > 0 && matrixTemp[item.row + 1][item.col - 1].alive)
            neighbours++;

          if (neighbours > 3 || neighbours < 2)
            matrixTemp[item.row][item.col].alive = false;
        }));
        toogleCheck = true;
        setGeneration(prev => prev + 1);
      }
      setMatrix(matrixTemp);
    }
  }



  return (
    <>
      {
        initialState === null ? (
          <div className='flex justify-center pt-64'>
            <label htmlFor="fileupload">Choose file to upload...</label>
            <input type="file" id='fileupload' name="file" onChange={fileUpload} accept=".txt" />
          </div>
        ) : (
          <div className="flex justify-center pt-16">

            <div className='mr-64'>
              <button
                className='bg-blue-800 text-zinc-50 font-bold py-2 px-4 rounded'
                onClick={createEmptyGrid}>{timerID !== 0 ? 'RESET' : 'SET'}
              </button>
            </div>
            <div>
              <button disabled={timerID > 0} onClick={() => { timerID = setInterval(() => start(), 1500); }}
                className='bg-blue-800 text-zinc-50 font-bold py-2 px-4 rounded'
              >GO!
              </button>
            </div>

          </div>
        )
      }

      <div>
        {
          matrix?.map((rows) => rows.map((col, i) => (
            <div key={i}>
              <Rect row={col.row} column={col.col} alive={col.alive} />
            </div>
          )))
        }
      </div>
    </>
  )
}

export default Upload