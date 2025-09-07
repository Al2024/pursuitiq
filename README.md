This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## AI Analysis Setup

This application uses Google Gemini AI for document analysis. To enable AI functionality:

1. **Get Google AI API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Configure Environment**:
   - Open `.env.local` file
   - Replace `your_google_ai_api_key_here` with your actual API key
   - Save the file

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

4. **Test AI Analysis**:
   - Upload a PDF or DOCX file
   - Click "Analyze Project"
   - The AI will extract disciplines, dates, risks, and provide Go/No-Go recommendations

### Supported File Types
- PDF documents (.pdf)
- Word documents (.docx)
- Text files (.txt)

### AI Analysis Features
- **Discipline Extraction**: Identifies required technical specialties
- **Date Analysis**: Extracts key project dates and deadlines
- **Risk Assessment**: Identifies potential RAMP risks
- **Go/No-Go Recommendation**: Provides bidding decision with confidence score
