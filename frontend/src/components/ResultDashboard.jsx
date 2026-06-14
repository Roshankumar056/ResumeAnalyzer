import React from 'react';
import { Target, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';

export default function ResultDashboard({ result }) {
    if (!result) return null;

    const { atsScore, matchedKeywords, missingKeywords, suggestions } = result;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-rose-600 bg-rose-50 border-rose-200';
    };

    return (
        <div className="space-y-6">
            {/* ATS Score Card */}
            <div className={`p-6 border rounded-2xl flex items-center justify-between ${getScoreColor(atsScore)}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-xs">
                        <Target className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">ATS Match Analysis</h3>
                        <p className="text-sm text-slate-600 mt-0.5">Overall framework structural evaluation alignment matrix score.</p>
                    </div>
                </div>
                <div className="text-4xl font-black px-6 py-3 bg-white rounded-2xl shadow-xs border border-inherit">
                    {atsScore}%
                </div>
            </div>

            {/* Keywords Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Matched Keywords ({matchedKeywords.length})
                    </h4>
                    {matchedKeywords.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">No direct semantic matches located.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {matchedKeywords.map((kw, i) => (
                                <span key={i} className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md">{kw}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-rose-500" /> Critical Keyword Gaps ({missingKeywords.length})
                    </h4>
                    {missingKeywords.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Perfect core alignment! No foundational gaps discovered.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {missingKeywords.map((kw, i) => (
                                <span key={i} className="text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-md">{kw}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" /> Structural Improvement Recommendations
                </h4>
                <ul className="space-y-3">
                    {suggestions.map((suggestion, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}