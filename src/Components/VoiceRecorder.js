import React, { useRef, useState } from 'react';
// Import module.

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
            <div style={{backgroundColor:'white',width:300,height:300}}>
            <AudioReactRecorder state={recordState} onStop={onStop} />
            <audio controls ref={audioRef}>
                <source src={recordState?recordState.url:null} type='audio/mpeg' />
            </audio>
            {/* <audio
                controls
                loop
                crossorigin="anonymous"
                id="audio"
                src={recordState?recordState.url:null}
            ></audio> */}
            </div>
            <div style={{backgroundColor:'black',width:300,height:300}} onClick={onStart}></div>
            <div style={{backgroundColor:'yellow',width:300,height:300}} onClick={onEnd}></div>
        </div>
    );
}

export default Voicerecorder;
