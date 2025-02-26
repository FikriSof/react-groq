import ollama from 'ollama';

export const requestToDeepseekAI = async (
  content: string,
  onStream?: (content: string) => void,
  onThought?: (content: string) => void,
) => {
  try {
    const res = await ollama.chat({
      model: 'deepseek-r1:1.5b',
      messages: [
        {
          role: 'user',
          content,
        },
      ],
      stream: true,
    });

    let fullResponse = '';
    let thoughtResponse = '';

    let outputMode: 'think' | 'response' = 'think';

    for await (const part of res) {
      const messageContent = part.message.content;

      if (outputMode === 'think') {
        thoughtResponse += messageContent;
        onThought?.(thoughtResponse);

        if (messageContent.includes('</think>')) {
          outputMode = 'response';
        }
      } else {
        fullResponse += messageContent;
        onStream?.(fullResponse);
      }
    }

    return fullResponse;
  } catch (error) {
    console.log(error);
  }
};
