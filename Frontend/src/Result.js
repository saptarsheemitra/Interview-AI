import React from 'react';
import { Text } from '@chakra-ui/react';
import Highlighted from './Highlighted';

export default function Result({setTextData, transcript }) {
  const fullText = transcript.sentiment_analysis_results
    .map(result => result.text)
    .join(' ');

  
  // console.log('Full Text:', fullText); // Log the full text to the console
  setTextData(fullText)

  return (
    <div>
      <Text >
        <Highlighted text={fullText} sentiment="FULL_TEXT" entities={transcript.entities} />
      </Text>
    </div>
  );
}