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

const THREAT_EXAMPLES = [
    { id: '1', name: 'Trojan.Win32.Generic', type: 'Trojan', severity: 'High', status: 'Blocked', path: 'C:/Users/Downloads/patch.exe' },
    { id: '2', name: 'Adware.Browser.Helper', type: 'Adware', severity: 'Low', status: 'Quarantined', path: 'AppData/Local/Temp/gh_installer.msi' },
    { id: '3', name: 'Ransom.Encrypter.X', type: 'Ransomware', severity: 'Critical', status: 'Infected', path: 'D:/Work/Backup/old_files.zip' },
    { id: '4', name: 'Spyware.KeyLogger.Pro', type: 'Spyware', severity: 'High', status: 'Blocked', path: 'System32/drivers/keyboard_drv.sys' },
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
            interval = setInterval(() => {
                setScanProgress(prev => {
                    const next = prev + Math.random() * 5;
                    if (next >= 100) {
                        setIsScanning(false);
                        setScanStatus('complete');
                        return 100;
                    }
                    return next;
                });
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isScanning, scanProgress]);

    const startScan = () => {
        setScanProgress(0);
        setIsScanning(true);
        setScanStatus('scanning');
        setAiAnalysis(null);
        setSelectedThreat(null);
    };

    const analyzeThreat = async (threat: typeof THREAT_EXAMPLES[0]) => {
        setSelectedThreat(threat);
        setIsAnalyzing(true);
        try {
            const ai = getGemini();
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Explain this antivirus threat: ${threat.name}. Type: ${threat.type}. Severity: ${threat.severity}. Path: ${threat.path}. Give a brief explanation and 3 steps to mitigate or prevent similar issues. Response format: Simple markdown with headers.`,
            });
            setAiAnalysis(response.text || "No analysis available.");
        } catch (error) {
            setAiAnalysis("Error analyzing threat. Please check your AI connection.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020408] text-slate-200 font-sans relative overflow-hidden flex flex-col">
            {/* Background Atmospheric Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
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
                    <a href="#" className="text-white border-b border-blue-500 pb-1">Dashboard</a>
                    <a href="#" className="hover:text-white transition-colors">Protection</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Utilities</a>
                </div>

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

            <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 md:px-10 py-12">
                <div className="max-w-7xl w-full space-y-12">
                    
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <div className="inline-block px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-2 animate-pulse">
                            Heuristic AI Engine Active
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
                            className="relative group w-48 h-48 md:w-56 md:h-56 rounded-full bg-slate-900 border border-white/10 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.15)] hover:shadow-[0_0_80px_rgba(37,99,235,0.25)] transition-all z-20"
                        >
                            <div className="absolute inset-1 rounded-full bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                            {isScanning ? (
                                <div className="space-y-4 flex flex-col items-center">
                                    <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
                                    <span className="text-xl font-bold tracking-widest text-white">{Math.round(scanProgress)}%</span>
                                </div>
                            ) : (
                                <>
                                    <Search className="w-12 h-12 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-bold tracking-widest text-white">SCAN NOW</span>
                                    <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Quantum Core</span>
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-12">
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

                    {/* AI Insight Overlay */}
                    {selectedThreat && (
                        <AnimatePresence>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="fixed inset-x-6 bottom-20 md:bottom-24 md:inset-x-auto md:right-10 md:w-96 z-50 pointer-events-auto"
                            >
                                <Card className="bg-slate-900 border border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.2)] rounded-2xl overflow-hidden">
                                    <div className="bg-blue-600/20 border-b border-blue-500/20 p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Search className="w-4 h-4 text-blue-400" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 italic">AI Threat Forensics</span>
                                        </div>
                                        <button onClick={() => setSelectedThreat(null)} className="text-slate-500 hover:text-white transition-colors">
                                            <Zap className="w-4 h-4 rotate-180" />
                                        </button>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="mb-4">
                                            <div className="text-[9px] text-slate-500 uppercase font-black mb-1">Target Endpoint</div>
                                            <div className="text-[10px] font-mono text-slate-300 break-all bg-black/30 p-2 border border-white/5">{selectedThreat.path}</div>
                                        </div>
                                        
                                        {isAnalyzing ? (
                                            <div className="py-12 flex flex-col items-center gap-4 text-center">
                                                <div className="relative">
                                                    <motion.div 
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                        className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full"
                                                    />
                                                    <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                                                </div>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-500 italic animate-pulse">Running Neural Pattern Recognition...</p>
                                            </div>
                                        ) : (
                                            <ScrollArea className="h-48">
                                                <div className="prose prose-invert prose-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
                                                    {aiAnalysis}
                                                </div>
                                            </ScrollArea>
                                        )}
                                        
                                        <div className="mt-6 pt-4 border-t border-white/5">
                                            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 tracking-widest text-xs rounded-lg uppercase shadow-lg shadow-blue-900/40">
                                                Quarantine Signature
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
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
