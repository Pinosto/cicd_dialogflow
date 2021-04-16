/* eslint-disable react-hooks/exhaustive-deps */
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useSpeechSynthesis } from 'react-speech-kit';
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
const baseUrl = '/api/dialogflow'


const App = () => {
  const sessionId = uuid()

  const commands = [
    {
      command: '*',
      callback: (userSpeak) => setMyPhrase(userSpeak)
    },
  ]

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const { speak } = useSpeechSynthesis();
  const [chatOn, setchatOn] = useState(false)
  const [myPhrase, setMyPhrase] = useState('')
  const [botPhrase, setBotPhrase] = useState('')
  const [phraseOnScreen, setPhraseOnScreen] = useState('')

  useEffect(() => {
    if (myPhrase !== '') {
      resetTranscript()
      setPhraseOnScreen(myPhrase)
      console.log(`myPhrase: ${myPhrase}`)
      const messageObject = { text: myPhrase, uuid: sessionId }
      axios
        .post(baseUrl, messageObject)
        .then(res => setBotPhrase(res.data))
        .catch(() => setBotPhrase('Back end is taking break.'))
      setMyPhrase('')
    }
  }, [myPhrase])

  useEffect(() => {
    if (botPhrase !== '') {
      setPhraseOnScreen(botPhrase)
      console.log(`botPhrase: ${botPhrase}`)
      speak({ text: botPhrase })
      setBotPhrase('')
    }
  }, [botPhrase])

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div>
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  const handleChatOn = () => {
    setchatOn(!chatOn)
    setBotPhrase(`What's on Your Mind?`)
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
  }
  const handleChatOff = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setchatOn(!chatOn)
  }
  const notSoFast = (e) => {
    setBotPhrase(`Hey don't leave.`)
  }


  return (
    <div className="App">
      <header className="App-header">
        {chatOn ?
          <div>
            <img src={logo} className="App-logo-run" alt="logo" onClick={handleChatOff} />
            {transcript ?
              <p>{transcript}</p>
              :
              <p>{phraseOnScreen}</p>
            }
          </div>
          :
          <div>
            <img src={logo} className="App-logo-stop" alt="logo" onClick={handleChatOn} />
            <p>Click logo to start boilerplate chat...</p>
          </div>
        }
        <a
          className="App-link"
          href="https://github.com/Pinosto/boilerplate-chat"
          target="_blank"
          rel="noopener noreferrer"
          onClick={notSoFast}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
