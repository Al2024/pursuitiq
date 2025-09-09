import { NextRequest, NextResponse } from 'next/server';
// Force Node.js runtime to allow fs and binary parsing libs, and avoid caching during dev
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { firebaseStorage } from '@/lib/firebaseStorageService';
import mammoth from 'mammoth';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

async function extractTextFromFile(file: File): Promise<{ text: string; buffer: Buffer; useInline: boolean; }> {
  const buffer = Buffer.from(await file.arrayBuffer());

  // For PDFs, prefer inline to Gemini to avoid server-side PDF parsing issues
  if (file.type === 'application/pdf') {
    return { text: '', buffer, useInline: true };
  }

  // Try DOCX via mammoth
  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/msword'
  ) {
    try {
      const { value } = await mammoth.extractRawText({ buffer });
      return { text: value || '', buffer, useInline: false };
    } catch {
      // Fall back to inline if extraction fails
      return { text: '', buffer, useInline: true };
    }
  }

  // Plain text/markdown
  return { text: buffer.toString('utf-8'), buffer, useInline: false };
}

export async function POST(request: NextRequest) {
  try {
    // --- BEGIN VERCEL DEBUGGING ---
    console.log('--- Vercel Environment Variable Check ---');
    console.log(`FIREBASE_PROJECT_ID is set: ${!!process.env.FIREBASE_PROJECT_ID}`);
    console.log(`FIREBASE_CLIENT_EMAIL is set: ${!!process.env.FIREBASE_CLIENT_EMAIL}`);
    console.log(`FIREBASE_STORAGE_BUCKET is set: ${!!process.env.FIREBASE_STORAGE_BUCKET}`);
    console.log(`FIREBASE_PRIVATE_KEY is set: ${!!process.env.FIREBASE_PRIVATE_KEY}`);
    console.log(`GOOGLE_AI_API_KEY is set: ${!!process.env.GOOGLE_AI_API_KEY}`);
    console.log('--- End Vercel Environment Variable Check ---');
    // --- END VERCEL DEBUGGING ---
    console.log('API Route: /api/analyze - POST request received');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('API Error: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`File received: ${file.name}, size: ${file.size}, type: ${file.type}`);

  // 1. Save file to Firebase Storage (emulator in dev, real in prod)
  const fileMetadata = await firebaseStorage.saveFile(file);
    console.log('File saved with metadata:', fileMetadata);

    // 2. Prepare model input (text for text-like files, inline data for PDFs/unsupported)
    const { text: documentText, buffer, useInline } = await extractTextFromFile(file);
    if (!useInline && !documentText.trim()) {
      console.log('API Error: Document is empty or text could not be extracted');
      return NextResponse.json({ error: 'Document is empty or text could not be extracted' }, { status: 400 });
    }

    // 3. Analyze with Google Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const instruction = `Analyze this RFP and return JSON with: disciplines[], dates{submission,completion,siteVisit}, risks[], goNoGoSuggestion (GO|NO-GO), confidence (0-100), rationale.`;

    const parts: any[] = [{ text: instruction }];
    if (useInline) {
      parts.push({ inlineData: { data: buffer.toString('base64'), mimeType: file.type || 'application/octet-stream' } });
    } else {
      parts.push({ text: documentText.substring(0, 100000) });
    }

    console.log('Sending prompt to Gemini AI...');
    const result = await model.generateContent(parts);
    const response = result.response;
    const analysisText = response.text();
    console.log('Received response from Gemini AI.');

    // Clean and parse the JSON response
    const cleanedJsonString = analysisText.replace(/```json|```/g, '').trim();
    const analysisResult = JSON.parse(cleanedJsonString);
    console.log('Parsed analysis result:', analysisResult);

    // 4. Combine results and return
    const combinedResult = {
      ...analysisResult,
      fileMetadata,
    };

    return NextResponse.json(combinedResult);

  } catch (error) {
    console.error('API Error in /api/analyze:', error);
    
    let errorMessage = 'An unknown error occurred';
    let errorDetails: any = {};

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
        cause: error.cause,
      };
    } else {
      errorDetails = error;
    }

    // Log the detailed error for server-side debugging
    console.error('Detailed error object:', JSON.stringify(errorDetails, null, 2));

    return NextResponse.json({ 
      error: 'Failed to analyze document', 
      details: errorMessage,
      fullError: errorDetails, // Send detailed error to frontend for debugging
    }, { status: 500 });
  }
}
