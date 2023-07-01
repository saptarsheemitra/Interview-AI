console.log("Less goo");

const KEY="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";
//OPEN AI API KEY.

import { Configuration,OpenAIApi } from "openai";















//API FUNCTION SIU


function API_CALL(){
    const interviewQuestions = 'What are your strengths?|How do you handle stress?|Tell me about a challenging situation you faced and how you resolved it.';
const interviewAnswers = 'My strengths include good communication skills and attention to detail but i am lazy sad.|I handle stress by practicing deep breathing and time management.|In a previous role, I had to meet a tight deadline, so I organized a team meeting to delegate tasks and created a timeline to ensure timely completion.';

//Configuration to set up the API KEY

const openai=new OpenAIApi(new Configuration({
    apiKey:KEY
}))

const conversation = [
    { role: 'system', content: 'You are the interviewer evaluate this Interview the evalutation should not be more than 100 words.' },
    { role: 'user', content: interviewQuestions },
    { role: 'assistant', content: interviewAnswers },
  ];


openai.createChatCompletion({
    model:"gpt-3.5-turbo",
    messages:conversation,
    
}).then(
    res=>{
        console.log(res.data.choices[0].message.content);
        console.log(res.data.choices)
    }
)

}

