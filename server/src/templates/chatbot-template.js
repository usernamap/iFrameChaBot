// src/index.js



import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';


// Définition des styles de base
document.documentElement.style.setProperty('--font-family', window.CHATBOT_CONFIG.fontFamily);
document.documentElement.style.setProperty('--font-size', window.CHATBOT_CONFIG.fontSize);


// Fonctions utilitaires
const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const TTS_REPLAY_LIMIT = 10;

const Icons = {
 MessageCircle: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg></span>,
    Send: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg></span>,
    Loader: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg></span>,
    AlertTriangle: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg></span>,
    RefreshCw: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg></span>,
    Wifi: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi-off"><path d="M12 20h.01" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /><path d="M5 12.859a10 10 0 0 1 5.17-2.69" /><path d="M19 12.859a10 10 0 0 0-2.007-1.523" /><path d="M2 8.82a15 15 0 0 1 4.177-2.643" /><path d="M22 8.82a15 15 0 0 0-11.288-3.764" /><path d="m2 2 20 20" /></svg></span>,
    Clock: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>,
    Check: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg></span>,
    CheckCheck: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-check"><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></svg></span>,
    ChevronLeft: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg></span>,
    ChevronDown: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg></span>,
    Sun: () => <span><svg xmlns="http://www.w3.org/2000/svg" color="yellow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg></span>,
    Moon: () => <span><svg xmlns="http://www.w3.org/2000/svg" color="white" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg></span>,
    Star: () => <span><svg xmlns="http://www.w3.org/2000/svg" color="yellow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></span>,
    StarFilled: () => <span><svg xmlns="http://www.w3.org/2000/svg" color='yellow' width="24" height="24" viewBox="0 0 24 24" fill="yellow" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></span>,
    StarOutline: () => <span><svg xmlns="http://www.w3.org/2000/svg" color='yellow' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-off"><path d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43" /><path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" /><line x1="2" x2="22" y1="2" y2="22" /></svg></span>,
    Volume0: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /></svg></span>,
    Volume1: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-1"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /></svg></span>,
    Volume2: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></svg></span>,
    VolumeUp: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-1"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /></svg></span>,
    VolumeX: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-x"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" /></svg></span>,
    Play: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3" /></svg></span>,
    Pause: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1" /><rect x="6" y="4" width="4" height="16" rx="1" /></svg></span>,
    TTS: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-audio-lines"><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></svg></span>,
    Palette: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg></span>,
    Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>,
    X: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>,
    ArrowRight: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>,
    ArrowLeft: () => <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg></span>,
    Upload: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>),
    HelpCircle: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>),
    Plus: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>),
    Minus: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-circle-minus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>),
    Trash2: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>),
    Contrast: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-contrast"><rect x="12" y="2" width="8" height="20" rx="4" ry="4" /><rect x="4" y="2" width="8" height="20" rx="4" ry="4" /></svg>),
    Eye: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-eye"><path d="M22 12c0 2-3 3-3 3s-3-1-3-3 3-3 3-3 3 1 3 3z" /><path d="M12 2a17 17 0 0 1 7.9 4.5" /><path d="M2 12c5 6 10 10 10 10s5-4 10-10" /></svg>),
    ZoomIn: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
    Settings: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>),
    Edit: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>),
    Payment: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>),
    LogOut: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>),
    Phone: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>),
    Shield: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>),
    Lock: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>),
    Users: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
    circleCheck: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>),
    Download: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>),
    TrendingUp: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>),
    Mail: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>),
    Video: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>),
    FileCheck: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-check"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m9 15 2 2 4-4" /></svg>),
    UserCheck: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>),

};

const TypingAnimation = ({
  enableTypingAnimation,
  typingAnimationType,
  typingAnimationColor,
  typingAnimationSize,
  typingText,
  typingLogo,
}) => {
  if (!enableTypingAnimation) return null;

  if (typingAnimationType === 'text') {
    return <p style={{ color: typingAnimationColor }}>{typingText}</p>;
  }

  if (typingAnimationType === 'logo' && typingLogo) {
    return (
      <img
        src={typingLogo}
        alt="Typing"
        style={{ width: typingAnimationSize, height: typingAnimationSize }}
      />
    );
  }

  // Animation par défaut (points)
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: ['0%', '-50%', '0%'],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            width: typingAnimationSize,
            height: typingAnimationSize,
            borderRadius: '50%',
            backgroundColor: typingAnimationColor,
          }}
        />
      ))}
    </div>
  );
};

const TTSOptionsPortal = ({ children, isDarkMode, config, parentRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const portalRoot = document.getElementById('portal-root') || document.body;

  useEffect(() => {
    if (parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [parentRef]);

  return ReactDOM.createPortal(
    <div
      className="tts-options-portal"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 1000,
      }}
    >
      <div
        className="bg-white rounded-md shadow-lg"
        style={{
          ...(isDarkMode ? { backgroundColor: config.darkModeConfig.backgroundColor } : {}),
        }}
      >
        {children}
      </div>
    </div>,
    portalRoot
  );
};

const ChatbotPreview = ({
  config,
  useRealAPI = false,
  companyInfo,
  maxMessages,
  onMessageSent,
}) => {
  const [isOpen, setIsOpen] = usePersistedState('chatbotIsOpen', true);
  const [clientSideMessages, setClientSideMessages] = useState([]);
  const [input, setInput] = usePersistedState('chatbotInput', '');
  const [isTyping, setIsTyping] = usePersistedState('chatbotIsTyping', false);
  const [error, setError] = usePersistedState('chatbotError', null);
  const [assistantStatus, setAssistantStatus] = usePersistedState(
    'chatbotAssistantStatus',
    'online'
  );
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [showProactivePrompt, setShowProactivePrompt] = usePersistedState(
    'chatbotShowProactivePrompt',
    false
  );
  const [isDarkMode, setIsDarkMode] = usePersistedState('chatbotIsDarkMode', false);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [messageCount, setMessageCount] = usePersistedState('chatbotMessageCount', 0);
  const [apiAvailable, setApiAvailable] = useState(true);

  // État lié au TTS
  const [currentlyPlayingId, setCurrentlyPlayingId] = usePersistedState(
    'chatbotCurrentlyPlayingId',
    null
  );
  const [isTTSEnabled, setIsTTSEnabled] = usePersistedState(
    'chatbotIsTTSEnabled',
    config.enableTTS
  );
  const [selectedVoice, setSelectedVoice] = usePersistedState(
    'chatbotSelectedVoice',
    config.ttsConfig.defaultVoice
  );
  const [volume, setVolume] = usePersistedState('chatbotVolume', config.ttsConfig.defaultVolume);
  const [speed, setSpeed] = usePersistedState('chatbotSpeed', config.ttsConfig.defaultSpeed);
  const [showTTSOptions, setShowTTSOptions] = usePersistedState(
    'chatbotShowTTSOptions',
    false
  );
  const [isPlaying, setIsPlaying] = usePersistedState('chatbotIsPlaying', false);
  const [playingMessageId, setPlayingMessageId] = usePersistedState(
    'chatbotPlayingMessageId',
    null
  );
  const [readMessageIds, setReadMessageIds] = usePersistedState('chatbotReadMessageIds', []);
  const ttsButtonRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [ttsReplayCount, setTtsReplayCount] = usePersistedState('chatbotTtsReplayCount', {});

  console.log('Config:', config);
  console.log('Company Info:', companyInfo);

  const enabledVoices = config.ttsConfig?.availableVoices?.filter(
    (voice) => config.ttsConfig.enabledVoices[voice]
  ) || [];
  
  if (!config || !companyInfo) {
    console.error('Configuration ou informations de l\'entreprise manquantes');
    return null; // ou un message d'erreur
  }

  useEffect(() => {
    scrollToBottom();
  }, [clientSideMessages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const initialMessage = {
      id: 'welcome',
      text: config.welcomeMessage,
      isBot: true,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setClientSideMessages([initialMessage]);
  }, [config.welcomeMessage]);

  useEffect(() => {
    setIsTTSEnabled(config.enableTTS);
    if (config.ttsConfig) {
      setSelectedVoice(config.ttsConfig.defaultVoice);
      setVolume(config.ttsConfig.defaultVolume);
      setSpeed(config.ttsConfig.defaultSpeed);
    }
  }, [config]);  

  useEffect(() => {
    if (config.enableStatus) {
      setAssistantStatus(config.statusConfig.dotStatus || 'online');
    } else {
      setAssistantStatus('online');
    }
  }, [config.enableStatus, config.statusConfig]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null);
    updateLastActivityTime();
  };

  const updateLastActivityTime = useCallback(() => {
    setLastActivityTime(Date.now());
    if (assistantStatus === 'away') {
      setAssistantStatus('online');
    }
  }, [assistantStatus]);

  const simulateTyping = (duration) => {
    setIsTyping(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, duration);
    });
  };

  const simulateTTS = useCallback((messageId) => {
    setCurrentlyPlayingId(messageId);
    setTimeout(() => {
      setCurrentlyPlayingId(null);
    }, 2000);
  }, []);

  useEffect(() => {
    if (useRealAPI) {
      const checkApiAvailability = async () => {
        try {
          const response = await fetch('https://assistant.aliatech.fr/api/chatbot/chat', {
            method: 'HEAD',
          });
          if (!response.ok) {
            throw new Error('API indisponible');
          }
          setApiAvailable(true);
        } catch (error) {
          console.error('API non disponible:', error);
          setApiAvailable(false);
        }
      };
      checkApiAvailability();
    }
  }, [useRealAPI]);

  const playTTS = useCallback(
    async (text, messageId) => {
      if (!isTTSEnabled || volume === 0) return;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setIsPlaying(true);
      setPlayingMessageId(messageId);

      try {
        const response = await fetch('https://assistant.aliatech.fr/api/chatbot/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            voice: selectedVoice,
            volume,
            speed,
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la communication avec le serveur TTS');
        }

        const audioArrayBuffer = await response.arrayBuffer();
        const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.volume = volume;
        audioRef.current.playbackRate = speed;
        await audioRef.current.play();
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsPlaying(false);
          setPlayingMessageId(null);
        };
      } catch (error) {
        console.error('Erreur lors de la lecture TTS:', error);
        setIsPlaying(false);
        setPlayingMessageId(null);
      }
    },
    [isTTSEnabled, selectedVoice, volume, speed]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || assistantStatus === 'offline') return;

    if (useRealAPI && !apiAvailable) {
      setError({
        type: 'api_unavailable',
        message: `L'API est actuellement indisponible. Veuillez réessayer plus tard.`,
      });
      return;
    } else if (!useRealAPI) {
      setError(null);
    }

    updateLastActivityTime();
    setShowFeedback(false);

    const currentTime = new Date().toISOString();

    const userMessage = {
      id: uuidv4(),
      text: input,
      isBot: false,
      timestamp: currentTime,
      isRead: false,
    };

    setClientSideMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      if (useRealAPI) {
        setIsTyping(true);
        const response = await fetch('https://assistant.aliatech.fr/api/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            companyInfo: companyInfo,
            chatbotConfig: config,
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la communication avec le serveur');
        }

        setMessageCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount >= maxMessages) {
            if (inputRef.current) {
              inputRef.current.disabled = true;
            }
          }
          return newCount;
        });
        onMessageSent && onMessageSent();

        const data = await response.json();
        setIsTyping(false);

        const botMessage = {
          id: uuidv4(),
          text: data.response,
          isBot: true,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        setClientSideMessages((prev) => [...prev, botMessage]);

        if (config.enableTTS) {
          playTTS(data.response, botMessage.id);
        }
      } else {
        const typingDuration = Math.random() * 2000 + 1000;
        await simulateTyping(typingDuration);

        const botResponse = 'Ceci est une réponse simulée de l’assistant virtuel.';

        const botMessage = {
          id: uuidv4(),
          text: botResponse,
          isBot: true,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        setClientSideMessages((prev) => [...prev, botMessage]);

        if (config.enableTTS) {
          simulateTTS(botMessage.id);
        }
      }

      if (Math.random() < config.feedbackProbability) {
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('Erreur lors de la communication avec le chatbot:', error);
      setError({ type: 'unknown', message: config.ERROR_MESSAGES.unknown });
    }
  };

  const toggleTTSOptions = () => {
    setShowTTSOptions((prev) => !prev);
  };

  const replayMessage = (messageId, text) => {
    simulateTTS(messageId);
  };

  const replayMessageTest = (messageId, text) => {
    const currentReplayCount = ttsReplayCount[messageId] || 0;

    if (currentReplayCount >= TTS_REPLAY_LIMIT) {
      console.warn(
        `Limite de répétition atteinte pour le message ${messageId}. Utilisation de simulateTTS.`
      );
      simulateTTS(messageId);
    } else {
      playTTS(text, messageId);
      setTtsReplayCount((prev) => ({
        ...prev,
        [messageId]: currentReplayCount + 1,
      }));
    }
  };

  useEffect(() => {
    setSelectedVoice(config.ttsConfig.defaultVoice);
    setVolume(config.ttsConfig.defaultVolume);
    setSpeed(config.ttsConfig.defaultSpeed);
  }, [config.ttsConfig.defaultVoice, config.ttsConfig.defaultVolume, config.ttsConfig.defaultSpeed]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <Icons.VolumeX />;
    if (volume < 0.5) return <Icons.Volume1 />;
    return <Icons.Volume2 />;
  };

  const renderMessage = (message) => {
    if (message.isBot) {
      return (
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            a: ({ node, ...props }) => (
              <a
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            code: ({ node, inline, ...props }) =>
              inline ? (
                <code className="bg-gray-200 rounded px-1" {...props} />
              ) : (
                <code
                  className="block bg-gray-200 rounded p-2 mb-2 overflow-x-auto"
                  {...props}
                />
              ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      );
    }
    return message.text;
  };

  const renderTTSIcon = (messageId) => {
    if (!config.enableTTS) return null;

    if (!config.ttsConfig.availableVoices.length) {
      return <Icons.VolumeX aria-label="Synthèse vocale désactivée" />;
    }

    if (playingMessageId === messageId) {
      return <Icons.VolumeUp aria-label="Arrêter la lecture" />;
    } else if (currentlyPlayingId === messageId) {
      return <Icons.Volume2 aria-label="En cours de lecture" />;
    } else {
      return <Icons.Volume0 aria-label="Lire le message" />;
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const getThemeStyles = () => {
    if (isDarkMode && config.enableDarkMode) {
      return {
        backgroundColor: config.darkModeConfig.backgroundColor,
        color: config.darkModeConfig.textColor,
        fontSize: config.fontSize,
      };
    }
    return {
      fontSize: config.fontSize,
    };
  };

  const TTSOptions = () => (
    <div
      id="tts-options"
      className="w-48 p-4 bg-white rounded-md shadow-lg"
      style={{
        backgroundColor: isDarkMode ? config.darkModeConfig.backgroundColor : 'white',
      }}
    >
      <label
        className="block mt-2 text-sm font-medium"
        style={
          isDarkMode
            ? { color: config.darkModeConfig.textColor }
            : { fontSize: config.fontSize, fontFamily: `'${config.fontFamily}', sans-serif` }
        }
      >
        Voix
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="w-full mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          style={
            isDarkMode
              ? {
                  backgroundColor: config.darkModeConfig.inputBackgroundColor,
                  color: config.darkModeConfig.inputTextColor,
                  borderColor: config.darkModeConfig.primaryColor,
                }
              : {}
          }
        >
          {enabledVoices.length > 0 ? (
            enabledVoices.map((voice) => (
              <option key={voice} value={voice}>
                {voice}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Aucune voix activée
            </option>
          )}
        </select>
      </label>

      {config.ttsConfig.enableVolumeControl && (
        <label
          className="block mt-2 text-sm font-medium"
          style={
            isDarkMode
              ? { color: config.darkModeConfig.textColor }
              : { fontSize: config.fontSize, fontFamily: `'${config.fontFamily}', sans-serif` }
          }
        >
          Volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full mt-1"
          />
          <span className="text-xs">{(volume * 100).toFixed(0)}%</span>
        </label>
      )}

      {config.ttsConfig.enableSpeedControl && (
        <label
          className="block mt-2 text-sm font-medium"
          style={
            isDarkMode
              ? { color: config.darkModeConfig.textColor }
              : { fontSize: config.fontSize, fontFamily: `'${config.fontFamily}', sans-serif` }
          }
        >
          Vitesse
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full mt-1"
          />
          <span className="text-xs">{speed.toFixed(1)}x</span>
        </label>
      )}
    </div>
  );

  if (useRealAPI && !apiAvailable) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 font-bold">
          L'aperçu du chatbot est désactivé car l'API est indisponible.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-96 flex items-end flex-col">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full overflow-hidden"
            style={{
              fontFamily: `'${config.fontFamily}', sans-serif`,
              fontSize: config.fontSize,
              ...getThemeStyles(),
            }}
          >
            <motion.div
              className="p-4 flex justify-between items-center"
              style={{ backgroundColor: config.primaryColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                <div className="flex flex-col">
                  <h3
                    className="font-bold"
                    style={{ color: config.textColor, fontSize: config.fontSize }}
                  >
                    {config.headerTitle}
                  </h3>
                  <p
                    className="text-sm opacity-80"
                    style={{ color: config.textColor, fontSize: config.fontSize }}
                  >
                    {config.STATUS_MESSAGES[assistantStatus]}
                  </p>
                </div>
                {config.enableDarkMode && config.uiConfig.showDarkModeToggle && (
                  <button
                    onClick={toggleDarkMode}
                    className="text-white hover:text-gray-200 transition p-2 ml-4"
                    aria-label={
                      isDarkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'
                    }
                  >
                    {isDarkMode ? <Icons.Sun aria-hidden="true" /> : <Icons.Moon aria-hidden="true" />}
                  </button>
                )}
              </div>
              <div className="flex items-center">
                {config.enableTTS && (
                  <div className="relative ml-2">
                    <button
                      onClick={toggleTTSOptions}
                      className="text-white hover:text-gray-200 transition p-2"
                      aria-label="Options de synthèse vocale"
                      aria-expanded={showTTSOptions}
                      aria-controls="tts-options"
                      ref={ttsButtonRef}
                    >
                      {showTTSOptions ? getVolumeIcon() : config.ttsToggleIcon || <Icons.TTS />}
                    </button>
                    {showTTSOptions && (
                      <TTSOptionsPortal
                        isDarkMode={isDarkMode}
                        config={config}
                        parentRef={ttsButtonRef}
                      >
                        <TTSOptions />
                      </TTSOptionsPortal>
                    )}
                  </div>
                )}
                <div
                  className={`ml-2 w-3 h-3 rounded-full ${config.STATUS_COLORS[assistantStatus]}`}
                  aria-hidden="true"
                ></div>
              </div>
            </motion.div>

            <div className="h-96 overflow-y-auto p-4" ref={messagesContainerRef}>
              <AnimatePresence>
                {clientSideMessages.map((message) => {
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mb-4 ${message.isBot ? 'text-left' : 'text-right'}`}
                    >
                      <motion.div
                        className={`inline-block p-3 rounded-2xl max-w-[100%] ${
                          message.isBot ? 'rounded-tl-none' : 'rounded-tr-none'
                        }`}
                        style={{
                          backgroundColor: message.isBot
                            ? isDarkMode
                              ? config.darkModeConfig.messageBackgroundColor
                              : config.botMessageBackgroundColor
                            : isDarkMode
                            ? config.darkModeConfig.userMessageBackgroundColor
                            : config.userMessageBackgroundColor,
                          color: message.isBot
                            ? isDarkMode
                              ? config.darkModeConfig.messageTextColor
                              : config.botMessageTextColor
                            : isDarkMode
                            ? config.darkModeConfig.userMessageTextColor
                            : config.userMessageTextColor,
                          fontSize: config.fontSize,
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {renderMessage(message)}
                      </motion.div>
                      <div className="text-xs mt-1 flex items-center justify-end">
                        {config.messageConfig?.enableTimestamp && (
                          <time dateTime={message.timestamp}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                        )}
                        {!message.isBot && config.messageConfig?.enableReadStatus && (
                          <span
                            className="ml-1"
                            aria-label={message.isRead ? 'Lu' : 'Envoyé'}
                          >
                            {message.isRead ? <Icons.CheckCheck /> : <Icons.Check />}
                          </span>
                        )}
                        {message.isBot && config.enableTTS && (
                          <button
                            onClick={() =>
                              useRealAPI
                                ? replayMessageTest(message.id, message.text)
                                : replayMessage(message.id, message.text)
                            }
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            aria-label={
                              playingMessageId === message.id
                                ? 'Arrêter la lecture'
                                : 'Lire le message'
                            }
                          >
                            {renderTTSIcon(message.id)}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesContainerRef} />
              {isTyping && config.enableTypingAnimation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-500 text-sm mb-4"
                >
                  <TypingAnimation
                    enableTypingAnimation={config.enableTypingAnimation}
                    typingAnimationType={config.typingAnimationType}
                    typingAnimationColor={config.typingAnimationColor}
                    typingAnimationSize={config.typingAnimationSize}
                    typingText={config.typingText}
                    typingLogo={config.typingLogo}
                  />
                </motion.div>
              )}
            </div>

            {error && (
              <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error.message}
              </div>
            )}

            {showProactivePrompt && (
              <div className="p-2 border-t" style={{ borderColor: config.primaryColor }}>
                <p className="text-sm text-center mb-2">
                  Avez-vous besoin d'aide supplémentaire ?
                </p>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setShowProactivePrompt(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Non, merci
                  </button>
                  <button
                    onClick={() => {
                      setInput("J'ai besoin d'aide supplémentaire");
                      handleSubmit({ preventDefault: () => {} });
                      setShowProactivePrompt(false);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Oui, s'il vous plaît
                  </button>
                </div>
              </div>
            )}

            {config.enableSuggestions && config.enableQuickReplies && (
              <div
                className="flex flex-wrap justify-center p-2 border-t"
                style={{ borderColor: config.primaryColor }}
              >
                {config.quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setInput(reply);
                      handleSubmit({ preventDefault: () => {} });
                    }}
                    className="m-1 px-3 py-1 text-sm rounded-full"
                    style={{
                      backgroundColor: isDarkMode
                        ? config.darkModeConfig.suggestionBackgroundColor
                        : config.primaryColor,
                      color: isDarkMode ? config.darkModeConfig.suggestionTextColor : config.textColor,
                    }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="p-4 border-t"
              style={{ borderColor: config.primaryColor }}
            >
              <div className="flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    assistantStatus === 'offline' ? config.offlineText : config.placeholderText
                  }
                  className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={assistantStatus === 'offline' || messageCount >= maxMessages}
                  ref={inputRef}
                  style={
                    isDarkMode
                      ? {
                          backgroundColor: config.darkModeConfig.inputBackgroundColor,
                          color: config.darkModeConfig.inputTextColor,
                          borderColor: config.darkModeConfig.primaryColor,
                        }
                      : {}
                  }
                />
                <motion.button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={
                    input.trim() === '' ||
                    assistantStatus === 'offline' ||
                    messageCount >= maxMessages
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: config.primaryColor,
                    color: isDarkMode ? config.darkModeConfig.buttonTextColor : 'white',
                  }}
                >
                  {typeof config.sendButtonIcon === 'string' ||
                  React.isValidElement(config.sendButtonIcon)
                    ? config.sendButtonIcon
                    : <Icons.Send />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={toggleChat}
        className={`bg-blue-600 text-white mt-5 p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center animate-bounce`}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
        style={{
          backgroundColor: config.primaryColor,
          width: config.openingBubbleWidth,
          height: config.openingBubbleHeight,
        }}
      >
        {React.isValidElement(config.openingBubbleIcon) ? (
          config.openingBubbleIcon
        ) : (
          <Icons.MessageCircle aria-hidden="true" />
        )}
      </motion.button>
    </div>
  );
};

// Render du composant ChatbotPreview
const rootElement = document.getElementById('chatbot-root');
ReactDOM.render(
  <React.StrictMode>
    <ChatbotPreview
      config={window.CHATBOT_CONFIG}
      useRealAPI={true}
      companyInfo={window.COMPANY_INFO}
      maxMessages={50}
    />
  </React.StrictMode>,
  rootElement
);