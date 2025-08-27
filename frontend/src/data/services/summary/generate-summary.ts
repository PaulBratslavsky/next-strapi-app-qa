import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function generateSummary(content: string, template?: string) {
  const systemPrompt = template || `
    You are a helpful assistant that creates concise and informative summaries of YouTube video transcripts.
    Please summarize the following transcript, highlighting the key points and main ideas.
    Keep the summary clear, well-structured, and easy to understand.
  `;

  try {
    const { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini'),
      system: systemPrompt,
      prompt: `Please summarize this transcript:\n\n${content}`,
      temperature: process.env.OPENAI_TEMPERATURE
        ? parseFloat(process.env.OPENAI_TEMPERATURE)
        : 0.7,
      maxOutputTokens: process.env.OPENAI_MAX_TOKENS
        ? parseInt(process.env.OPENAI_MAX_TOKENS)
        : 4000,
    });

    return text;
  } catch (error) {
    console.error('Error generating summary:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
    
    throw new Error('Failed to generate summary');
  }
}