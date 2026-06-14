import React, { useState, useEffect } from 'react';
import FileUploadZone from './components/FileUploadZone';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResultDashboard from './components/ResultDashboard';
import HistorySidebar from './components/HistorySidebar';
import { analyzeResume, getHistory, deleteAnalysis } from './services/api';
import { Cpu, Loader2, Sparkles } from 'lucide-react';

export default function App() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentResult, setCurrentResult] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistoryLogs();
    }, []);

    const fetchHistoryLogs = async () => {
        try {
            const data = await getHistory();
            setHistory(data);
        } catch (err) {
            console.error('Failed to load history list framework matrix.', err);
        }
    };

    const handleRunAnalysis = async () => {
        if (!file || !jobDescription.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const data = await analyzeResume(file, jobDescription);
            setCurrentResult(data);
            fetchHistoryLogs(); // Refresh sidebar history list asynchronously
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected analysis operational failure emerged.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLogItem = async (id) => {
        try {
            await deleteAnalysis(id);
            if (currentResult?._id === id) setCurrentResult(null);
            fetchHistoryLogs();
        } catch (err) {
            console.error('Delete transaction failed.', err);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
            {/* Activity History Sidebar */}
            <HistorySidebar 
                history={history} 
                onSelect={setCurrentResult} 
                onDelete={handleDeleteLogItem} 
                activeId={currentResult?._id}
            />

            {/* Core Working Area Workspace */}
            <div className="flex-1 overflow-y-auto">
                {/* Navbar Header banner */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-1.5">
                                AI Resume Analyzer <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5"><Sparkles className="w-3 h-3" /> Gemini 2.5</span>
                            </h1>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto p-8 space-y-8">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    {/* Inputs Split Grid setup */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-700 block">Upload Document</label>
                            <FileUploadZone onFileSelect={setFile} selectedFile={file} />
                        </div>
                        <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
                    </div>

                    {/* Action Execution Button node control */}
                    <button
                        onClick={handleRunAnalysis}
                        disabled={loading || !file || !jobDescription.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Deep Engine Analysis in Progress...
                            </>
                        ) : (
                            'Execute ATS Tailor Evaluation Scan'
                        )}
                    </button>

                    <hr className="border-slate-200" />

                    {/* Interactive Metrics Reports Result Node */}
                    <ResultDashboard result={currentResult} />
                </main>
            </div>
        </div>
    );
}