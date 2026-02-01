import { NextResponse } from 'next/server';
import { parseTaskToSteps } from '@/lib/services/openai';
import { getBrowserAutomation } from '@/lib/services/browser';
import { saveTask } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { task, steps: providedSteps } = await request.json();

    if (!task && !providedSteps) {
      return NextResponse.json(
        { error: 'Please provide a task description or steps' },
        { status: 400 }
      );
    }

    let steps = providedSteps;

    // If no steps provided, parse the task
    if (!steps) {
      if (!process.env.OPENAI_API_KEY) {
        // Return demo steps
        steps = [
          { action: 'navigate', target: 'https://example.com', description: 'Navigate to example.com' },
          { action: 'wait', value: '1000', description: 'Wait for page to load' },
          { action: 'extract', target: 'h1', value: 'text', description: 'Extract heading' },
          { action: 'screenshot', description: 'Take screenshot' },
        ];
      } else {
        const parsed = await parseTaskToSteps(task);
        if (!parsed) {
          return NextResponse.json(
            { error: 'Failed to parse task into steps' },
            { status: 500 }
          );
        }
        steps = parsed.steps;
      }
    }

    // Execute the steps
    const automation = await getBrowserAutomation();
    const result = await automation.runTask(steps);

    // Save the task
    const saved = await saveTask(task, steps, result);

    return NextResponse.json({
      success: true,
      data: {
        ...saved,
        note: 'Running in simulation mode. Install Playwright for real browser automation.',
      },
    });
  } catch (error) {
    console.error('Run task error:', error);
    return NextResponse.json(
      { error: 'Failed to run task', details: error.message },
      { status: 500 }
    );
  }
}
