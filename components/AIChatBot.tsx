import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage } from '../services/geminiService';
import { Message } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';

const AIChatBot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicializar mensaje de bienvenida según el idioma
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          role: 'model',
          text: t('chatbot.greeting'),
          timestamp: new Date()
        }
      ]);
    }
  }, [i18n.language, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsgText = input.trim();
    const newUserMsg: Message = { role: 'user', text: userMsgText, timestamp: new Date() };

    setInput('');
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Mapeamos el historial para el servicio
      const chatHistory = updatedMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const responseText = await sendMessage(chatHistory, i18n.language);

      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: t('chatbot.error'), timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, i18n.language, t]);

  const cleanTextForPDF = (text: string) => {
    // Protocolo de limpieza total: eliminar símbolos markdown, saludos comunes y la pregunta de cierre
    let clean = text
      .split('\n')
      // Filtrar tablas markdown del texto narrativo
      .filter(line => !line.trim().startsWith('|') && !line.trim().includes('---') && !line.trim().startsWith('```'))
      .join('\n')
      // Eliminar pregunta de cierre obligatoria del bot (ES/EN)
      .replace(/¿Deseas que profundice en el análisis detallado de estos datos o genere el Informe Semanal\?/g, '')
      .replace(/Would you like me to delve into a detailed analysis of this data or generate the Weekly Report\?/g, '')
      // Eliminar saludos típicos de IA si están al inicio
      .replace(/^(Hola|Saludos|Buen día|Hello|Greetings)[^.]*\./gi, '')
      // Eliminar símbolos Markdown
      .replace(/[#*]/g, '')
      .replace(/_{2,}/g, '')
      .trim();

    return clean;
  };

  const exportChatToPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20; // Protocolo: 20mm por lado
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = 170; // 210 - 20 - 20
    let cursorY = 25;

    // Título Principal en MAYÚSCULAS
    doc.setFontSize(14);
    doc.setTextColor(19, 91, 236);
    doc.setFont('helvetica', 'bold');
    const title = t('chatbot.report_title');
    doc.text(title, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 15;

    // Solo exportamos el último mensaje del modelo si es un reporte extenso, o todo el historial relevante
    // Para cumplir con el "Filtro de Contenido", procesamos los mensajes omitiendo fluff
    messages.forEach((msg) => {
      // Omitimos mensajes de usuario en el reporte oficial según protocolo de limpieza
      if (msg.role === 'user') return;

      const segments = msg.text.split(/```csv([\s\S]*?)```/);

      segments.forEach((segment, idx) => {
        if (idx % 2 === 1) {
          // Bloque CSV -> Renderizar con autoTable
          const csvRows = segment.trim().split('\n').map(row => row.split(';'));
          if (csvRows.length > 0) {
            autoTable(doc, {
              startY: cursorY,
              head: [csvRows[0].map(h => h.toUpperCase())],
              body: csvRows.slice(1),
              margin: { left: margin, right: margin },
              theme: 'grid',
              styles: { fontSize: 8, font: 'helvetica', cellPadding: 2 },
              headStyles: { fillColor: [19, 91, 236], textColor: [255, 255, 255], fontStyle: 'bold' },
              alternateRowStyles: { fillColor: [245, 247, 250] },
            });
            cursorY = (doc as any).lastAutoTable.finalY + 10;
          }
        } else {
          // Texto narrativo -> Limpiar y MAYÚSCULAS en encabezados
          const cleanedText = cleanTextForPDF(segment);
          if (cleanedText) {
            const lines = cleanedText.split('\n');
            lines.forEach(line => {
              const textLine = line.trim();
              if (textLine === '') return;
              if (cursorY > 275) { doc.addPage(); cursorY = 20; }

              // Detectar si la línea es un título de sección
              const isHeader = textLine.length < 60 && (textLine.includes(':') || textLine === textLine.toUpperCase());

              if (isHeader) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(19, 91, 236);
                doc.setFontSize(10);
                doc.text(textLine.toUpperCase(), margin, cursorY);
                cursorY += 7;
              } else {
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);
                doc.setFontSize(10);
                const splitText = doc.splitTextToSize(textLine, maxWidth);
                doc.text(splitText, margin, cursorY);
                cursorY += (splitText.length * 5) + 2;
              }
            });
            cursorY += 4;
          }
        }
      });
      cursorY += 8;
    });

    const filename = t('chatbot.pdf_filename');
    doc.save(`${filename}_${new Date().getTime()}.pdf`);
  };

  const exportChatToExcel = () => {
    const lastModelMessage = [...messages].reverse().find(m => m.role === 'model');
    if (!lastModelMessage) return;

    const csvMatch = lastModelMessage.text.match(/```csv([\s\S]*?)```/);
    if (csvMatch) {
      const csvContent = csvMatch[1].trim();
      const rows = csvContent.split('\n').map(row => row.split(';'));
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Analisis BI");
      const filename = t('chatbot.excel_filename');
      XLSX.writeFile(wb, `${filename}_${new Date().getTime()}.xlsx`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-surface-dark w-80 md:w-96 h-[600px] rounded-2xl shadow-2xl border border-slate-200 dark:border-border-dark flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-4 bg-primary text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined icon-fill">analytics</span>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none">{t('chatbot.role')}</span>
                <span className="text-[9px] opacity-70 uppercase tracking-widest font-black mt-1">{t('chatbot.unit')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportChatToExcel} title={t('chatbot.export_excel')} className="hover:bg-white/20 p-1.5 rounded transition-colors">
                <span className="material-symbols-outlined text-lg">table_chart</span>
              </button>
              <button onClick={exportChatToPDF} title={t('chatbot.export_pdf')} className="hover:bg-white/20 p-1.5 rounded transition-colors">
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded transition-colors ml-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-background-dark/30 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none font-medium'
                  : 'bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-border-dark'
                  }`}>
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl rounded-tl-none text-[10px] animate-pulse flex items-center gap-3 border border-slate-200 dark:border-border-dark">
                  <span className="size-1.5 bg-primary rounded-full animate-bounce"></span>
                  <span className="text-text-secondary italic uppercase tracking-tighter font-bold">{t('chatbot.thinking')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center shadow-lg"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <span className="material-symbols-outlined text-3xl icon-fill">monitoring</span>
        </button>
      )}
    </div>
  );
};

export default AIChatBot;