import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || '',
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1];
  const topic = userMessage.content;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Search phase
        controller.enqueue(encoder.encode('Searching for relevant sources...\n\n'));
        const searchResult = await app.search(topic);
        const urls = searchResult.data.slice(0, 3).map((result: any) => result.url);
        
        // Extract phase
        controller.enqueue(encoder.encode('Extracting information from sources...\n\n'));
        const extractResult = await app.extract(urls, {
          prompt: `Extract key information about ${topic}. Focus on facts, data, and expert opinions.`,
        });

        // Analysis phase
        controller.enqueue(encoder.encode('Analyzing findings...\n\n'));
        const analysis = `Based on the research:

${extractResult.data}

Key findings:
1. [First key finding]
2. [Second key finding]
3. [Third key finding]

Analysis:
[Detailed analysis of the findings]`;

        controller.enqueue(encoder.encode(analysis));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
