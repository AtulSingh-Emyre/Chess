import React, { useRef, useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import Meyda from "meyda";
const audioContext = new AudioContext();


const Voicerecorder = () => {
    const [recordState, setrecordState] = useState(null);
    const audioRef = useRef();
    const onStart = () => {
        setrecordState(RecordState.START);
    }
    const onEnd = () => {
        setrecordState(RecordState.STOP);
    }

    //audioData contains blob and blobUrl
    const onStop = (audioData) => {
        console.log('audioData >>>', audioData);
    }


    return (
        <div>
            <div><h4>Voice Recorder</h4></div>
            <div style={{ backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AudioReactRecorder state={recordState} onStop={onStop} />
            </div>
            <Row>
                <Col><Button style={{ height: '45px', width: '150px', backgroundColor: 'Red', margin: '10px', padding: '5px' }} onClick={onStart}>Record</Button>
                    <Button style={{ height: '45px', width: '150px', backgroundColor: 'Pink', margin: '10px', padding: '5px' }} onClick={onEnd}>Stop</Button>
                </Col>
            </Row>
        </div>
    );
}

export default Voicerecorder;
