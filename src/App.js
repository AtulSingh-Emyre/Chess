import './App.css';
import { Chessboard } from 'kokopu-react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Chess from 'chess.js';
import Navbarcomp from './Components/Navbar/navbar';
// import Voicerecorder from './Components/VoiceRecorder';
import SpeechProcessing from './Components/SpeechProcessing';
import { data } from 'jquery';
var chess;
const test=[];
function App() {
  const [position, setPosition] = useState('start');
  const [move, setmove] = useState('');
  // const [recognizedMove,setRecognizedMove] = useState('');
  useEffect(() => {
    chess = new Chess();
    return () => {
    };
  }, []);
  const RenderRecognizedMove = (text) => {
    setmove(move+''+text);
  }

  const HandleMove = (event) => {
    setmove(event.target.value);
    // console.log(event.target.value);
  }
  const onClick = () => {
    chess.move(move);
    test.push(move+' ');
    // chess.move('e5');
    console.log(chess.fen());
    setPosition(chess.fen());
    setmove('');
  }
  const renderdata = () =>{
    return test;
  }
  return (
    <div className="App">
      <Navbarcomp />
      <br />
      <Container>
        <Row >
          <Col>
            <div>
              <h1>Speech Processing Course Project</h1>
              <h4>Recognition of chess movements</h4>
            </div>
            <div style={{ margin: '25px' }}>
              <Chessboard position={position} />

              <div style={{ padding: '10px', margin: '10px', justifyContent: 'center', display: 'flex' }} >
                <input type="text" placeholder="Enter the move" onChange={HandleMove} style={{ textalign: 'center' }} value={move} />
                {/* {<label class="form-label" for="form1">Manual Control</label> */}
              </div>
              <Button type="button" class="btn btn-outline-secondary" data-mdb-ripple-color="dark" onClick={() => onClick()}>Submit</Button>{' '}
            </div>
          </Col>
          <Col>
          <h2>Previous Moves</h2>
              <h4>{renderdata()}</h4>{' '}
          </Col>
        </Row>
        <Row>
          <SpeechProcessing handleRecognizedMove={RenderRecognizedMove} />
          {/* <Voicerecorder /> */}
        </Row>

      </Container>
    </div>
  );
}

export default App;
