import { OpenAI } from "langchain/llms/openai";


const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

const res = await model.call(
  "What would be a good company name for a company that makes colorful socks?"
);
console.log(res);

export default async function handler(req, res) {
    res.status(200).json("hi");
}
