import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const config = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    NODE_ENV: process.env.NODE_ENV,
  };

  console.log('🔧 Environment Configuration:', config);

  try {
    // Test connection to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const healthUrl = `${backendUrl}/health`;
    
    console.log(`🔍 Testing backend connection: ${healthUrl}`);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const backendStatus: any = {
      url: healthUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    };

    if (response.ok) {
      const data = await response.json();
      backendStatus.data = data;
    } else {
      const errorText = await response.text();
      backendStatus.error = errorText;
    }

    return NextResponse.json({
      frontend: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      config,
      backend: backendStatus,
    });

  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    
    return NextResponse.json({
      frontend: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      config,
      backend: {
        status: 'connection_failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}