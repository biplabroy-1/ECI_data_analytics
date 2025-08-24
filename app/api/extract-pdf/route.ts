
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Create a new FormData to forward to your Python backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

    try {
      const response = await fetch('http://eci-backend.azmth.in/api/analyze-pdf', {
        method: 'POST',
        body: backendFormData,
        signal: controller.signal,
        // Add headers if needed
        headers: {
          // Don't set Content-Type, let the browser set it for FormData
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        return NextResponse.json(
          { error: `Backend processing failed: ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Request timeout:', fetchError);
        return NextResponse.json(
          { error: 'Request timed out. The file may be too large or the backend is overloaded.' },
          { status: 504 }
        );
      }

      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to connect to processing backend' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}