import './App.css';
import { Chessboard } from 'kokopu-react';
import {Form} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Chess from 'chess.js';
 var chess;

function App() {
  const [position, setPosition] = useState('start');
  const [move, setmove] = useState('');
  useEffect(() => {
    chess = new Chess();
    return () => {
    };
  }, []);
  const HandleMove = (event) => {
    setmove(event.target.value);
    // console.log(event.target.value);
  }
  const onClick = () => {
    chess.move(move);
    // chess.move('e5');
    console.log(chess.fen());
    setPosition(chess.fen());
    setmove('');
  }
  return (
    <div className="App">
      <Chessboard position ={position} />

      <div onClick={() => onClick()} style={{height:200, width:100, backgroundColor:'black'}}>
      <Form.Control style={{width:200, height: 80}} placeholder="Enter the move to be played" onChange={HandleMove} value={move} />

      </div>
    </div>
  );
}

export default App;
