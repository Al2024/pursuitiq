"use client";
import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  dimension: string; // e.g. ANALYSIS, EXECUTION, RELATIONSHIP, RISK
}

const questions: Question[] = [
  { id: 'q1', text: 'I enjoy rapidly deconstructing complex RFP requirements.', dimension: 'ANALYSIS' },
  { id: 'q2', text: 'I push for decisive bid / no-bid calls early.', dimension: 'EXECUTION' },
  { id: 'q3', text: 'I build internal consensus before moving forward.', dimension: 'RELATIONSHIP' },
  { id: 'q4', text: 'I am comfortable highlighting uncomfortable risks.', dimension: 'RISK' },
  { id: 'q5', text: 'I iterate on process metrics each pursuit.', dimension: 'EXECUTION' },
  { id: 'q6', text: 'I spot scope gaps others miss.', dimension: 'ANALYSIS' },
];

const scale = [1,2,3,4,5];

export default function PersonalityPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qid: string, value: number) => {
    setAnswers(a => ({ ...a, [qid]: value }));
  };

  const complete = questions.every(q => answers[q.id]);

  const dimensionScores = questions.reduce<Record<string, number[]>>((acc, q) => {
    const v = answers[q.id];
    if (v) {
      acc[q.dimension] = acc[q.dimension] || [];
      acc[q.dimension].push(v);
    }
    return acc;
  }, {});

  const summary = Object.entries(dimensionScores).map(([dim, vals]) => {
    const avg = vals.reduce((s,v)=>s+v,0)/vals.length;
    return { dim, avg: Number(avg.toFixed(2)) };
  }).sort((a,b)=>a.dim.localeCompare(b.dim));

  const dominant = summary.slice().sort((a,b)=>b.avg - a.avg)[0];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-5 border-b bg-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Back</Link>
          <h1 className="text-2xl font-bold text-gray-900">Personality Fit Explorer</h1>
        </div>
        <Link href="/analyze" className="text-sm font-medium text-gray-600 hover:text-gray-900">Go to PursuitIQ →</Link>
      </header>
      <div className="max-w-5xl w-full mx-auto p-6 space-y-10">
        <section className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Quick, informal self-assessment. Rate each statement 1 (Strongly Disagree) – 5 (Strongly Agree). No data is persisted; scores stay in your browser session only.
          </p>
        </section>
        <section className="grid gap-6">
          {questions.map(q => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{q.text}</p>
                  <p className="text-xs mt-1 text-gray-500 tracking-wide">{q.dimension}</p>
                </div>
                <div className="flex space-x-2">
                  {scale.map(v => (
                    <button
                      key={v}
                      onClick={() => handleSelect(q.id, v)}
                      className={`w-9 h-9 rounded-md text-sm font-medium border transition ${answers[q.id] === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
        <div className="flex items-center justify-between">
          <button
            disabled={!complete}
            onClick={() => setSubmitted(true)}
            className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >Generate Snapshot</button>
          <button
            onClick={() => { setAnswers({}); setSubmitted(false);} }
            className="text-sm text-gray-500 hover:text-gray-800"
          >Reset</button>
        </div>
        {submitted && (
          <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Snapshot</h2>
            {summary.length === 0 && <p className="text-sm text-gray-500">Answer questions to see your profile.</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              {summary.map(s => (
                <div key={s.dim} className="p-4 rounded-md bg-gray-50 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{s.dim}</span>
                  <span className="text-sm text-gray-900">{s.avg}</span>
                </div>
              ))}
            </div>
            {dominant && (
              <p className="text-sm text-gray-600">
                Dominant tendency: <span className="font-medium text-gray-900">{dominant.dim}</span>. Use this awareness to balance team composition in pursuits.
              </p>
            )}
            <p className="text-xs text-gray-500">Not a psychometric instrument—informal directional tool only.</p>
          </section>
        )}
      </div>
      <footer className="py-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} InfrabuildAI.</footer>
    </main>
  );
}
