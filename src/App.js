import './App.css';
import { Chessboard } from 'kokopu-react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
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
      <Container>
        <Row >
          <Col xs={6} md={4}>
            <div>
              <h1>Speech Processing Course Project</h1>
              <h4>Recognition of chess movements</h4>
            </div>
            <div style={{ margin: '25px' }}>
              <Chessboard position={position} />
            </div>

            <div >
              <Form.Control type="text" style={{ height: '75px', width: '250px', textAlign: 'center' }} placeholder="Enter the move to be played" onChange={HandleMove} value={move} />
              <br />
              <Button style={{ height: '30px', width: '100px', backgroundColor: 'yellow', margin: '10px' }} onClick={() => onClick()}>Submit</Button>{' '}
            </div>
          </Col>
          <Col xs={6} md={4}>
            apple
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
