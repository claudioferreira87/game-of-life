import { ChangeEvent, useEffect, useState } from 'react';
import Rect from '../Rect';

interface matrixData {
  col: number; row: number; alive: boolean;
}

let timerID = 0;

const Upload = () => {
  const [initialState, setInitialState] = useState<string | null>(null);
  const [generation, setGeneration] = useState<number>(0);
  const [matrix, setMatrix] = useState<matrixData[][]>();
  const [data, setData] = useState<string[] | undefined>(undefined)
  let toogleCheck = true;

  useEffect(() => {
    setData(initialState?.split('-'));
  }, [initialState])


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
      const verify = text.split('-');

      if (verify?.length === 3
        && !isNaN(Number(verify[0]))
        && !isNaN(Number(verify[1]))
        && !isNaN(Number(verify[2]))) {
        setInitialState(text)

      } else {
        alert('File is not valid')
      }


    };
    reader.readAsText(e.target.files[0]);
  };


  const createGame = () => {
    reset();
    /**
     * * read a file in the upload and load the game settings
     */

    const grid = [];

    if
      (data) {
      /**
       * * draw the grid with the matrix
       */
      for (let i = 0; i < Number(data[1]); i++) {
        let subGrid = [];
        for (let j = 0; j < Number(data[2]); j++) {
          subGrid.push({ col: j, row: i, alive: false });
        }
        grid.push(subGrid);
      }

      /**
       * * randomly choose where the living cells will be
       */
      for (let i = 0; i < Number(data[0]); i++) {
        const randomRow = Math.floor(Math.random() * grid.length);
        const randomColum = Math.floor(Math.random() * grid[0].length);
        grid[randomRow][randomColum].alive = true;
      }
      setGeneration(Number(data[0]));
      setMatrix(grid);
    }

  }

  /**
   * * the game starts and I check each RECT component and if it has neighbors
   * * with the correct row and column values I do the round in each neighbor
   * * if I find a neighbor I add it to the counter
   */

  const start = () => {

    if (matrix) {
      const rowsLength = matrix.length - 1;
      const colsLength = matrix[0].length - 1;
      const matrixTemp = [...matrix];

      if (toogleCheck) {
        matrixTemp.map((rows) => rows.map((item) => {
          let neighbors = 0;
          //1 to left
          if (item.col > 0 && matrixTemp[item.row][item.col - 1].alive)
            neighbors++;
          //1 to left above
          if (item.col > 0 && item.row > 0 && matrixTemp[item.row - 1][item.col - 1].alive)
            neighbors++;
          //1 above
          if (item.row > 0 && matrixTemp[item.row - 1][item.col].alive)
            neighbors++;
          //1 to right above
          if (item.row > 0 && item.col < colsLength && matrixTemp[item.row - 1][item.col + 1].alive)
            neighbors++;
          //1 to right
          if (item.col < colsLength && matrixTemp[item.row][item.col + 1].alive)
            neighbors++;
          //1 to right below
          if (item.col < colsLength && item.row < rowsLength && matrixTemp[item.row + 1][item.col + 1].alive)
            neighbors++;
          //1 below
          if (item.row < rowsLength && matrixTemp[item.row + 1][item.col].alive)
            neighbors++;
          //1 to left below
          if (item.row < rowsLength && item.col > 0 && matrixTemp[item.row + 1][item.col - 1].alive)
            neighbors++;

          if (neighbors === 3)
            matrixTemp[item.row][item.col].alive = true;
        }));
        toogleCheck = false;
      }
      else {
        matrixTemp.map((rows) => rows.map((item) => {
          let neighbors = 0;
          //1 to left
          if (item.col > 0 && matrixTemp[item.row][item.col - 1].alive)
            neighbors++;
          //1 to left above
          if (item.col > 0 && item.row > 0 && matrixTemp[item.row - 1][item.col - 1].alive)
            neighbors++;
          //1 above
          if (item.row > 0 && matrixTemp[item.row - 1][item.col].alive)
            neighbors++;
          //1 to right above
          if (item.row > 0 && item.col < colsLength && matrixTemp[item.row - 1][item.col + 1].alive)
            neighbors++;
          //1 to right
          if (item.col < colsLength && matrixTemp[item.row][item.col + 1].alive)
            neighbors++;
          //1 to right below
          if (item.col < colsLength && item.row < rowsLength && matrixTemp[item.row + 1][item.col + 1].alive)
            neighbors++;
          //1 below
          if (item.row < rowsLength && matrixTemp[item.row + 1][item.col].alive)
            neighbors++;
          //1 to left below
          if (item.row < rowsLength && item.col > 0 && matrixTemp[item.row + 1][item.col - 1].alive)
            neighbors++;

          /**
           * * toggleCheck serves to validate the living and after the dead
           * * after that I can tell who stays alive or who becomes alive for the next generation
           */

          if (neighbors > 3 || neighbors < 2)
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
        initialState === null ?
          (
            <div className='flex justify-center pt-16'>
              <label htmlFor='fileupload'>Choose file to upload...</label>
              <input type="file" id='fileupload' name="file" onChange={fileUpload} accept=".txt" />
            </div>
          ) :

          (
            <div className='mt-10 flex justify-center space-x-10 items-center'>

              <div className='flex space-x-8'>
                <h1 className='self-center text-3xl font-mono'>The Game of Life</h1>
                <button
                  className={`${timerID !== 0 ? 'bg-red-800' : 'bg-blue-800'} text-zinc-50 font-bold py-8 px-8 rounded-full`}
                  onClick={createGame}>{timerID !== 0 ? 'RESET' : 'SET'}
                </button>
                <button disabled={timerID > 0} onClick={() => { timerID = setInterval(() => start(), 1000); }}
                  className='bg-blue-800 text-zinc-50 font-bold py-8 px-8 rounded-full'
                >GO!
                </button>
              </div>
              <div>
                <span className='text-2xl items-center font-mono'><p>{'Generation: ' + generation}</p></span>
              </div>
            </div>
          )
      }

      <div className='absolute top-32 left-1/3'>
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