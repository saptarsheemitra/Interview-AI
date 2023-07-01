// import MicRecorder from "mic-recorder-to-mp3"
// import axios from "axios"
import { useEffect, useState, useRef } from "react";
import { Box, ChakraProvider, Grid, theme, VStack } from "@chakra-ui/react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";

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

  const handleAudioUpload = () => {

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
