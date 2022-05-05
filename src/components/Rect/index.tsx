interface RectProps {
  column?: number;
  row?: number;
  alive?: boolean;
}


const Rect = ({ column = 0, row = 0, alive }: RectProps) => {

  return (
    <div
      className='absolute'
      style={{
        backgroundColor: `${alive ? 'black' : 'white'}`, top: `${((row + 1) * 20)}px`, left: `${((column + 1) * 20)}px`
        , width: '20px', height: '20px', border: '0.2px solid #000'
      }}>

    </div>
  )

}

export default Rect