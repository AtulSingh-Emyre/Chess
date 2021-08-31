import './App.css';
import { Chessboard } from 'kokopu-react';
import { useState } from 'react';
function App() {
  const [move, setmove] = useState("e4");
  const onClick = () => {
    setmove("d4");
  }
  return (
    <div className="App">
      <Chessboard move ={move} />

      <div onClick={() => onClick()} style={{height:200, width:100, backgroundColor:'black'}}>

      </div>
    </div>
  );
}

export default App;
