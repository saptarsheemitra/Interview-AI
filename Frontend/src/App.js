import { Avatar, Box, ChakraProvider, Grid, VStack, theme, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css';
import axios from 'axios';
import Status from './Status';
import Result from './Result';

const assemblyApi = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: process.env.REACT_APP_ASSEMBLY_API_KEY,
    'content-type': 'application/json',
  },
});

const initialState = {
  url: null,
  blob: null,
  chunks: null,
  duration: {
    h: 0,
    m: 0,
    s: 0,
  },
};

function App() {
  const [audioDetails, setAudioDetails] = useState(initialState);
  const [transcript, setTranscript] = useState({ id: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [textData, setTextData] = useState('')
  const [response, setResponse] = useState('')





  useEffect(() => {
    const interval = setInterval(async () => {
      if (transcript.id && transcript.status !== 'completed' && isLoading) {
        try {
          const { data: transcriptData } = await assemblyApi.get(
            `/transcript/${transcript.id}`
          );
          setTranscript({ ...transcript, ...transcriptData }); // have stats = 'completed'
        } catch (err) {
          console.error(err);
        }
      } else {
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, transcript]);

  const handleAudioStop = data => {
    setAudioDetails(data);
  };

  const handleReset = () => {
    setAudioDetails({ ...initialState });
    setTranscript({ id: '' });
    setResponse('')
  };

  // const handleAudioUpload = async audioFile => {
  //   setIsLoading(true);

  //   const { data: uploadResponse } = await assemblyApi.post(
  //     '/upload',
  //     audioFile
  //   );

  //   const { data } = await assemblyApi.post('/transcript', {
  //     audio_url: uploadResponse.upload_url,
  //     sentiment_analysis: true,
  //     entity_detection: true,
  //     iab_categories: true,
  //   });


  //   setTranscript({ id: data.id });




  // };

  const handleAudioUpload = async (audioFile) => {
    setIsLoading(true);
  
    const { data: uploadResponse } = await assemblyApi.post(
      '/upload',
      audioFile
    );
  
    const { data } = await assemblyApi.post('/transcript', {
      audio_url: uploadResponse.upload_url,
      sentiment_analysis: true,
      entity_detection: true,
      iab_categories: true,
    });
  
    setTranscript({ id: data.id });
  
    // Send textData to the backend
    try {
      const response = await axios.post('https://splendid-naiad-41c7ce.netlify.app/.netlify/functions/api/upload', { textData });
      // console.log({textData});
      // console.log('Response from backend:', response.data);
      setResponse(response)
    } catch (error) {
      console.error('Error sending text data to the backend:', error);
    }
  };



  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" bg='#1A202C' >
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
          <Avatar  size = "2xl"
            name = "Assembly AI"
            src = "https://img.freepik.com/free-photo/young-woman-with-round-glasses-yellow-sweater_273609-7091.jpg?w=1060&t=st=1688252030~exp=1688252630~hmac=a3bfa6243fef5657fcc1ea6966eeb9807f728aec81e3948265001750ce5ba5d5">
           
          </Avatar>
          <Box>
            {transcript.text && transcript.status === 'completed' ? (
              <Result setTextData={setTextData} transcript = {transcript} />
            ) : (
              <Status isLoading={isLoading} status = {transcript.status} />
            )}
          </Box>
            <Box width={1000}>
              <Recorder
                record={true}
                audioURL={audioDetails.url}
                handleAudioStop={handleAudioStop}
                handleAudioUpload={handleAudioUpload}
                handleReset={handleReset}
              />
            </Box>
            {response && (
              <Box width={1000}>
                <Text>{JSON.stringify(response.data, null, 2)}</Text>
              </Box>
            )}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
