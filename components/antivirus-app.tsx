'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldCheck, ShieldAlert, Zap, Activity, Globe, Database, Network, Search, AlertTriangle, CheckCircle2, Terminal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGemini } from '@/lib/gemini';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, X } from 'lucide-react';

const THREAT_EXAMPLES = [
    { id: '1', name: 'Trojan.Win32.Generic', type: 'Trojan', severity: 'High', status: 'Blocked', path: 'C:/Users/Downloads/patch.exe', detectedAt: '2026-05-12 04:12:01', recommendations: ['Terminate process immediately', 'Perform full system backup', 'Enable real-time kernel protection'] },
    { id: '2', name: 'Adware.Browser.Helper', type: 'Adware', severity: 'Low', status: 'Quarantined', path: 'AppData/Local/Temp/gh_installer.msi', detectedAt: '2026-05-11 22:45:12', recommendations: ['Clear browser cache', 'Reset browser settings', 'Scan for secondary extensions'] },
    { id: '3', name: 'Ransom.Encrypter.X', type: 'Ransomware', severity: 'Critical', status: 'Infected', path: 'D:/Work/Backup/old_files.zip', detectedAt: '2026-05-12 05:30:45', recommendations: ['Disconnect from network', 'Boot into safe mode', 'Notify local system administrator'] },
    { id: '4', name: 'Spyware.KeyLogger.Pro', type: 'Spyware', severity: 'High', status: 'Blocked', path: 'System32/drivers/keyboard_drv.sys', detectedAt: '2026-05-10 14:20:00', recommendations: ['Update keyboard drivers', 'Run deep rootkit scan', 'Change sensitive passwords'] },
];

export default function AntivirusApp() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
    const [detectedThreats, setDetectedThreats] = useState(THREAT_EXAMPLES);
    const [securityScore, setSecurityScore] = useState(85);
    const [selectedThreat, setSelectedThreat] = useState<typeof THREAT_EXAMPLES[0] | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dailyTip, setDailyTip] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'dashboard' | 'quarantine' | 'history' | 'settings'>('dashboard');
    const [isBoostActive, setIsBoostActive] = useState(false);
    const [isThreatModalOpen, setIsThreatModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [boostTimer, setBoostTimer] = useState(0);
    const [scanHistory, setScanHistory] = useState([
        { id: 'h1', date: '2026-05-11', time: '14:30:22', status: 'Clean', threatsFound: 0 },
        { id: 'h2', date: '2026-05-10', time: '09:12:45', status: 'Threats Detected', threatsFound: 2 },
        { id: 'h3', date: '2026-05-09', time: '21:05:10', status: 'Clean', threatsFound: 0 },
        { id: 'h4', date: '2026-05-08', time: '11:45:30', status: 'Threats Detected', threatsFound: 5 },
        { id: 'h5', date: '2026-05-07', time: '16:20:15', status: 'Clean', threatsFound: 0 },
        { id: 'h6', date: '2026-05-06', time: '08:30:00', status: 'Threats Detected', threatsFound: 1 },
        { id: 'h7', date: '2026-05-05', time: '13:10:45', status: 'Clean', threatsFound: 0 },
    ]);
    const [scanSettings, setScanSettings] = useState({
        scanDepth: 'Deep',
        sensitivity: 'High',
        autoQuarantine: false,
        schedule: 'None',
        realTimeProtection: true
    });
    const [notification, setNotification] = useState<{ id: string, message: string, type: 'threat' | 'info' } | null>(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Real-time protection simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (scanSettings.realTimeProtection) {
            interval = setInterval(() => {
                // Low probability of finding a threat in real-time (random simulation)
                if (Math.random() < 0.05) {
                    const newThreat = {
                        id: Math.random().toString(36).substring(2, 9),
                        name: 'Suspicious.Pattern.' + Math.random().toString(36).substring(2, 5).toUpperCase(),
                        type: ['Trojan', 'Adware', 'Spyware'][Math.floor(Math.random() * 3)],
                        severity: 'High',
                        status: scanSettings.autoQuarantine ? 'Quarantined' : 'Blocked',
                        path: 'RealTime/Monitor/' + Math.random().toString(36).substring(2, 10).toUpperCase() + '.tmp',
                        detectedAt: new Date().toISOString().replace('T', ' ').split('.')[0],
                        recommendations: ['Check parent process', 'Review network activity', 'Run full system scan']
                    };
                    
                    setDetectedThreats(prev => [newThreat, ...prev]);
                    setNotification({
                        id: newThreat.id,
                        message: `Real-time Threat Detected: ${newThreat.name}`,
                        type: 'threat'
                    });
                    
                    // Also log to history
                    setScanHistory(prev => [
                        {
                            id: 'rt-' + Math.random().toString(36).substring(2, 7),
                            date: new Date().toISOString().split('T')[0],
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
                            status: 'Real-time Threat Neutralized',
                            threatsFound: 1
                        },
                        ...prev
                    ]);
                }
            }, 15000); // Check every 15 seconds
        }
        return () => clearInterval(interval);
    }, [scanSettings.realTimeProtection, scanSettings.autoQuarantine]);

    const toggleBoost = () => {
        if (!isBoostActive) {
            setIsBoostActive(true);
            setBoostTimer(300); // 5 minutes
        } else {
            setIsBoostActive(false);
            setBoostTimer(0);
        }
    };

    // Boost timer countdown
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isBoostActive && boostTimer > 0) {
            timer = setInterval(() => {
                setBoostTimer(prev => {
                    if (prev <= 1) {
                        setIsBoostActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isBoostActive, boostTimer]);

    const handleQuarantine = (id: string) => {
        setDetectedThreats(prev => prev.map(t => t.id === id ? { ...t, status: 'Quarantined' } : t));
        if (selectedThreat && selectedThreat.id === id) {
            setSelectedThreat(prev => prev ? { ...prev, status: 'Quarantined' } : null);
        }
    };

    const handlePurge = (id: string) => {
        setDetectedThreats(prev => prev.filter(t => t.id !== id));
        setSelectedThreat(null);
        setSecurityScore(prev => Math.min(100, prev + 2));
    };

    useEffect(() => {
        const fetchTip = async () => {
            try {
                const ai = getGemini();
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: "Give a short, professional, 1-sentence cybersecurity tip for today. Focus on current digital safety trends.",
                });
                setDailyTip(response.text || null);
            } catch (e) {
                setDailyTip("Always use multi-factor authentication where available.");
            }
        };
        fetchTip();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isScanning && scanProgress < 100) {
            const speed = isBoostActive ? 50 : 200;
            const incrementBase = isBoostActive ? 12 : 5;
            interval = setInterval(() => {
                setScanProgress(prev => {
                    const next = prev + Math.random() * incrementBase;
                    if (next >= 100) {
                        setIsScanning(false);
                        setScanStatus('complete');
                        
                        // Log to history
                        setScanHistory(prev => [
                            {
                                id: Math.random().toString(36).substring(2, 9),
                                date: new Date().toISOString().split('T')[0],
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
                                status: detectedThreats.length > 0 ? 'Threats Detected' : 'Clean',
                                threatsFound: detectedThreats.length
                            },
                            ...prev
                        ]);

                        return 100;
                    }
                    return next;
                });
            }, speed);
        }
        return () => clearInterval(interval);
    }, [isScanning, scanProgress, isBoostActive, detectedThreats.length]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startScan = () => {
        setScanProgress(0);
        setIsScanning(true);
        setScanStatus('scanning');
        setAiAnalysis(null);
        setSelectedThreat(null);
    };

    const analyzeThreat = async (threat: typeof THREAT_EXAMPLES[0]) => {
        setSelectedThreat(threat);
        setIsThreatModalOpen(true);
        setIsAnalyzing(true);
        
        // Capture basic system info if available
        let systemConfigStr = "No specific system configuration available (analysis based on general threat intelligence).";
        
        if (typeof window !== 'undefined') {
            const os = navigator.userAgent;
            const cores = navigator.hardwareConcurrency;
            const memory = (navigator as any).deviceMemory;
            
            if (os) {
                systemConfigStr = `System OS: ${os} | Hardware Cores: ${cores || 'Unknown'} | Memory Class: ${memory ? memory + 'GB' : 'Unknown'}`;
            }
        }

        try {
            const ai = getGemini();
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Explain this antivirus threat: ${threat.name}. 
Type: ${threat.type}. 
Severity: ${threat.severity}. 
Path: ${threat.path}.

USER SYSTEM CONTEXT: ${systemConfigStr}

Instructions:
1. Provide a brief technical explanation of the threat.
2. Provide 3 specific steps to mitigate or prevent similar issues, tailored to the user's system context if it was provided (e.g. OS specific paths or tools).
3. If the "User System Context" indicates no configuration was available, explicitly state at the beginning of your response: "This analysis is based on general threat intelligence."

Response format: Simple markdown with headers.`,
            });
            setAiAnalysis(response.text || "No analysis available.");
        } catch (error) {
            setAiAnalysis("Error analyzing threat. Please check your AI connection.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const threatCategories = ['Trojan', 'Adware', 'Ransomware', 'Spyware'];
    const threatCounts = threatCategories.reduce((acc, cat) => {
        acc[cat] = detectedThreats.filter(t => t.type === cat).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="min-h-screen bg-[#020408] text-slate-200 font-sans relative overflow-hidden flex flex-col">
            {/* Real-time Notification Overlay */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
                    >
                        <div className={`p-4 rounded-xl border ${notification.type === 'threat' ? 'bg-red-950/90 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-blue-950/90 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]'} backdrop-blur-xl flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                {notification.type === 'threat' ? (
                                    <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                                ) : (
                                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                                )}
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Alert</div>
                                    <div className="text-sm font-bold text-white">{notification.message}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setNotification(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Zap className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Atmospheric Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Threat Detail Modal */}
            <AnimatePresence>
                {isThreatModalOpen && selectedThreat && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsThreatModalOpen(false)}
                            className="absolute inset-0 bg-[#020408]/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.3)] rounded-none overflow-hidden"
                        >
                            <div className="bg-blue-600/20 border-b border-blue-500/20 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded">
                                        <ShieldAlert className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">{selectedThreat.name}</h2>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Diagnostic Forensic Report</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsThreatModalOpen(false)}
                                    className="p-2 text-slate-500 hover:text-white transition-colors border border-white/5 hover:border-white/20"
                                >
                                    <Zap className="w-5 h-5" />
                                </button>
                            </div>

                            <ScrollArea className="h-[70vh]">
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 uppercase font-black">Classification</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-blue-400 border-blue-500/30 font-mono text-[10px]">{selectedThreat.type}</Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 uppercase font-black">Threat Severity</span>
                                            <div className={`text-xs font-bold uppercase ${selectedThreat.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'}`}>
                                                {selectedThreat.severity} Level
                                            </div>
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <span className="text-[9px] text-slate-500 uppercase font-black">Memory Address / Path</span>
                                            <div className="p-3 bg-black/40 border border-white/5 rounded font-mono text-[11px] text-blue-300 break-all">
                                                {selectedThreat.path}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 uppercase font-black">Detection Vector</span>
                                            <div className="text-[11px] text-slate-300">Heuristic AI Engine v9.42</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-slate-500 uppercase font-black">Detected At</span>
                                            <div className="text-[11px] text-emerald-400 font-mono">{selectedThreat.detectedAt}</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-500/5 border-l-4 border-blue-500 space-y-3">
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <Terminal className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Neural Signature Insights</span>
                                        </div>
                                        {isAnalyzing ? (
                                            <div className="py-4 space-y-2 opacity-50 flex flex-col items-center">
                                                <Activity className="w-8 h-8 text-blue-500 animate-spin" />
                                                <span className="text-[10px] uppercase font-bold tracking-tighter">De-coding binary patterns...</span>
                                            </div>
                                        ) : (
                                            <div className="text-xs leading-relaxed text-slate-400 italic">
                                                {aiAnalysis || "Pending deep packet analysis..."}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Strategic Remediation Steps</span>
                                        <div className="grid grid-cols-1 gap-3">
                                            {selectedThreat.recommendations.map((rec, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors">
                                                    <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-[11px] text-slate-200">{rec}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                        <Button 
                                            size="lg" 
                                            variant="outline"
                                            onClick={() => handleQuarantine(selectedThreat.id)}
                                            disabled={selectedThreat.status === 'Quarantined'}
                                            className="flex-1 border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600/20"
                                        >
                                            {selectedThreat.status === 'Quarantined' ? 'Safely Quarantined' : 'Initiate Isolation'}
                                        </Button>
                                        <Button 
                                            size="lg" 
                                            onClick={() => handlePurge(selectedThreat.id)}
                                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                        >
                                            Atomic Purge (Irreversible)
                                        </Button>
                                    </div>
                                </CardContent>
                            </ScrollArea>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.05] rounded-full pointer-events-none"></div>

            {/* Top Navigation Bar */}
            <nav className="h-20 px-6 md:px-10 flex items-center justify-between border-b border-white/5 backdrop-blur-md z-10 sticky top-0 bg-[#020408]/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase italic">
                        SENTINEL<span className="text-blue-500 underline decoration-2 underline-offset-4 not-italic">CORE</span>
                    </span>
                </div>
                
                <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <button 
                        onClick={() => setActiveView('dashboard')}
                        className={`transition-colors ${activeView === 'dashboard' ? 'text-white border-b border-blue-500 pb-1' : 'hover:text-white'}`}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveView('quarantine')}
                        className={`transition-colors ${activeView === 'quarantine' ? 'text-white border-b border-blue-500 pb-1' : 'hover:text-white'}`}
                    >
                        Quarantine ({detectedThreats.filter(t => t.status === 'Quarantined').length})
                    </button>
                    <button 
                        onClick={() => setActiveView('history')}
                        className={`transition-colors ${activeView === 'history' ? 'text-white border-b border-blue-500 pb-1' : 'hover:text-white'}`}
                    >
                        History
                    </button>
                    <button 
                        onClick={() => setActiveView('settings')}
                        className={`transition-colors ${activeView === 'settings' ? 'text-white border-b border-blue-500 pb-1' : 'hover:text-white'}`}
                    >
                        Settings
                    </button>
                    
                    {/* Scan Boost Toggle */}
                    <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] text-slate-500 tracking-tighter">AI ENGINE SPEED</span>
                            <span className={`text-[9px] font-black ${isBoostActive ? 'text-blue-400 animate-pulse' : 'text-slate-600'}`}>
                                {isBoostActive ? 'HYPER-SCAN ACTIVE' : 'STANDARD MODE'}
                            </span>
                        </div>
                        <button 
                            onClick={toggleBoost}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center p-1 ${isBoostActive ? 'bg-blue-600 shadow-[0_0_15px_#2563eb]' : 'bg-slate-800'}`}
                        >
                            <motion.div 
                                animate={{ x: isBoostActive ? 24 : 0 }}
                                className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                                <Zap className={`w-2 h-2 ${isBoostActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            </motion.div>
                        </button>
                        {isBoostActive && (
                            <div className="bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded flex items-center gap-2 font-mono text-blue-400 text-[10px]">
                                <Activity className="w-3 h-3 animate-spin duration-1000" />
                                {formatTime(boostTimer)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            className="fixed inset-0 top-20 bg-[#020408]/95 backdrop-blur-xl z-[100] p-10 flex flex-col gap-8 md:hidden"
                        >
                            {[
                                { view: 'dashboard', label: 'Dashboard' },
                                { view: 'quarantine', label: `Quarantine (${detectedThreats.filter(t => t.status === 'Quarantined').length})` },
                                { view: 'history', label: 'Scan History' },
                                { view: 'settings', label: 'Engine Settings' },
                            ].map((item) => (
                                <button 
                                    key={item.view}
                                    onClick={() => {
                                        setActiveView(item.view as any);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`text-2xl font-black uppercase tracking-widest text-left transition-all ${activeView === item.view ? 'text-blue-500 translate-x-4' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            
                            <div className="mt-auto border-t border-white/10 pt-8 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-black">AI Scan Boost</div>
                                    <div className={`text-sm font-bold ${isBoostActive ? 'text-blue-400' : 'text-slate-600'}`}>
                                        {isBoostActive ? 'MAX PERFORMANCE' : 'LOCKED'}
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleBoost}
                                    className={`relative w-16 h-8 rounded-full transition-colors duration-300 flex items-center p-1.5 ${isBoostActive ? 'bg-blue-600 shadow-[0_0_20px_#2563eb]' : 'bg-slate-800'}`}
                                >
                                    <motion.div 
                                        animate={{ x: isBoostActive ? 32 : 0 }}
                                        className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <Zap className={`w-3 h-3 ${isBoostActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                    </motion.div>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                    <div className="text-right mr-2 hidden sm:block">
                        <p className="text-[10px] text-slate-500 leading-none mb-1 font-bold uppercase opacity-60">License Status</p>
                        <p className="text-xs font-mono text-emerald-400 font-bold">342 DAYS LEFT</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group">
                        <User className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </div>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-start relative z-10 px-6 md:px-10 py-12">
                <div className="max-w-7xl w-full">
                    {activeView === 'dashboard' ? (
                        <div className="space-y-12 w-full">
                            {/* Hero Section */}
                            <div className="text-center space-y-6">
                                <div className="flex justify-center gap-3 mb-2">
                                    <div className={`px-4 py-1 rounded-full border ${scanSettings.realTimeProtection ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'} text-[10px] font-bold tracking-widest uppercase animate-pulse`}>
                                        {scanSettings.realTimeProtection ? 'Real-time Protection Active' : 'Real-time Protection Disabled'}
                                    </div>
                                    <div className="px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                                        Heuristic AI Engine
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-7xl font-light text-white mb-2 tracking-tight">
                                    System is <span className="font-bold underline decoration-blue-500/50">Secure</span>
                                </h1>
                                <p className="text-slate-400 max-w-lg mx-auto">
                                    Last scan completed {scanStatus === 'complete' ? 'seconds' : '2 hours'} ago. {scanStatus === 'complete' ? '4 items identified for review.' : 'No critical threats detected.'}
                                </p>
                            </div>

                            {/* Central Scan Interaction */}
                            <div className="relative flex items-center justify-center py-12">
                                {/* Rings */}
                                <div className="absolute w-[360px] h-[360px] md:w-[460px] md:h-[460px] rounded-full border border-white/5 flex items-center justify-center">
                                    <motion.div 
                                        className="absolute top-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                        style={{ transformOrigin: "center 180px" }}
                                    />
                                </div>
                                <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-white/10" />
                                
                                {/* Interactive Main Button */}
                                <motion.button 
                                    onClick={startScan}
                                    disabled={isScanning}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative group w-48 h-48 md:w-56 md:h-56 rounded-full bg-slate-900 border ${isBoostActive ? 'border-blue-500 shadow-[0_0_80px_rgba(37,99,235,0.4)]' : 'border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.15)]'} flex flex-col items-center justify-center hover:shadow-[0_0_80px_rgba(37,99,235,0.25)] transition-all z-20`}
                                >
                                    <div className="absolute inset-1 rounded-full bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                                    {isScanning ? (
                                        <div className="space-y-4 flex flex-col items-center">
                                            <Activity className={`w-12 h-12 ${isBoostActive ? 'text-blue-400' : 'text-blue-500'} animate-pulse`} />
                                            <span className="text-xl font-bold tracking-widest text-white">{Math.round(scanProgress)}%</span>
                                        </div>
                                    ) : (
                                        <>
                                            {isBoostActive ? (
                                                <Zap className="w-12 h-12 text-blue-400 mb-2 animate-pulse" />
                                            ) : (
                                                <Search className="w-12 h-12 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                            )}
                                            <span className="text-sm font-bold tracking-widest text-white">{isBoostActive ? 'HYPER-SCAN' : 'SCAN NOW'}</span>
                                            <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">{isBoostActive ? 'AI Boost Protocol' : 'Quantum Core'}</span>
                                        </>
                                    )}
                                </motion.button>
                                
                                {/* Progress Bar overlay for scanning */}
                                {isScanning && (
                                    <div className="absolute bottom-[-40px] w-64 text-center space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                                            <span>Scanning Threads...</span>
                                            <span>{Math.round(scanProgress)}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-blue-500" 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${scanProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Threat Category Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                {threatCategories.map((cat, i) => (
                                    <motion.div
                                        key={cat}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center space-y-2 group hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${threatCounts[cat] > 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">{cat}</span>
                                        </div>
                                        <div className="text-2xl font-mono font-black text-white">
                                            {threatCounts[cat]}
                                        </div>
                                        <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${threatCounts[cat] > 0 ? (cat === 'Ransomware' ? 'bg-red-500' : 'bg-orange-500') : 'bg-slate-700'}`} 
                                                style={{ width: `${Math.min(100, (threatCounts[cat] / (detectedThreats.length || 1)) * 100)}%` }} 
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mt-16">
                                {[
                                    { label: 'Web Shield', val: '1.4k Blocked', icon: Globe, color: 'text-blue-400', progress: 75 },
                                    { label: 'Firewall', val: 'Encrypted Port 443', icon: Network, color: 'text-emerald-400', sub: 'Active Connection' },
                                    { label: 'Data Vault', val: '2.4 GB Secured', icon: Database, color: 'text-orange-400', dots: 3 },
                                    { label: 'Performance', val: '98% Index', icon: Activity, color: 'text-purple-400', sub: 'Optimal State' },
                                ].map((stat, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/10 transition-all cursor-default"
                                    >
                                        <div className={`${stat.color} mb-3`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">{stat.label}</h3>
                                        <p className="text-xs text-slate-400 font-medium mb-4">{stat.val}</p>
                                        
                                        {stat.progress && (
                                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${stat.progress}%` }}></div>
                                            </div>
                                        )}
                                        {stat.sub && (
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${stat.color} opacity-80 italic`}>{stat.sub}</p>
                                        )}
                                        {stat.dots && (
                                            <div className="flex gap-1">
                                                {[...Array(stat.dots)].map((_, j) => (
                                                    <div key={j} className="w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_5px_rgba(251,146,60,0.5)]"></div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Secondary Data Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 items-start">
                                {/* Threat Log Table */}
                                <div className="lg:col-span-12">
                                    <Card className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-none overflow-hidden">
                                        <CardHeader className="border-b border-white/5 bg-white/5">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Live Threat Intelligence</CardTitle>
                                                    <CardDescription className="text-[10px] text-slate-500 uppercase mt-1">Real-time heuristics analysis and classification</CardDescription>
                                                </div>
                                                <Badge variant="outline" className="text-red-400 border-red-500/20 bg-red-400/5 px-3 py-1 font-mono">{detectedThreats.length} ACTIVE ITEMS</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ScrollArea className="h-[240px]">
                                                <table className="w-full text-left text-[11px] border-collapse">
                                                    <thead className="sticky top-0 bg-[#020408] text-slate-500 uppercase font-black border-b border-white/5">
                                                        <tr>
                                                            <th className="p-4 tracking-tighter">Diagnostic Entity</th>
                                                            <th className="p-4 tracking-tighter">Classification</th>
                                                            <th className="p-4 tracking-tighter">Severity Index</th>
                                                            <th className="p-4 tracking-tighter text-right">Operation</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {detectedThreats.map((threat) => (
                                                            <tr 
                                                                key={threat.id} 
                                                                onClick={() => analyzeThreat(threat)}
                                                                className={`group cursor-pointer hover:bg-white/5 transition-colors ${selectedThreat?.id === threat.id ? 'bg-white/10' : ''}`}
                                                            >
                                                                <td className="p-4 font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{threat.name}</td>
                                                                <td className="p-4 text-slate-400 font-mono italic">{threat.type}</td>
                                                                <td className="p-4">
                                                                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                        threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                                                        threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                                                                        'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                                                                    }`}>
                                                                        <div className={`w-1 h-1 rounded-full ${
                                                                            threat.severity === 'Critical' ? 'bg-red-400' : 
                                                                            threat.severity === 'High' ? 'bg-orange-400' : 'bg-slate-400'
                                                                        }`} />
                                                                        {threat.severity}
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <span className="text-blue-500 font-bold group-hover:underline decoration-2 underline-offset-4 tracking-widest text-[10px] uppercase">Perform Deep Analysis</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ) : activeView === 'quarantine' ? (
                        <div className="space-y-8 w-full">
                            {/* Quarantine View */}
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">
                                        Secure Isolation Chamber
                                    </div>
                                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase italic">Quarantined <span className="text-blue-500 not-italic underline underline-offset-4 decoration-2">Nodes</span></h1>
                                    <p className="text-slate-400 text-sm max-w-md">The following entities are encrypted and isolated within the SENTINEL sandbox. They cannot interact with the host system.</p>
                                </div>
                                <Button 
                                    onClick={() => setActiveView('dashboard')}
                                    variant="outline" 
                                    className="border-white/10 text-white hover:bg-white/5 uppercase text-xs font-bold tracking-widest"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {detectedThreats.filter(t => t.status === 'Quarantined').length > 0 ? (
                                    detectedThreats.filter(t => t.status === 'Quarantined').map((threat) => (
                                        <Card 
                                            key={threat.id} 
                                            onClick={() => analyzeThreat(threat)}
                                            className="bg-white/5 border-blue-500/30 rounded-none overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
                                        >
                                            <CardHeader className="bg-blue-600/10 border-b border-blue-500/20 p-4">
                                                <CardTitle className="text-sm font-bold text-white uppercase flex items-center justify-between">
                                                    {threat.name}
                                                    <ShieldAlert className="w-4 h-4 text-blue-400" />
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-4">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] text-slate-500 uppercase font-black">Original Source</span>
                                                    <div className="text-[10px] font-mono text-slate-300 break-all bg-black/30 p-2 rounded">
                                                        {threat.path}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-slate-500 uppercase font-black">Isolated Since</span>
                                                    <span className="text-emerald-400 font-mono">{threat.detectedAt}</span>
                                                </div>
                                                <Separator className="bg-white/5" />
                                                <div className="space-y-2">
                                                    <span className="text-[9px] text-slate-500 uppercase font-black">Mitigation Advisory</span>
                                                    <div className="space-y-1">
                                                        {threat.recommendations.map((rec, idx) => (
                                                            <div key={idx} className="text-[10px] text-slate-400 flex items-start gap-2">
                                                                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                                                {rec}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="pt-4 flex gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest h-8"
                                                        onClick={() => {
                                                            setDetectedThreats(prev => prev.map(t => t.id === threat.id ? { ...t, status: 'Blocked' } : t));
                                                        }}
                                                    >
                                                        Restore (Securely)
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-widest h-8"
                                                        onClick={() => handlePurge(threat.id)}
                                                    >
                                                        Erase Entity
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-white/5">
                                        <div className="p-6 bg-white/5 rounded-full">
                                            <ShieldCheck className="w-12 h-12 text-slate-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-500 uppercase tracking-widest">Vault Empty</h3>
                                            <p className="text-xs text-slate-600 max-w-[240px] mt-1 italic">No entities are currently held in the isolation chamber.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeView === 'history' ? (
                        <div className="space-y-8 w-full">
                            {/* History View */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div className="space-y-2">
                                    <div className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">
                                        SENTINEL LOGS
                                    </div>
                                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase italic font-mono selection:bg-blue-500">Scan <span className="text-blue-500 not-italic underline underline-offset-4 decoration-2">History</span></h1>
                                    <p className="text-slate-400 text-sm max-w-md">Comprehensive audit trail of system scans and diagnostic operations performed by the Sentinel Core engine.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button 
                                        onClick={() => setScanHistory([])}
                                        variant="outline" 
                                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 uppercase text-xs font-bold tracking-widest"
                                    >
                                        Clear History
                                    </Button>
                                    <Button 
                                        onClick={() => setActiveView('dashboard')}
                                        variant="outline" 
                                        className="border-white/10 text-white hover:bg-white/5 uppercase text-xs font-bold tracking-widest"
                                    >
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Statistics Summary */}
                                <div className="lg:col-span-1 space-y-6">
                                    <Card className="bg-white/5 border border-white/5 rounded-none p-6">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-600/20 rounded border border-blue-500/30">
                                                    <Activity className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-slate-500 uppercase font-black">Total Scans Executed</div>
                                                    <div className="text-2xl font-mono font-bold text-white tracking-tighter">{scanHistory.length} Cycles</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-red-600/20 rounded border border-red-500/30">
                                                    <ShieldAlert className="w-6 h-6 text-red-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-slate-500 uppercase font-black">Cumulative Threats Blocked</div>
                                                    <div className="text-2xl font-mono font-bold text-red-400 tracking-tighter">
                                                        {scanHistory.reduce((acc, log) => acc + log.threatsFound, 0)} Items
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Engine Reliability</span>
                                                    <span className="text-xs font-mono text-emerald-400">99.99%</span>
                                                </div>
                                                <Progress value={99} className="h-1 bg-white/5" />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="bg-white/5 border border-white/5 rounded-none p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Terminal className="w-4 h-4 text-blue-400" />
                                                <span className="text-[10px] text-slate-300 uppercase font-black tracking-widest">Global Intelligence Feed</span>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    "New Zero-Day vulnerability patched in Node.js runtime.",
                                                    "Sentinel AI blocked 4.2M attacks in last 24h.",
                                                    "Database synchronization complete (v9.42.0)."
                                                ].map((news, i) => (
                                                    <div key={i} className="text-[10px] text-slate-500 flex gap-3 leading-relaxed">
                                                        <span className="text-blue-500 font-bold shrink-0">[{new Date().getHours() + i}:00]</span>
                                                        {news}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Threat Trend Chart */}
                                <div className="lg:col-span-2">
                                    <Card className="bg-white/5 border border-white/5 rounded-none p-8 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Threat Vector Activity</CardTitle>
                                                <CardDescription className="text-[10px] text-slate-500 uppercase mt-1 italic">Heuristic trend analysis over last 7 cycles</CardDescription>
                                            </div>
                                            <Badge variant="outline" className="text-blue-400 border-blue-500/20">SENTINEL-7 ANALYTICS</Badge>
                                        </div>
                                        <div className="flex-grow min-h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={[...scanHistory].reverse()}>
                                                    <defs>
                                                        <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis 
                                                        dataKey="date" 
                                                        stroke="#475569" 
                                                        fontSize={10} 
                                                        tickLine={false} 
                                                        axisLine={false}
                                                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                                    />
                                                    <YAxis 
                                                        stroke="#475569" 
                                                        fontSize={10} 
                                                        tickLine={false} 
                                                        axisLine={false} 
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: '#020408', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0' }}
                                                        itemStyle={{ color: '#3b82f6', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                                        labelStyle={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="threatsFound" 
                                                        stroke="#3b82f6" 
                                                        strokeWidth={3}
                                                        fillOpacity={1} 
                                                        fill="url(#colorThreats)" 
                                                        animationDuration={2000}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <Card className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-none overflow-hidden">
                                <CardHeader className="border-b border-white/5 bg-white/5">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Advanced Execution Logs</CardTitle>
                                            <CardDescription className="text-[10px] text-slate-500 uppercase mt-1">Audit trail of automated and manual scan cycles</CardDescription>
                                        </div>
                                        <div className="flex gap-2 font-mono text-[10px] text-slate-500">
                                            <span className="text-blue-500 font-bold">TOTAL ENTRIES:</span> {scanHistory.length}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[400px]">
                                        <table className="w-full text-left text-[11px] border-collapse">
                                            <thead className="sticky top-0 bg-[#020408] text-slate-500 uppercase font-black border-b border-white/5 z-20">
                                                <tr>
                                                    <th className="p-4 tracking-tighter">Scan Date</th>
                                                    <th className="p-4 tracking-tighter">Timestamp</th>
                                                    <th className="p-4 tracking-tighter">Status</th>
                                                    <th className="p-4 tracking-tighter">Summary</th>
                                                    <th className="p-4 tracking-tighter text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {scanHistory.map((log) => (
                                                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                                        <td className="p-4 font-mono text-slate-300">{log.date}</td>
                                                        <td className="p-4 font-mono text-slate-400">{log.time}</td>
                                                        <td className="p-4">
                                                            <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                log.status === 'Clean' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            }`}>
                                                                {log.status === 'Clean' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                                                {log.status}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-slate-400 italic">
                                                            {log.threatsFound > 0 ? (
                                                                <span className="text-red-400/80 font-bold tracking-tight">{log.threatsFound} malignant clusters identified</span>
                                                            ) : (
                                                                <span className="text-emerald-500/60">System integrity verified - no anomalies detected</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button className="text-[10px] uppercase font-black text-blue-500 hover:scale-110 transition-transform origin-right">Diagnostic Report</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {scanHistory.length === 0 && (
                                            <div className="py-24 flex flex-col items-center justify-center text-slate-700 italic space-y-4">
                                                <Search className="w-12 h-12 opacity-20" />
                                                <div className="text-[10px] uppercase font-bold tracking-widest">No archival scan data available</div>
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="space-y-8 w-full max-w-4xl mx-auto">
                            {/* Settings View */}
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">
                                        ENGINE CONFIGURATION
                                    </div>
                                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase italic">Core <span className="text-blue-500 not-italic underline underline-offset-4 decoration-2">Settings</span></h1>
                                    <p className="text-slate-400 text-sm">Fine-tune the AI scanning parameters and heuristic engine behavior for maximum efficiency.</p>
                                </div>
                                <Button 
                                    onClick={() => setActiveView('dashboard')}
                                    variant="outline" 
                                    className="border-white/10 text-white hover:bg-white/5 uppercase text-xs font-bold tracking-widest"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-none">
                                    <CardHeader className="border-b border-white/5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Scanning Depth</CardTitle>
                                        <CardDescription className="text-[10px] text-slate-500 uppercase">Determines how deep the engine probes system files</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        {['Shallow', 'Deep', 'Full'].map((depth) => (
                                            <button 
                                                key={depth}
                                                onClick={() => setScanSettings(prev => ({ ...prev, scanDepth: depth }))}
                                                className={`w-full p-4 flex items-center justify-between border transition-all ${
                                                    scanSettings.scanDepth === depth 
                                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="text-left">
                                                    <span className="text-xs font-bold uppercase tracking-widest block">{depth} Scan</span>
                                                    <span className="text-[9px] opacity-60">
                                                        {depth === 'Shallow' && 'Quick check of active processes and core paths.'}
                                                        {depth === 'Deep' && 'Standard probing of user data and system libraries.'}
                                                        {depth === 'Full' && 'Exhaustive bit-by-bit inspection of all storage nodes.'}
                                                    </span>
                                                </div>
                                                {scanSettings.scanDepth === depth && <ShieldCheck className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-none">
                                    <CardHeader className="border-b border-white/5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Heuristic Sensitivity</CardTitle>
                                        <CardDescription className="text-[10px] text-slate-500 uppercase">Controls the AI detection threshold for anomalies</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        {['Low', 'Medium', 'High', 'Paranoid'].map((sense) => (
                                            <button 
                                                key={sense}
                                                onClick={() => setScanSettings(prev => ({ ...prev, sensitivity: sense }))}
                                                className={`w-full p-4 flex items-center justify-between border transition-all ${
                                                    scanSettings.sensitivity === sense 
                                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="text-left">
                                                    <span className="text-xs font-bold uppercase tracking-widest block">{sense} Sensitivity</span>
                                                    <span className="text-[9px] opacity-60">
                                                        {sense === 'Low' && 'Optimized for performance, minimal false positives.'}
                                                        {sense === 'Medium' && 'Balanced detection for daily security needs.'}
                                                        {sense === 'High' && 'Stringent verification of all suspicious activities.'}
                                                        {sense === 'Paranoid' && 'Zero-trust architecture. Flags any deviation.'}
                                                    </span>
                                                </div>
                                                {scanSettings.sensitivity === sense && <Activity className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-none md:col-span-2">
                                    <CardHeader className="border-b border-white/5">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Scan Scheduling</CardTitle>
                                        <CardDescription className="text-[10px] text-slate-500 uppercase">Automate system protection cycles</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            {['None', 'Daily', 'Weekly', 'Bi-Weekly'].map((freq) => (
                                                <button 
                                                    key={freq}
                                                    onClick={() => setScanSettings(prev => ({ ...prev, schedule: freq }))}
                                                    className={`p-3 flex flex-col items-center justify-center gap-2 border transition-all ${
                                                        scanSettings.schedule === freq 
                                                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                                                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <span className="text-xs font-bold uppercase tracking-widest">{freq}</span>
                                                    {scanSettings.schedule === freq && <CheckCircle2 className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                        {scanSettings.schedule !== 'None' && (
                                            <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Activity className="w-4 h-4 text-blue-400" />
                                                    <span className="text-[10px] text-slate-300 uppercase font-bold tracking-tight">Next Scheduled Scan: Today at 02:00 AM</span>
                                                </div>
                                                <Badge className="bg-blue-600 text-white text-[8px]">ACTIVE</Badge>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-none md:col-span-2">
                                    <CardContent className="p-6 flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Real-time Protection</h3>
                                                <p className="text-[10px] text-slate-500 uppercase">Continuously monitor file system and network for threats</p>
                                            </div>
                                            <button 
                                                onClick={() => setScanSettings(prev => ({ ...prev, realTimeProtection: !prev.realTimeProtection }))}
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center p-1 ${scanSettings.realTimeProtection ? 'bg-emerald-600 shadow-[0_0_15px_#10b981]' : 'bg-slate-800'}`}
                                            >
                                                <motion.div 
                                                    animate={{ x: scanSettings.realTimeProtection ? 24 : 0 }}
                                                    className="w-4 h-4 bg-white rounded-full shadow-lg"
                                                />
                                            </button>
                                        </div>
                                        
                                        <Separator className="bg-white/5" />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Automated Remediation</h3>
                                                <p className="text-[10px] text-slate-500 uppercase">Automatically quarantine critical threats without confirmation</p>
                                            </div>
                                            <button 
                                                onClick={() => setScanSettings(prev => ({ ...prev, autoQuarantine: !prev.autoQuarantine }))}
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center p-1 ${scanSettings.autoQuarantine ? 'bg-blue-600 shadow-[0_0_15px_#2563eb]' : 'bg-slate-800'}`}
                                            >
                                                <motion.div 
                                                    animate={{ x: scanSettings.autoQuarantine ? 24 : 0 }}
                                                    className="w-4 h-4 bg-white rounded-full shadow-lg"
                                                />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button 
                                    variant="ghost" 
                                    className="text-slate-500 hover:text-white uppercase text-[10px] font-bold tracking-widest"
                                    onClick={() => setScanSettings({ scanDepth: 'Deep', sensitivity: 'High', autoQuarantine: false, schedule: 'None', realTimeProtection: true })}
                                >
                                    Reset to Defaults
                                </Button>
                                <Button 
                                    className="bg-blue-600 hover:bg-blue-500 text-white uppercase text-[10px] font-bold tracking-widest px-8"
                                    onClick={() => setActiveView('dashboard')}
                                >
                                    Apply Configuration
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Live Activity Bar */}
            <footer className="h-16 md:h-12 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between bg-white/5 border-t border-white/5 text-[9px] tracking-widest uppercase z-10 sticky bottom-0 backdrop-blur-md">
                <div className="flex items-center gap-8 py-2 md:py-0">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
                        <span className="text-slate-400 font-bold">Cloud DB: Synchronized</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_5px_#60a5fa]"></div>
                        <span className="text-slate-400 font-bold">Network: 12.4 MB/s Clean</span>
                    </div>
                    {dailyTip && (
                        <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-8">
                            <Shield className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500/80 italic lowercase tracking-tight line-clamp-1 max-w-xs capitalize font-medium">Daily Tip: {dailyTip}</span>
                        </div>
                    )}
                </div>
                <div className="flex gap-6 py-2 md:py-0">
                    <span className="text-slate-500 font-medium">Engine: v9.42.0-stable</span>
                    <span className="text-white font-black">Definition ID: #AX-90214</span>
                </div>
            </footer>
        </div>
    );
}
