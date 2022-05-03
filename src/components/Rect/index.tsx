import React from 'react';

interface RectProps {
  column?: number;
  row?: number;
  alive?: boolean;
}


const Rect = ({ column = 0, row = 0, alive }: RectProps) => {

  return (
    <div style={{
      backgroundColor: `${alive ? 'black' : 'white'}`, position: 'absolute', top: `${((row + 1) * 50)}px`, left: `${((column + 1) * 50)}px`
      , width: '50px', height: '50px', border: '0.2px solid #000'
    }}>

    </div>
  )

}

export default Rect