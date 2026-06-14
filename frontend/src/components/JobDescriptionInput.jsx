import React from 'react';
import { Briefcase } from 'lucide-react';

export default function JobDescriptionInput({ value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" /> Target Job Description
            </label>
            <textarea
                className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-slate-400 text-slate-800 transition-all text-sm resize-none"
                placeholder="Paste the target job requirements, roles, or expectations here to match metrics..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}