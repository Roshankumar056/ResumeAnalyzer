import React from 'react';
import { History, Trash2, Calendar, FileText } from 'lucide-react';

export default function HistorySidebar({ history, onSelect, onDelete, activeId }) {
    return (
        <div className="w-80 bg-white border-r border-slate-200 h-screen flex flex-col hidden lg:flex">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-500" />
                <h2 className="font-bold text-slate-800">Scan Activity Logs</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {history.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8 italic">No previous scans found</p>
                ) : (
                    history.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => onSelect(item)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col gap-2 relative ${
                                activeId === item._id 
                                ? 'bg-blue-50/70 border-blue-200' 
                                : 'border-slate-100 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-start justify-between pr-6">
                                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm truncate">
                                    <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                                    <span className="truncate">{item.filename}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item._id);
                                    }}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                                <span className={`font-bold px-1.5 py-0.5 rounded ${
                                    item.atsScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                    {item.atsScore}%
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}