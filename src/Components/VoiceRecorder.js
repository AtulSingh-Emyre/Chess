import React, { useState } from 'react';
// Import module.

import AudioReactRecorder, { RecordState } from 'audio-react-recorder'


const Voicerecorder = () => {
    const [recordState, setrecordState] = useState(null);

    const onStart = () => {
        setrecordState(RecordState.START);
    }
    const onEnd = () => {
        setrecordState(RecordState.STOP);
    }

    //audioData contains blob and blobUrl
    const onStop = (audioData) => {
        console.log('audioData', audioData)
    }

    
    return (
        <div>
            <div style={{backgroundColor:'white',width:300,height:300}}>
            <AudioReactRecorder state={recordState} onStop={onStop} />
            
            </div>
            <div style={{backgroundColor:'black',width:300,height:300}} onClick={onStart}></div>
            <div style={{backgroundColor:'yellow',width:300,height:300}} onClick={onEnd}></div>
        </div>
    );
}

export default Voicerecorder;
