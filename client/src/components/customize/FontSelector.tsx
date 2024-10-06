import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/common/Icons';
import { Tooltip } from '@/components/ui/Tooltip';

interface FontSelectorProps {
    font: string;
    onChange: (font: string) => void;
    tooltip: string;
    onTooltip: () => void;
}

const initialFonts = [
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
];

const FontSelector: React.FC<FontSelectorProps> = ({ font, onChange, tooltip }) => {
    const [fonts, setFonts] = useState(initialFonts);
    const [loadedFonts, setLoadedFonts] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadFonts = async () => {
            const loadedFonts = await Promise.all(
                initialFonts.map(async (fontName) => {
                    try {
                        await document.fonts.load(`16px "${fontName}"`);
                        return fontName;
                    } catch (error) {
                        console.error(`Erreur lors du chargement de la police ${fontName}:`, error);
                        return null;
                    }
                })
            );
            setLoadedFonts(loadedFonts.filter((font): font is string => font !== null));
        };

        loadFonts();
    }, []);

    const handleFontChange = (selectedFont: string) => {
        if (loadedFonts.includes(selectedFont) || fonts.includes(selectedFont)) {
            onChange(selectedFont);
        } else {
            console.warn(`La police ${selectedFont} n'est pas encore chargée.`);
        }
    };

    const handleFontImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fontUrl = e.target?.result as string;
                const fontName = file.name.split('.')[0];

                const styleElement = document.createElement('style');
                styleElement.innerHTML = `
                    @font-face {
                        font-family: '${fontName}';
                        src: url('${fontUrl}');
                    }
                `;
                document.head.appendChild(styleElement);

                setFonts((prevFonts) => [...prevFonts, fontName]);
                setLoadedFonts((prevLoadedFonts) => [...prevLoadedFonts, fontName]);
                onChange(fontName);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="font-select" className="block text-sm font-medium text-gray-700">
                    Police de caractères
                </label>
                <Tooltip content={tooltip}>
                    <Icons.HelpCircle />
                </Tooltip>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fonts.map((f, index) => (
                    <motion.button
                        key={f}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded ${f === font ? 'bg-primary text-white' : 'bg-gray-100'} ${index >= initialFonts.length ? 'border border-blue-400' : ''}`}
                        onClick={() => handleFontChange(f)}
                        style={{ fontFamily: `'${f}', sans-serif` }}
                        disabled={!loadedFonts.includes(f) && !fonts.includes(f)}
                    >
                        <span className="text-sm">Aa</span>
                        <span className="ml-2 text-xs">{f}</span>
                    </motion.button>
                ))}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".ttf, .woff, .woff2, .otf"
                    className="hidden"
                    onChange={handleFontImport}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded bg-blue-100 text-blue-600 border border-blue-400 flex items-center justify-center"
                >
                    <Icons.Upload />
                    Importer une police
                </motion.button>
            </div>
            {fonts.length > initialFonts.length && (
                <p className="mt-2 text-sm text-gray-600">
                    Polices personnalisées importées : {fonts.length - initialFonts.length}
                </p>
            )}
        </div>
    );
};

export default FontSelector;