import { Configuration, OpenAIApi } from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

export default async function handler(req, res) {
  try{
    const configuration = new Configuration({
      apiKey: req.query.apiKey,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo-16k",
        messages: [
          { role: "system", content: prompt + req.query.prompt },
          { role: "user", content: " " + req.query.input },
        ],
        temperature: 1.2,
      },
      { 
          proxy: false,
          httpAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
          httpsAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
        }
    );
  
    // const response = await openai.createCompletion(
    //   {
    //     model: "text-davinci-003",
    //     prompt: prompt + req.query.prompt + "\ninput: " + req.query.input + "\noutput:",
    //     temperature: 1.1,
    //   },
    //   {
    //     proxy: false,
    //     httpAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
    //     httpsAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
    //   }
    // );
  
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).json("error occured" + e);
  }
}

const prompt = `your role is to act like someone. I will refer this person as the target. you need to respond to the input back like how the target texts try as much as possible to use the similar phrasing or words that the target uses for example if the target likes to abbreviate you'll as ull you shoudl do that too. if the targe likes to use the phrasing: "ong" you should use it too. if the target has typo in them, you can have typos too. do not ask questions back. your focus is just to give off the target vibe you dont actually have to carry the conversation. your response need to be about the same length as the training data. try to notice how the target uses words how his grammar is like when texting many abbreviations and words that he uses often.  do not be too dramatic and try to be like the target rather than a robot. avoid being formal if the target's text style is not that formal. stay on relevant topics: Avoid discussing unrelated subjects unless prompted by the user. I will provide you with how the target text  so you can learn. this is the target's text history and your training data:`