import { NextResponse } from 'next/server';
import { parseTaskToSteps } from '@/lib/services/openai';

export async function POST(request) {
  try {
    const { task } = await request.json();

    if (!task) {
      return NextResponse.json(
        { error: 'Please provide a task description' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return demo plan
      return NextResponse.json({
        steps: [
          { action: 'navigate', target: 'https://example.com', description: 'Navigate to target website' },
          { action: 'wait', value: '2000', description: 'Wait for page to load' },
          { action: 'click', target: '#login-button', description: 'Click login button' },
          { action: 'type', target: '#email', value: 'user@example.com', description: 'Enter email' },
          { action: 'click', target: '#submit', description: 'Submit form' },
        ],
        estimatedTime: 10,
        warnings: ['Demo mode - actual selectors may differ'],
        note: 'Demo mode - Add OPENAI_API_KEY for AI task planning',
      });
    }

    const plan = await parseTaskToSteps(task);

    if (!plan) {
      return NextResponse.json(
        { error: 'Failed to plan task' },
        { status: 500 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Plan task error:', error);
    return NextResponse.json(
      { error: 'Failed to plan task', details: error.message },
      { status: 500 }
    );
  }
}
