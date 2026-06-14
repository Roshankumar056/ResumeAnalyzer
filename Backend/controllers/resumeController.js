const PDFParser = require("pdf2json");
const Analysis = require('../models/Analysis');

/**
 * @desc    Upload a resume PDF, parse text securely, analyze using Gemini AI via direct REST, and save results
 * @route   POST /api/resume/analyze
 */
exports.analyzeResume = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        
        // 1. Input Validation Guardrails
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a resume PDF file.' });
        }
        if (!jobDescription || jobDescription.trim() === "") {
            return res.status(400).json({ error: 'Please provide a target job description.' });
        }

        // 2. Resilient PDF Text Extraction Pipeline (Handles complex XRef & Link structures)
        let resumeText = '';
        try {
            resumeText = await new Promise((resolve, reject) => {
                const pdfParser = new PDFParser(null, 0); 

                pdfParser.on("pdfParser_dataError", errData => {
                    reject(errData.parserError || errData);
                });

                pdfParser.on("pdfParser_dataReady", pdfData => {
                    try {
                        let extractedPagesText = "";
                        if (pdfData && pdfData.Pages) {
                            pdfData.Pages.forEach(page => {
                                if (page.Texts) {
                                    page.Texts.forEach(textObj => {
                                        if (textObj.R && textObj.R[0]) {
                                            const cleanText = decodeURIComponent(textObj.R[0].T);
                                            extractedPagesText += cleanText + " ";
                                        }
                                    });
                                }
                            });
                        }
                        resolve(extractedPagesText);
                    } catch (extractionError) {
                        reject(extractionError);
                    }
                });

                pdfParser.parseBuffer(req.file.buffer);
            });
        } catch (pdfError) {
            console.warn('Primary parser bypass executed, trying direct string-stream buffer extraction fallback...');
            resumeText = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, '');
        }

        // Clean up messy whitespace layout patterns
        resumeText = resumeText.replace(/\s+/g, ' ').trim();

        if (!resumeText || resumeText.length < 10) {
            return res.status(422).json({ 
                error: 'The uploaded PDF structural properties could not be read. Please use a text-selectable PDF.' 
            });
        }

        // 3. Environment Sanitization
        let rawKey = process.env.GEMINI_API_KEY;
        if (!rawKey) {
            console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from process.env variables.");
            return res.status(500).json({ error: "Server credential missing configuration errors." });
        }

        // Extreme cleanup: Strips quotes, backticks, spaces, carriage returns, or dotenvx noise
        const sanitizedKey = rawKey.replace(/['"`\s\r\n]/g, '').trim();

        // 4. Construct prompt with explicit schema constraints
        const promptText = `
            You are an expert ATS (Applicant Tracking System) optimization tool.
            Analyze the following resume text against the provided job description.
            
            Resume Text:
            "${resumeText}"
            
            Job Description:
            "${jobDescription}"

            You must respond with a single, clean JSON object matching this schema shape exactly, with no markdown formatting tags around it:
            {
                "atsScore": 75,
                "matchedKeywords": ["React", "Node.js"],
                "missingKeywords": ["TypeScript", "Docker"],
                "suggestions": ["Add metrics to your backend project description."]
            }
        `;

        // 5. Native Fetch REST API Request Architecture
        // We append the key explicitly to the query parameters and use a plain application/json payload
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${sanitizedKey}`;
        
        let apiResponse;
        try {
            const fetchResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: promptText }]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            apiResponse = await fetchResponse.json();

            if (!fetchResponse.ok) {
                console.error("Direct API Rest Error Payload:", JSON.stringify(apiResponse));
                throw new Error(apiResponse.error?.message || `HTTP error! status: ${fetchResponse.status}`);
            }

        } catch (aiError) {
            console.error('Direct Gemini REST Request Failure:', aiError.message || aiError);
            return res.status(502).json({ 
                error: 'Failed to communicate with AI generation backend REST endpoint. Verify the key string inside your .env file.' 
            });
        }

        // 6. Safely Extract Content and handle JSON Parsing
        let responseText = '';
        try {
            responseText = apiResponse.candidates[0].content.parts[0].text;
        } catch (mapError) {
            console.error("Unexpected response payload schema structure layout:", JSON.stringify(apiResponse));
            return res.status(502).json({ error: 'AI engine generated an unmapped response format structure.' });
        }

        let aiData;
        try {
            aiData = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Gemini structural formatting exception output string:', responseText);
            return res.status(502).json({ error: 'AI generated an unparsable response framework structure.' });
        }

        // 7. Map and sanitize fallback payloads to guarantee DB scheme compliance
        const analysisLog = new Analysis({
            filename: req.file.originalname,
            jobDescription: jobDescription.trim(),
            atsScore: typeof aiData.atsScore === 'number' ? aiData.atsScore : 0,
            matchedKeywords: Array.isArray(aiData.matchedKeywords) ? aiData.matchedKeywords : [],
            missingKeywords: Array.isArray(aiData.missingKeywords) ? aiData.missingKeywords : [],
            suggestions: Array.isArray(aiData.suggestions) ? aiData.suggestions : []
        });

        // 8. Persist document payload inside MongoDB
        await analysisLog.save();

        // 9. Return response directly to front-end handler
        return res.status(200).json(analysisLog);

    } catch (globalError) {
        console.error('Critical Analysis Failure:', globalError);
        return res.status(500).json({ error: 'Internal Server Error encountered during core processing pipelines.' });
    }
};

/**
 * @desc    Fetch historical scan analytics sessions
 * @route   GET /api/resume/history
 */
exports.getHistory = async (req, res) => {
    try {
        const history = await Analysis.find().sort({ createdAt: -1 });
        return res.status(200).json(history);
    } catch (error) {
        console.error('History Query Exception:', error);
        return res.status(500).json({ error: 'Failed to retrieve analysis logs directory.' });
    }
};

/**
 * @desc    Remove historical analysis metrics node
 * @route   DELETE /api/resume/:id
 */
exports.deleteAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        const targetRecord = await Analysis.findByIdAndDelete(id);

        if (!targetRecord) {
            return res.status(404).json({ error: 'The specified analysis history record could not be found.' });
        }

        return res.status(200).json({ message: 'Analysis record wiped successfully.' });
    } catch (error) {
        console.error('Delete Route Exception:', error);
        return res.status(500).json({ error: 'Failed to process document purge event command.' });
    }
};