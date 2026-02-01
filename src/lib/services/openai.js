import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseTaskToSteps(task) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a browser automation expert. Convert natural language tasks into browser automation steps.

Return JSON:
{
  "steps": [
    {
      "action": "navigate|click|type|scroll|wait|extract|screenshot",
      "target": "URL or CSS selector or description",
      "value": "Text to type or wait time in ms",
      "description": "Human-readable description"
    }
  ],
  "estimatedTime": "in seconds",
  "warnings": ["any potential issues"]
}

Available actions:
- navigate: Go to a URL
- click: Click an element (use CSS selector)
- type: Type text into an input (use CSS selector)
- scroll: Scroll the page (value: up/down/element selector)
- wait: Wait for element or time (value: selector or ms)
- extract: Extract data from elements (target: selector, value: attribute or 'text')
- screenshot: Take a screenshot`,
      },
      {
        role: 'user',
        content: `Convert this task to browser automation steps:\n${task}`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse steps:', e);
  }
  
  return null;
}

export async function analyzePageForTask(pageContent, task) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Analyze page content and suggest the best selectors/actions to complete a task.',
      },
      {
        role: 'user',
        content: `Task: ${task}\n\nPage content (truncated):\n${pageContent.substring(0, 3000)}`,
      },
    ],
    max_tokens: 800,
  });

  return response.choices[0].message.content;
}
