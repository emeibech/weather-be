import { Request, Response, Router } from 'express';
import { handleCors, handleRateLimit } from '../../common/middleWares.js';
import chatCompletion from './utils/chatCompletion.js';
import { getOpenAiError } from '@/common/getErrorMessage.js';

const codeAnalyzer = Router();

codeAnalyzer.use(handleCors);
codeAnalyzer.use(handleRateLimit({ max: 100, minutes: 1440 }));

codeAnalyzer.post('/', async (req: Request, res: Response) => {
  try {
    await chatCompletion({
      res,
      sysContent:
        "You are going to receive a prompt that contains code. Your task is to explain what the code does.\n\nCarefully follow these instructions in your response: \n1. Analyze the prompt. Take as much time as you need.\n2. If the prompt contains no code, respond by saying that you're a code analyzer and expects to receive code in the prompt.\n4. Provide a summary of what the code does.\n3. Provide a line-by-line breakdown of the code.",
      userContent: req.body,
      temperature: 0.2,
    });

    res.end();
  } catch (error) {
    res.status(res.statusCode).json({
      error: getOpenAiError(error),
    });
  }
});

export default codeAnalyzer;
