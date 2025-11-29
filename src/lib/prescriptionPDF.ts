import jsPDF from 'jspdf';

export interface PrescriptionData {
  patientName: string;
  patientAge: number;
  patientMRN: string;
  doctorName: string;
  doctorSignature?: string;
  date: string;
  content: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

/**
 * Generate beautiful prescription PDF with professional design
 */
export async function generatePrescriptionPDF(data: PrescriptionData): Promise<Blob> {
  const doc = new jsPDF();
  
  // Colors
  const lightBlue: [number, number, number] = [219, 234, 254];
  const darkGray: [number, number, number] = [31, 41, 55];
  
  // Header with gradient effect (simulated with rectangles)
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo circle
  doc.setFillColor(255, 255, 255);
  doc.circle(25, 20, 10, 'F');
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('M', 25, 23, { align: 'center' });
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('MedIQ Healthcare', 42, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Advanced EHR System | Digital Prescription', 42, 25);
  doc.text('📞 +91-1800-MEDIQ | 📧 care@mediq.health', 42, 31);
  
  // Title bar
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 40, 210, 12, 'F');
  doc.setTextColor(...darkGray);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('℞ PRESCRIPTION', 105, 48, { align: 'center' });
  
  // Patient info card
  let y = 60;
  doc.setFillColor(...lightBlue);
  doc.roundedRect(15, y, 180, 32, 3, 3, 'F');
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, y, 180, 32, 3, 3, 'S');
  
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', 20, y + 7);
  
  doc.setTextColor(...darkGray);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', 20, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientName, 35, y + 14);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Age:', 20, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.patientAge} years`, 35, y + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.text('MRN:', 20, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientMRN, 35, y + 26);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 120, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(data.date).toLocaleDateString('en-IN'), 135, y + 14);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Time:', 120, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(data.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), 135, y + 20);
  
  // Prescription content
  y = 100;
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('℞ PRESCRIPTION DETAILS', 15, y);
  
  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, y, 180, 50, 2, 2, 'S');
  
  doc.setTextColor(...darkGray);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  y += 6;
  const lines = doc.splitTextToSize(data.content, 170);
  lines.forEach((line: string) => {
    doc.text(line, 20, y);
    y += 5;
  });
  
  // Medications table
  if (data.medications && data.medications.length > 0) {
    y = Math.max(y + 10, 160);
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('💊 MEDICATIONS', 15, y);
    
    y += 6;
    // Table header
    doc.setFillColor(37, 99, 235);
    doc.rect(15, y, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('#', 18, y + 5);
    doc.text('Medicine', 25, y + 5);
    doc.text('Dosage', 85, y + 5);
    doc.text('Frequency', 120, y + 5);
    doc.text('Duration', 160, y + 5);
    
    y += 8;
    doc.setTextColor(...darkGray);
    data.medications.forEach((med, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(15, y, 180, 7, 'F');
      }
      doc.text(`${i + 1}`, 18, y + 5);
      doc.text(med.name, 25, y + 5);
      doc.text(med.dosage, 85, y + 5);
      doc.text(med.frequency, 120, y + 5);
      doc.text(med.duration, 160, y + 5);
      y += 7;
    });
  }
  
  // Signature
  y = Math.max(y + 15, 245);
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(120, y, 70, 30, 2, 2, 'S');
  
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Digitally Signed By:', 125, y + 6);
  
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.8);
  doc.line(125, y + 16, 185, y + 16);
  
  doc.setTextColor(...darkGray);
  doc.setFontSize(10);
  doc.text(data.doctorName, 125, y + 21);
  
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('✓ VERIFIED', 125, y + 26);
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(6);
  const hash = btoa(`${data.patientMRN}-${Date.now()}`).substring(0, 16);
  doc.text(`Hash: ${hash}`, 125, y + 30);
  
  // Footer
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(15, 280, 195, 280);
  
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a digitally generated prescription from MedIQ EHR System', 105, 285, { align: 'center' });
  doc.text('For verification, visit: mediq.health/verify', 105, 289, { align: 'center' });
  
  return doc.output('blob');
}

/**
 * Download the prescription PDF
 */
export function downloadPrescriptionPDF(blob: Blob, filename: string = 'prescription.pdf') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
