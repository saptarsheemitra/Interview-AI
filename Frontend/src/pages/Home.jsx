// import MicRecorder from "mic-recorder-to-mp3"
import { useEffect, useState, useRef } from "react";
import { Box, ChakraProvider, Grid, theme, VStack } from "@chakra-ui/react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import axios from "axios"

const assemblyApi = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: process.evn.REACT_APP_ASSEMBLY_API_KEY,
    "content-type": 'application/json',
  },
})

const initialState = {
  url: null,
  blob: null,
  chuncks: null,
  duration: {
    h: 0,
    m: 0,
    s: 0,
  },
}

const Home = () => {
  const [audioDetails, setAudioDetails] = useState(initialState);

  const [transcript, setTranscript] = useState({ id: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleAudioStop = (data) => {
    setAudioDetails(data);
  }

  const handleReset = () => {
    setAudioDetails({...initialState})
    setTranscript({id: ''})
  };

  const handleAudioUpload = async (audioFile) => {
    setIsLoading(true)

    const { data: uploadResponse } = await assemblyApi.post('/upload', audioFile);

  }

  

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Box width={1000}>
            <Recorder
              record={true}
              audioURL={audioDetails.url}
              handleAudioStop={handleAudioStop}
              handAudioUpload={handleAudioUpload}
              handleReset={handleReset}
            />
            </Box>
            </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
