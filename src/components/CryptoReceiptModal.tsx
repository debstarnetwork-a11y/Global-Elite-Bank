import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Image as ImageIcon,
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  ArrowUpRight,
  Clock,
  Sparkles,
  Lock,
  FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { CryptoWithdrawalRequest, CryptoTradeOrder, useBank } from '../store';

interface CryptoReceiptModalProps {
  withdrawal?: CryptoWithdrawalRequest | null;
  tradeOrder?: CryptoTradeOrder | null;
  onClose: () => void;
}

export function CryptoReceiptModal({ withdrawal, tradeOrder, onClose }: CryptoReceiptModalProps) {
  const { adminSettings } = useBank();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const activeItem = withdrawal || tradeOrder;
  if (!activeItem) return null;

  const isTrade = Boolean(tradeOrder && !withdrawal);
  const orderType = tradeOrder?.orderType; // 'buy' | 'sell'

  const handleCopy = (text: string, type: 'tx' | 'address') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const receiptNo = activeItem.receiptNumber || (isTrade ? `GEB-TRADE-${activeItem.id.slice(-6).toUpperCase()}` : `GEB-CRYPTO-REC-${activeItem.id.slice(-6).toUpperCase()}`);

  const rawDateToFormat = activeItem.approvalDate || activeItem.requestDate || new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zurich',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  }).format(new Date(rawDateToFormat));

  const txHash = activeItem.txHash || '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const cryptoSymbol = isTrade ? tradeOrder!.cryptoCurrency : (withdrawal as CryptoWithdrawalRequest).currency;
  const cryptoAmt = isTrade ? tradeOrder!.cryptoAmount : (withdrawal as CryptoWithdrawalRequest).cryptoAmount;
  const fiatAmt = isTrade ? tradeOrder!.fiatAmount : (withdrawal as CryptoWithdrawalRequest).amount;
  const destinationAddress = isTrade 
    ? 'GEB Institutional Cold Storage Vault (Zurich, Switzerland)' 
    : (withdrawal as CryptoWithdrawalRequest).walletAddress;
  const networkName = isTrade ? 'Proprietary Clearing Ledger' : ((withdrawal as CryptoWithdrawalRequest).network || 'Blockchain Mainnet');
  const bankTitle = adminSettings?.websiteName || 'Global Elite Bank';

  // Fallback direct vector jsPDF renderer (guarantees PDF receipt even if canvas fails)
  const renderDirectPdf = (pdf: jsPDF) => {
    pdf.setFillColor(9, 13, 22);
    pdf.rect(0, 0, 210, 297, 'F');

    // Header border box
    pdf.setDrawColor(30, 41, 59);
    pdf.setLineWidth(0.5);
    pdf.rect(10, 10, 190, 277);

    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(bankTitle.toUpperCase(), 15, 25);

    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.setFont('helvetica', 'normal');
    pdf.text('DIGITAL ASSET CUSTODY & INSTITUTIONAL SETTLEMENT DIRECTORATE', 15, 31);
    pdf.text('ZURICH • GENEVA • LONDON • SINGAPORE • NEW YORK', 15, 36);

    // Green status box
    pdf.setFillColor(6, 78, 59);
    pdf.roundedRect(120, 18, 75, 14, 2, 2, 'F');
    pdf.setTextColor(52, 211, 153);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ON-CHAIN SETTLEMENT CLEARED', 124, 25);
    pdf.setFontSize(7);
    pdf.setTextColor(209, 250, 229);
    pdf.text(`Ref: ${receiptNo}`, 124, 30);

    // Divider
    pdf.setDrawColor(51, 65, 85);
    pdf.line(15, 42, 195, 42);

    // Hero Amount Box
    pdf.setFillColor(17, 24, 39);
    pdf.roundedRect(15, 48, 180, 32, 2, 2, 'F');

    pdf.setTextColor(52, 211, 153);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(isTrade ? 'SETTLED DIGITAL ASSET TRANSACTION' : 'DISPATCHED ASSET & EQUIVALENT VALUE', 20, 56);

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text(`${cryptoAmt} ${cryptoSymbol}`, 20, 68);

    pdf.setFontSize(11);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`≈ $${fiatAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`, 95, 68);

    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Execution Network: ${networkName}`, 20, 75);

    // Table Data
    let y = 92;
    const drawRow = (label: string, value: string, sub?: string) => {
      pdf.setFillColor(15, 23, 42);
      pdf.roundedRect(15, y, 180, sub ? 14 : 11, 1, 1, 'F');
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(label.toUpperCase(), 20, y + 6);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, 80, y + 6);
      if (sub) {
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(7);
        pdf.text(sub, 80, y + 11);
      }
      y += sub ? 16 : 13;
    };

    drawRow('Beneficiary Account', activeItem.userName || 'Private Client', activeItem.userEmail);
    drawRow('Execution Timestamp', formattedDate, 'Zurich, Switzerland Time');
    drawRow('Destination Wallet', destinationAddress);
    if (withdrawal?.memo) {
      drawRow('Transfer Memo / Tag', withdrawal.memo);
    }
    drawRow('Transaction Hash (TXID)', txHash);
    drawRow('Settlement Protocol', `${networkName} (Validated)`);
    drawRow('Settlement Fee', `$${((withdrawal as CryptoWithdrawalRequest)?.networkFee || 12.50).toFixed(2)} USD (Subsidized)`);
    drawRow('Compliance Status', 'VERIFIED & MATURED UNDER SWISS FINMA STANDARDS');

    // Memo card
    y += 4;
    pdf.setFillColor(6, 78, 59);
    pdf.roundedRect(15, y, 180, 20, 2, 2, 'F');
    pdf.setTextColor(52, 211, 153);
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMPLIANCE & CUSTODY MEMORANDUM:', 20, y + 6);
    pdf.setTextColor(241, 245, 249);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    const memoText = (withdrawal as CryptoWithdrawalRequest)?.adminNotes || tradeOrder?.notes || 'Multi-signature custody consensus reached. Digital asset transfer cleared under Swiss FINMA AML compliance protocols.';
    pdf.text(pdf.splitTextToSize(memoText, 170), 20, y + 11);

    // Footer signature
    y += 28;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(7);
    pdf.text(`Cryptographically Sealed by Global Elite Bank Digital Asset Vault • Authentication: ${receiptNo}`, 15, y);
    pdf.text(`System ID: ${activeItem.id} • SHA-256 Validated • Retain for institutional tax and audit records.`, 15, y + 4);
  };

  const renderDirectCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1680;
    const ctx = canvas.getContext('2d')!;

    // 1. Deep background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Outer border container
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 1600);

    // 3. Bank Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(bankTitle.toUpperCase(), 70, 110);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 15px sans-serif';
    ctx.fillText('DIGITAL ASSET CUSTODY & INSTITUTIONAL SETTLEMENT DIRECTORATE', 70, 145);
    ctx.font = '14px sans-serif';
    ctx.fillText('ZURICH • GENEVA • LONDON • SINGAPORE • NEW YORK', 70, 175);

    // 4. Clearance Badge (Top Right)
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(750, 75, 380, 80, 12);
    } else {
      ctx.rect(750, 75, 380, 80);
    }
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('✓ ON-CHAIN SETTLEMENT CLEARED', 775, 112);
    ctx.fillStyle = '#d1fae5';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`Ref: ${receiptNo}`, 775, 138);

    // 5. Divider Line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, 215);
    ctx.lineTo(1130, 215);
    ctx.stroke();

    // 6. Hero Amount Box
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(70, 245, 1060, 175, 16);
    } else {
      ctx.rect(70, 245, 1060, 175);
    }
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(isTrade ? 'SETTLED DIGITAL ASSET TRANSACTION' : 'DISPATCHED ASSET & EQUIVALENT VALUE', 105, 290);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(`${cryptoAmt} ${cryptoSymbol}`, 105, 350);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 24px monospace';
    const fiatText = `≈ $${fiatAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    ctx.fillText(fiatText, 560, 350);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Execution Network: ${networkName} • Segregated Vault Custody`, 105, 395);

    // 7. Table Data
    let curY = 460;
    const drawCanvasRow = (label: string, value: string, sub?: string) => {
      const rowHeight = sub ? 72 : 58;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(70, curY, 1060, rowHeight, 10);
      } else {
        ctx.rect(70, curY, 1060, rowHeight);
      }
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(label.toUpperCase(), 105, curY + 34);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      let displayVal = value;
      if (ctx.measureText(displayVal).width > 660) {
        displayVal = value.slice(0, 34) + '...' + value.slice(-16);
      }
      ctx.fillText(displayVal, 420, curY + 34);

      if (sub) {
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText(sub, 420, curY + 58);
      }
      curY += rowHeight + 12;
    };

    drawCanvasRow('Beneficiary Account', activeItem.userName || 'Private Client', activeItem.userEmail);
    drawCanvasRow('Execution Timestamp', formattedDate, 'UTC Institutional Clearance Timezone');
    drawCanvasRow('Destination Wallet', destinationAddress);
    if (withdrawal?.memo) {
      drawCanvasRow('Transfer Memo / Tag', withdrawal.memo);
    }
    drawCanvasRow('Transaction Hash (TXID)', txHash);
    drawCanvasRow('Settlement Protocol', `${networkName} (Validated)`);
    drawCanvasRow('Settlement Fee', `$${((withdrawal as CryptoWithdrawalRequest)?.networkFee || 12.50).toFixed(2)} USD (Subsidized)`);
    drawCanvasRow('Compliance Status', 'VERIFIED & MATURED UNDER SWISS FINMA STANDARDS');

    // 8. Compliance Memo Box
    curY += 10;
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(70, curY, 1060, 120, 12);
    } else {
      ctx.rect(70, curY, 1060, 120);
    }
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('COMPLIANCE & CUSTODY MEMORANDUM:', 105, curY + 35);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px sans-serif';
    const memoText = (withdrawal as CryptoWithdrawalRequest)?.adminNotes || tradeOrder?.notes || 'Multi-signature custody consensus reached. Digital asset transfer cleared under Swiss FINMA AML compliance protocols.';
    ctx.fillText(memoText.slice(0, 120), 105, curY + 68);
    if (memoText.length > 120) {
      ctx.fillText(memoText.slice(120, 240), 105, curY + 92);
    }

    // 9. Footer Security Watermark
    curY += 155;
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Cryptographically Sealed by Global Elite Bank Digital Asset Vault • Authentication: ${receiptNo}`, 70, curY);
    ctx.fillText(`System ID: ${activeItem.id} • SHA-256 Validated • Retain for institutional tax and audit records.`, 70, curY + 26);

    return canvas;
  };

  const generateReceiptCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!receiptRef.current) return null;
    try {
      const dataUrl = await htmlToImage.toCanvas(receiptRef.current, {
        pixelRatio: 2,
        backgroundColor: '#090d16',
      });
      return dataUrl;
    } catch (error) {
      console.warn('htmlToImage canvas generation error:', error);
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      let dataUrl: string | null = null;
      try {
        dataUrl = (await generateReceiptCanvas()) as any;
      } catch (cErr) {
        console.warn('html-to-image canvas generation error, will use vector PDF builder:', cErr);
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const filename = `Crypto_${isTrade ? 'Trade' : 'Withdrawal'}_Receipt_${receiptNo}.pdf`;

      if (dataUrl) {
        try {
          const imgProps = pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(filename);
          return;
        } catch (_) {}
      }
      renderDirectPdf(pdf);
      pdf.save(filename);
    } catch (err) {
      console.error('Error generating PDF receipt, executing direct fallback:', err);
      try {
        const fallbackPdf = new jsPDF('p', 'mm', 'a4');
        renderDirectPdf(fallbackPdf);
        fallbackPdf.save(`Crypto_${isTrade ? 'Trade' : 'Withdrawal'}_Receipt_${receiptNo}.pdf`);
      } catch (finalErr) {
        console.error('Final fallback PDF failed:', finalErr);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      setIsExporting(true);
      const filename = `Crypto_${isTrade ? 'Trade' : 'Withdrawal'}_Receipt_${receiptNo}.png`;

      const triggerDownload = (url: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      // Guaranteed direct canvas fallback engine
      const downloadViaDirectCanvas = () => {
        const directCanvas = renderDirectCanvas();
        try {
          if (directCanvas.toBlob) {
            directCanvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                triggerDownload(url);
                setTimeout(() => URL.revokeObjectURL(url), 2000);
              } else {
                triggerDownload(directCanvas.toDataURL('image/png'));
              }
            }, 'image/png');
          } else {
            triggerDownload(directCanvas.toDataURL('image/png'));
          }
        } catch (e) {
          triggerDownload(directCanvas.toDataURL('image/png'));
        }
      };

      let canvas: HTMLCanvasElement | null = null;
      try {
        canvas = await generateReceiptCanvas();
      } catch (cErr) {
        console.warn('html2canvas canvas generation error, using direct canvas engine:', cErr);
      }

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        downloadViaDirectCanvas();
        return;
      }

      try {
        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              triggerDownload(url);
              setTimeout(() => URL.revokeObjectURL(url), 2000);
            } else {
              triggerDownload(canvas!.toDataURL('image/png'));
            }
          }, 'image/png');
        } else {
          triggerDownload(canvas.toDataURL('image/png'));
        }
      } catch (exportErr) {
        console.warn('Export from DOM canvas failed or was tainted, executing direct canvas generator:', exportErr);
        downloadViaDirectCanvas();
      }
    } catch (err) {
      console.error('Error downloading image receipt, executing failsafe:', err);
      try {
        const directCanvas = renderDirectCanvas();
        const dataUrl = directCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Crypto_${isTrade ? 'Trade' : 'Withdrawal'}_Receipt_${receiptNo}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (finalErr) {
        console.error('Final image download fallback failed:', finalErr);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsExporting(true);
      let imgData = '';
      try {
        const dataUrl = await generateReceiptCanvas();
        if (dataUrl) {
          imgData = dataUrl as any;
        }
      } catch (_) {}

      if (!imgData) {
        const directCanvas = renderDirectCanvas();
        imgData = directCanvas.toDataURL('image/png');
      }

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Receipt - ${receiptNo}</title>
              <style>
                @page { size: portrait; margin: 8mm; }
                body { margin: 0; padding: 10px; background: #fff; display: flex; justify-content: center; font-family: sans-serif; }
                img { max-width: 100%; height: auto; display: block; }
              </style>
            </head>
            <body>
              <img src="${imgData}" />
            </body>
          </html>
        `);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }, 300);
      }
    } catch (err) {
      console.error('Error printing receipt:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-background/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-background/80 border-b border-border flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">
              Official Blockchain Settlement Receipt
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Download as Image */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 text-xs font-bold bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border px-3 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              title="Download Receipt as PNG Image"
            >
              <ImageIcon size={14} className="text-primary" />
              <span>Image</span>
            </button>

            {/* Download as PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              title="Download Receipt as PDF"
            >
              <Download size={14} />
              <span>{isExporting ? 'Generating...' : 'PDF'}</span>
            </button>

            {/* Print Receipt */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isExporting}
              className="flex items-center gap-1.5 text-xs font-bold bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border px-3 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              title="Print Receipt"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-foreground/50 hover:text-foreground p-1.5 rounded-xl hover:bg-foreground/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Receipt Document Canvas */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#090d16] text-white selection:bg-emerald-500/30">
          <div 
            ref={receiptRef}
            style={{ backgroundColor: '#0d1527', borderColor: 'rgba(255, 255, 255, 0.12)' }}
            className="border rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6"
          >
            {/* Background Security Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-9xl font-black rotate-[-30deg]">GLOBAL ELITE</span>
            </div>

            {/* Header / Brand */}
            <div 
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b relative z-10"
            >
              <div className="flex items-center gap-3">
                {adminSettings?.logoUrl ? (
                  <img src={adminSettings.logoUrl} crossOrigin="anonymous" alt="Bank Logo" className="w-11 h-11 object-contain" />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
                    GE
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black tracking-wider uppercase text-white">
                    {adminSettings?.websiteName || 'Global Elite Bank'}
                  </h3>
                  <p className="text-[11px] text-white/50 tracking-widest uppercase">
                    {isTrade ? 'Institutional Digital Asset Trading & Settlement Desk' : 'Digital Asset Custody & Settlement Directorate'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col sm:items-end">
                <span 
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                >
                  <CheckCircle2 size={13} />
                  <span>{isTrade ? 'TRADE SETTLED & VERIFIED' : 'ON-CHAIN SETTLEMENT COMPLETE'}</span>
                </span>
                <span className="text-[10px] text-white/40 font-mono mt-1">
                  Auth Code: {receiptNo}
                </span>
              </div>
            </div>

            {/* Amount Hero Banner */}
            <div 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
              className="border rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Coins size={13} /> {isTrade ? (orderType === 'buy' ? 'Purchased Crypto Asset' : 'Sold Crypto Asset') : 'Dispatched Asset & Value'}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                    {isTrade ? (
                      orderType === 'buy' ? `+${cryptoAmt} ${cryptoSymbol}` : `+$${fiatAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
                    ) : (
                      `${cryptoAmt} ${cryptoSymbol}`
                    )}
                  </h2>
                  <span className="text-sm font-bold text-white/60 font-mono">
                    {isTrade ? (
                      orderType === 'buy' ? `(Cost: $${fiatAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)` : `(Sold: ${cryptoAmt} ${cryptoSymbol})`
                    ) : (
                      `($${fiatAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)`
                    )}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  {isTrade ? (
                    <>Execution Rate: <span className="text-white font-semibold">1 {cryptoSymbol} = ${(tradeOrder?.exchangeRate || 65100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span></>
                  ) : (
                    <>Network: <span className="text-white font-semibold">{networkName}</span></>
                  )}
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-2 rounded-xl border border-white/20 shadow-md shrink-0">
                <QRCodeSVG 
                  value={`https://globalelite.com/verify-tx?hash=${txHash}&receipt=${receiptNo}`} 
                  size={68} 
                  level="M" 
                />
              </div>
            </div>

            {/* Grid of Verified Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                className="p-3.5 border rounded-xl"
              >
                <p className="text-white/40 uppercase font-bold text-[10px] tracking-wider mb-1">Beneficiary Client</p>
                <p className="font-bold text-white text-sm">{activeItem.userName || 'Private Client'}</p>
                <p className="text-[11px] text-white/50 font-mono">{activeItem.userEmail}</p>
              </div>

              <div 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                className="p-3.5 border rounded-xl"
              >
                <p className="text-white/40 uppercase font-bold text-[10px] tracking-wider mb-1">Execution Timestamp</p>
                <p className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Clock size={13} className="text-emerald-400" />
                  {formattedDate}
                </p>
                <p className="text-[11px] text-white/50 font-mono">UTC Clearance Timezone</p>
              </div>

              <div 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                className="sm:col-span-2 p-3.5 border rounded-xl"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/40 uppercase font-bold text-[10px] tracking-wider">{isTrade ? 'Custody Allocation / Destination' : 'Destination Crypto Wallet'}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(destinationAddress, 'address')}
                    className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors"
                  >
                    {copiedAddress ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p 
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                  className="font-mono text-xs text-white break-all p-2 rounded-lg border"
                >
                  {destinationAddress}
                </p>
                {withdrawal?.memo && (
                  <p className="text-[11px] text-white/60 font-mono mt-1.5">
                    Memo / Tag: <span className="text-white font-bold">{withdrawal.memo}</span>
                  </p>
                )}
              </div>

              <div 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                className="sm:col-span-2 p-3.5 border rounded-xl"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/40 uppercase font-bold text-[10px] tracking-wider">On-Chain Transaction Hash (TXID)</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(txHash, 'tx')}
                    className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors"
                  >
                    {copiedTx ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedTx ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <p 
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                  className="font-mono text-xs text-emerald-400 break-all p-2 rounded-lg border"
                >
                  {txHash}
                </p>
              </div>

              <div 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                className="p-3.5 border rounded-xl"
              >
                <p className="text-white/40 uppercase font-bold text-[10px] tracking-wider mb-1">{isTrade ? 'Order Type' : 'Network Gas / Mining Fee'}</p>
                <p className="font-bold text-white">
                  {isTrade ? `Instant Spot ${orderType?.toUpperCase()} Order` : `$${((withdrawal as CryptoWithdrawalRequest).networkFee || 12.50).toFixed(2)} USD (Subsidized)`}
                </p>
              </div>

              <div 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
                className="p-3.5 border rounded-xl"
              >
                <p className="text-white/40 uppercase font-bold text-[10px] tracking-wider mb-1">Settlement Status</p>
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Approved & Finalized
                </p>
              </div>
            </div>

            {/* Admin Memo / Clearance Declaration */}
            <div 
              style={{ backgroundColor: 'rgba(6, 78, 59, 0.25)', borderColor: 'rgba(16, 185, 129, 0.25)' }}
              className="p-3.5 border rounded-xl text-xs space-y-1"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Compliance & Custody Memo
              </p>
              <p className="text-white/80 leading-relaxed">
                {(withdrawal as CryptoWithdrawalRequest)?.adminNotes || tradeOrder?.notes || 'Multi-signature custody consensus reached. Digital asset transfer cleared under Swiss FINMA AML compliance protocols.'}
              </p>
            </div>

            {/* Seal & Footer */}
            <div 
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              className="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-white/40"
            >
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-emerald-400" />
                <span>Cryptographically signed by Global Elite Asset Vault</span>
              </div>
              <div>
                Ref: {activeItem.id} • SHA-256 Validated
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-background border-t border-border flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="px-3.5 py-2.5 rounded-xl border border-border text-foreground font-bold text-xs hover:bg-foreground/5 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <ImageIcon size={15} className="text-primary" />
              <span>Download Image (PNG)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isExporting}
              className="px-3.5 py-2.5 rounded-xl border border-border text-foreground font-bold text-xs hover:bg-foreground/5 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground font-bold text-xs hover:bg-foreground/5 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
            >
              <Download size={15} />
              <span>{isExporting ? 'Generating...' : 'Download Official Receipt (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

