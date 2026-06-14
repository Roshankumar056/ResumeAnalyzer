import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function FileUploadZone({ onFileSelect, selectedFile }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                selectedFile ? 'border-emerald-500 bg-emerald-50/30' :
                isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    onFileSelect(e.dataTransfer.files[0]);
                }
            }}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input 
                id="fileInput" 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileChange} 
            />
            
            {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                    <div>
                        <p className="text-slate-800 font-medium truncate max-w-xs">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document Ready</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-slate-400" />
                    <div>
                        <p className="text-slate-700 font-medium">Drag & drop your resume PDF here</p>
                        <p className="text-xs text-slate-500 mt-1">Supports PDF format up to 5MB</p>
                    </div>
                </div>
            )}
        </div>
    );
}