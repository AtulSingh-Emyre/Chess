import './App.css';
import { Chessboard } from 'kokopu-react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Chess from 'chess.js';
import Navbarcomp from './Components/Navbar/navbar';
// import Voicerecorder from './Components/VoiceRecorder';
import SpeechProcessing from './Components/SpeechProcessing';
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
      <Navbarcomp />
      <Container>
        <Row >
          <Col>
            <div>
              <h1>Speech Processing Course Project</h1>
              <h4>Recognition of chess movements</h4>
            </div>
            <div style={{ margin: '25px' }}>
              <Chessboard position={position} />

              <div style={{ padding: '10px', margin: '10px' }} >
                <input type="text" placeholder="Enter the move to be played" onChange={HandleMove} style={{width:'500px',height:'50px',textAlign:'center'}}  value={move} />
              </div>
              <Button class="btn btn-secondary" onClick={() => onClick()}>Submit</Button>{' '}
            </div>
          </Col>

        </Row>
        <Row>
          <SpeechProcessing />
          {/* <Voicerecorder /> */}
        </Row>

      </Container>
    </div>
  );
}

export default App;
