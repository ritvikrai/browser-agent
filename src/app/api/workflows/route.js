import { NextResponse } from 'next/server';
import { getWorkflows, saveWorkflow } from '@/lib/services/storage';

export async function GET() {
  try {
    const workflows = await getWorkflows();
    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Get workflows error:', error);
    return NextResponse.json(
      { error: 'Failed to get workflows' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, description, steps } = await request.json();

    if (!name || !steps) {
      return NextResponse.json(
        { error: 'Name and steps required' },
        { status: 400 }
      );
    }

    const workflow = await saveWorkflow(name, description, steps);
    return NextResponse.json({ success: true, workflow });
  } catch (error) {
    console.error('Save workflow error:', error);
    return NextResponse.json(
      { error: 'Failed to save workflow' },
      { status: 500 }
    );
  }
}
