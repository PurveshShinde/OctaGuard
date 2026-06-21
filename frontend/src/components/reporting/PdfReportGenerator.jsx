import React, { useState } from 'react';
import { T } from '../../utils/constants';
import { FileText, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export default function PdfReportGenerator({ targetId, filename = 'OctaGuard_Report.pdf' }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    const element = document.getElementById(targetId);
    
    if (!element) {
      toast.error('Could not find report content.');
      setIsGenerating(false);
      return;
    }

    try {
      // Temporarily adjust styles for better PDF rendering if needed
      // but usually html2canvas handles basic dashboards well.
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        backgroundColor: T.bg,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button onClick={generatePDF} disabled={isGenerating} style={{
      background: T.surface, color: T.text, border: `1px solid ${T.borderHi}`,
      padding: "8px 16px", borderRadius: 8, fontWeight: 500, fontSize: 13,
      display: "flex", alignItems: "center", gap: 8, cursor: isGenerating ? "wait" : "pointer",
      transition: "all 0.2s"
    }} onMouseEnter={e => { if(!isGenerating) e.currentTarget.style.background = T.border }} 
       onMouseLeave={e => { if(!isGenerating) e.currentTarget.style.background = T.surface }}>
      {isGenerating ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <FileText size={16} />}
      {isGenerating ? 'Generating...' : 'Export PDF'}
    </button>
  );
}
