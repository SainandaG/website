import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { agentService } from '../../services/agentService';

const VoiceControl = ({ onActionTriggered }) => {
    const [status, setStatus] = useState('idle'); // idle, listening, processing, success, error
    const [message, setMessage] = useState('');
    const [lastIntent, setLastIntent] = useState(null);

    const handleVoiceResult = async (text) => {
        if (!text) return;

        setStatus('processing');
        setMessage(`Intent: "${text}"`);

        try {
            // T0: Process intent
            const intentResult = await agentService.processIntent(text);

            if (intentResult.success) {
                setLastIntent(intentResult);
                setMessage(`Recognized: ${intentResult.intent}`);

                // T1: Execute action
                const executionResult = await agentService.executeAction(
                    intentResult.command_id,
                    intentResult.action,
                    intentResult.parameters
                );

                if (executionResult.success) {
                    setStatus('success');
                    setMessage(`Executed: ${intentResult.intent}`);

                    // Trigger the actual UI/Graph action (passed from parent)
                    if (onActionTriggered) {
                        onActionTriggered(executionResult);
                    }

                    // Reset after delay
                    setTimeout(() => {
                        setStatus('idle');
                        setMessage('');
                    }, 3000);
                } else {
                    throw new Error(executionResult.error || 'Execution failed');
                }
            } else {
                throw new Error(intentResult.error || 'Could not understand intent');
            }
        } catch (error) {
            console.error('Voice Control Error:', error);
            setStatus('error');
            setMessage(error.message);

            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 5000);
        }
    };

    const { isListening, transcript, error: speechError, startListening, stopListening } =
        useVoiceRecognition(handleVoiceResult);

    useEffect(() => {
        if (isListening) setStatus('listening');
        else if (status === 'listening') setStatus('idle');
    }, [isListening]);

    useEffect(() => {
        if (speechError) {
            setStatus('error');
            setMessage(`Speech Error: ${speechError}`);
        }
    }, [speechError]);

    const toggleListening = () => {
        if (isListening) stopListening();
        else startListening();
    };

    // Manual Test Listener
    useEffect(() => {
        const handleTest = async () => {
            const testPhrases = [
                "highlight products",
                "show anomalies",
                "start data flow",
                "zoom into cluster 1",
                "reset view",
                "start evolution playback"
            ];
            const randomPhrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];
            console.log(`[VoiceControl] Running test command: ${randomPhrase}`);
            handleVoiceResult(randomPhrase);
        };

        window.addEventListener('agent-test-command', handleTest);
        return () => window.removeEventListener('agent-test-command', handleTest);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
            {/* Feedback Message Overlay */}
            {(message || transcript) && (
                <div className={`px-4 py-2 rounded-lg shadow-lg border backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${status === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-100' :
                    status === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' :
                        'bg-slate-800/80 border-slate-700 text-slate-100'
                    }`}>
                    {status === 'listening' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    {status === 'processing' && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                    {status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}

                    <span className="text-sm font-medium">
                        {status === 'listening' ? (transcript || 'Listening...') : message}
                    </span>

                    <button
                        onClick={() => { setMessage(''); setStatus('idle'); }}
                        className="hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            {/* Main Mic Button */}
            <button
                onClick={toggleListening}
                disabled={status === 'processing'}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90 ${isListening
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : status === 'processing'
                        ? 'bg-blue-600/50 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-110'
                    }`}
            >
                {status === 'processing' ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : isListening ? (
                    <MicOff className="w-6 h-6 text-white" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}

                {/* Status Indicator Ring */}
                {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                )}
            </button>
        </div>
    );
};

export default VoiceControl;
