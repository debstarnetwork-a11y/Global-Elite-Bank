import { Download, Printer, Share2, Image as ImageIcon } from 'lucide-react';
import { useBank } from '../store';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

export interface TransactionDetails {
  reference: string;
  date: string;
  rawDate?: string | number | Date;
  type?: string;
  rawType?: string;
  logoUrl?: string;
  sender: {
    name: string;
    account: string;
    bank?: string;
    iban: string;
    country?: string;
  };
  recipient: {
    name: string;
    account: string;
    bank: string;
    country: string;
    remarks?: string;
  };
  amount: number;
  currency: string;
  exchangeRate?: number;
  fee: number;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING';
}

import { X } from 'lucide-react';

interface TransferSlipProps {
  onClose?: () => void;
  transaction?: TransactionDetails;
}

// English words representation of numbers
const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

function integerToWords(num: number): string {
  if (num === 0) return 'zero';

  function convertChunk(n: number): string {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)];
      if (n % 10 > 0) {
        str += '-' + units[n % 10];
      }
      str += ' ';
    } else if (n > 0) {
      str += units[n] + ' ';
    }
    return str.trim();
  }

  const wordParts: string[] = [];
  let scaleIndex = 0;
  let remaining = Math.floor(Math.abs(num));

  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk > 0) {
      const chunkStr = convertChunk(chunk);
      const scale = scales[scaleIndex];
      wordParts.unshift(scale ? `${chunkStr} ${scale}` : chunkStr);
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex++;
  }

  return wordParts.join(' ').trim();
}

export function numberToWords(amount: number, currency: string = 'USD'): string {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Zero dollars ONLY';
  const absAmount = Math.abs(amount);
  const dollars = Math.floor(absAmount);
  const cents = Math.round((absAmount - dollars) * 100);

  const dollarsWord = integerToWords(dollars);

  let currName = 'dollars';
  let centName = 'cents';
  const cleanCurr = (currency || 'USD').toUpperCase().replace('$', 'USD');

  if (cleanCurr === 'USD') {
    currName = dollars === 1 ? 'dollar' : 'dollars';
    centName = cents === 1 ? 'cent' : 'cents';
  } else if (cleanCurr === 'CHF') {
    currName = dollars === 1 ? 'Swiss franc' : 'Swiss francs';
    centName = cents === 1 ? 'rappen' : 'rappen';
  } else if (cleanCurr === 'EUR' || cleanCurr === '€') {
    currName = dollars === 1 ? 'euro' : 'euros';
    centName = cents === 1 ? 'cent' : 'cents';
  } else if (cleanCurr === 'GBP' || cleanCurr === '£') {
    currName = dollars === 1 ? 'pound' : 'pounds';
    centName = cents === 1 ? 'pence' : 'pence';
  }

  let result = `${dollarsWord} ${currName}`;
  if (cents > 0) {
    const centsWord = integerToWords(cents);
    result += ` and ${centsWord} ${centName}`;
  }

  // Capitalize initial letter and suffix ONLY as requested: "One thousand dollars ONLY"
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return `${result} ONLY`;
}

export function maskAccountNumber(account: string | undefined | null): string {
  if (!account) return '**** **** **** 0000';
  const digits = account.replace(/\D/g, '');
  if (digits.length >= 4) {
    return '**** **** **** ' + digits.slice(-4);
  }
  const clean = account.replace(/[^a-zA-Z0-9]/g, '');
  if (clean.length >= 4) {
    return '**** **** **** ' + clean.slice(-4);
  }
  return '**** **** **** ' + (clean.padStart(4, '0'));
}

export function getSwissTime(dateInput?: string | number | Date): { date: string; time: string; timeZone: string } {
  let targetDate: Date;
  if (!dateInput) {
    targetDate = new Date();
  } else if (dateInput instanceof Date) {
    targetDate = isNaN(dateInput.getTime()) ? new Date() : dateInput;
  } else {
    const parsed = new Date(dateInput);
    targetDate = isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  // Real date in Switzerland (Europe/Zurich)
  const dateFormatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zurich',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(targetDate).toUpperCase(); // e.g. "10 SEP 2026"

  // Real time and timezone in Switzerland (Europe/Zurich)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zurich',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  }).formatToParts(targetDate);

  const hour = parts.find(p => p.type === 'hour')?.value || '00';
  const min = parts.find(p => p.type === 'minute')?.value || '00';
  const sec = parts.find(p => p.type === 'second')?.value || '00';
  let tz = parts.find(p => p.type === 'timeZoneName')?.value || 'CEST';

  // Normalize to standard Swiss timezone designation (CEST/CET)
  if (tz.includes('GMT+2') || tz.includes('UTC+2')) {
    tz = 'CEST';
  } else if (tz.includes('GMT+1') || tz.includes('UTC+1')) {
    tz = 'CET';
  }

  return {
    date: dateFormatted,
    time: `${hour}:${min}:${sec} ${tz}`,
    timeZone: tz
  };
}

function generateHash(reference: string): string {
  return `0x${Array.from(reference).reduce(
    (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
    0
  ).toString(16)}`;
}

const defaultTransaction: TransactionDetails = {
  reference: "GEB-2024-X892M",
  date: new Date().toISOString(),
  rawDate: new Date().toISOString(),
  type: "TRANSACTION",
  rawType: "transfer_wire",
  sender: {
    name: "Client Name",
    account: "**** **** **** 8888",
    bank: 'Global Elite Bank',
    iban: "CH93 **** **** **** 8888",
    country: "Switzerland",
  },
  recipient: {
    name: "WHO Foundation",
    account: "**** **** **** 4321",
    bank: "Global Swiss Bank",
    country: "Switzerland",
  },
  amount: 15000000,
  currency: "$",
  fee: 0,
  status: 'COMPLETED'
};

export function TransferSlip({ transaction: propTransaction, onClose }: TransferSlipProps) {
  const { transactions, currentUser, adminSettings } = useBank();
  
  const latestTx = transactions.find(t => t.userId === currentUser?.id && t.status === 'completed') || (transactions.length > 0 ? transactions[0] : null);
  
  const transaction = propTransaction || (latestTx && currentUser ? {
    reference: latestTx.id,
    date: latestTx.date,
    rawDate: latestTx.date,
    type: 'TRANSACTION',
    rawType: latestTx.type,
    sender: {
      name: currentUser.name,
      account: maskAccountNumber(currentUser.accounts[0]?.accountNumber || ''),
      bank: adminSettings?.websiteName || 'Global Elite Bank',
      iban: maskAccountNumber(currentUser.accounts[0]?.iban || ''),
      country: "Switzerland"
    },
    recipient: {
      name: latestTx.recipientDetails?.name || 'Verified Beneficiary',
      account: maskAccountNumber(latestTx.recipientDetails?.account || ''),
      bank: latestTx.recipientDetails?.bank || adminSettings?.websiteName || 'Global Elite Bank',
      country: latestTx.recipientDetails?.country || 'Switzerland',
      remarks: latestTx.recipientDetails?.remarks || ''
    },
    amount: latestTx.amount,
    currency: '$',
    fee: 0,
    status: latestTx.status.toUpperCase() as any
  } as TransactionDetails : defaultTransaction);

  const amountInWords = numberToWords(transaction.amount, transaction.currency);
  const verificationHash = generateHash(transaction.reference);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Keep time zone and time tallying with Switzerland's real current time
  const [swissClock, setSwissClock] = useState(() => getSwissTime(transaction.rawDate || transaction.date));

  useEffect(() => {
    // If viewing the general Receipts view or if live, tick every second to tally with Switzerland real time
    const isHistorical = Boolean(transaction.rawDate && !isNaN(new Date(transaction.rawDate).getTime()));
    if (!isHistorical) {
      const interval = setInterval(() => {
        setSwissClock(getSwissTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [transaction.rawDate]);

  // Generate random IDs that stay consistent during the component's lifecycle
  const { transactionNo, sessionId, senderIban } = useMemo(() => {
    return {
      transactionNo: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      sessionId: `GEB-${Math.floor(10000000 + Math.random() * 90000000).toString()}`,
      senderIban: Math.floor(100000000 + Math.random() * 900000000).toString()
    };
  }, []);

  const downloadPDF = async () => {
    if (receiptRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(receiptRef.current, { pixelRatio: 2 });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`GEB_Transaction_${transactionNo}.pdf`);
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      }
    }
  };

  const downloadImage = async () => {
    if (receiptRef.current) {
      try {
        const image = await htmlToImage.toPng(receiptRef.current, { pixelRatio: 2 });
        const link = document.createElement('a');
        link.href = image;
        link.download = `GEB_Transaction_${transactionNo}.png`;
        link.click();
      } catch (error) {
        console.error('Failed to generate image:', error);
      }
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const content = (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaction Receipt</h2>
          <p className="text-sm text-foreground/50">Official transaction records</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={printReceipt} className="flex items-center space-x-2 bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
            <Printer size={16} /> <span className="hidden sm:inline">Print</span>
          </button>
          <button onClick={downloadImage} className="flex items-center space-x-2 bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
            <ImageIcon size={16} /> <span className="hidden sm:inline">Image</span>
          </button>
          <button onClick={downloadPDF} className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
            <Download size={16} /> <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white text-black p-2 md:p-8 rounded-xl overflow-x-auto shadow-2xl">
        <div ref={receiptRef} className="transfer-slip min-w-[700px] p-6 bg-[#ffffff] relative">
          <div className="security-pattern absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="slip-header flex justify-between items-start pb-6 relative z-10">
            <div className="w-1/3">
              {transaction.logoUrl ? (
                <img src={transaction.logoUrl} alt="Bank Logo" className="h-10 object-contain mb-2" />
              ) : (
                <img src="https://i.ibb.co/G3NmLY1j/GEB-logo.png" alt="GEB Logo" className="w-12 h-12 object-contain mb-2" />
              )}
              <p className="mt-2 text-sm font-bold text-[#166534]">GLOBAL ELITE BANK</p>
              <p className="text-xs text-[#4b5563]">International Banking Excellence</p>
            </div>
            
            <div className="w-1/3 text-center flex flex-col items-center justify-center">
              <p className="text-4xl font-extrabold text-[#15803d] tracking-tight">
                {transaction.currency}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div 
                className="inline-block mt-2 text-[#000000] font-bold text-xl uppercase tracking-widest"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Successful
              </div>
            </div>

            <div className="w-1/3 text-right text-[#000000]">
              <p className="text-sm font-bold text-[#1f2937]">DATE: {swissClock.date}</p>
              <p className="text-xs font-mono font-bold text-[#15803d] mb-2">TIME: {swissClock.time}</p>
              <div className="space-y-1 mt-3">
                <p className="text-[10px] font-bold text-[#6b7280] uppercase">Transaction No</p>
                <p className="text-xs font-mono font-bold bg-[#f3f4f6] text-[#000000] px-2 py-1 inline-block border border-[#d1d5db]">{transactionNo}</p>
                <p className="text-[10px] font-bold text-[#6b7280] uppercase mt-1">Session ID</p>
                <p className="text-xs font-mono font-bold bg-[#f3f4f6] text-[#000000] px-2 py-1 inline-block border border-[#d1d5db]">{sessionId}</p>
              </div>
            </div>
          </div>

          <h2 className="text-center text-xl font-bold text-[#15803d] mb-6 tracking-widest border-b border-[#22c55e] pb-2 relative z-10">
            OFFICIAL {transaction.type || 'TRANSACTION'} RECEIPT
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8 relative z-10 text-[#000000]">
            <div className="border-2 border-[#bbf7d0] rounded-lg p-4" style={{ backgroundColor: 'rgba(240, 253, 244, 0.5)' }}>
              <h3 className="font-bold text-[#15803d] mb-4 border-b border-[#bbf7d0] pb-2">SENDER DETAILS</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Name:</span> {transaction.sender.name}</p>
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Account:</span> {maskAccountNumber(transaction.sender.account)}</p>
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Bank:</span> {transaction.sender.bank || adminSettings?.websiteName || 'Global Elite Bank'}</p>
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">IBAN:</span> {maskAccountNumber(transaction.sender.iban || ('CH93' + senderIban))}</p>
              </div>
            </div>
            <div className="border-2 border-[#bbf7d0] rounded-lg p-4" style={{ backgroundColor: 'rgba(240, 253, 244, 0.5)' }}>
              <h3 className="font-bold text-[#15803d] mb-4 border-b border-[#bbf7d0] pb-2">RECIPIENT DETAILS</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Name:</span> {transaction.recipient.name}</p>
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Account:</span> {maskAccountNumber(transaction.recipient.account)}</p>
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Bank:</span> {transaction.recipient.bank}</p>
                {transaction.rawType === 'transfer_wire' && transaction.recipient.country && (
                  <p><span className="font-semibold text-[#4b5563] inline-block w-20">Country:</span> {transaction.recipient.country}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end mb-4 border-b border-[#e5e7eb] pb-8 relative z-10 text-[#000000]">
            <div className="text-sm space-y-2">
              <p className="italic text-sm text-[#4b5563] mb-4">Amount in words: {amountInWords}</p>
              <p className="flex items-center gap-2 font-bold text-[#000000]">
                <span className="text-[#6b7280] w-24 inline-block">STATUS:</span> 
                <span className="text-[#16a34a]">✅ {transaction.status} & VERIFIED</span>
              </p>
              <p className="flex items-center gap-2 text-xs font-mono text-[#000000]">
                <span className="text-[#6b7280] font-sans font-bold w-24 inline-block">REF:</span> 
                {transaction.reference}
              </p>
              <p className="flex items-center gap-2 text-xs font-mono text-[#000000]">
                <span className="text-[#6b7280] font-sans font-bold w-24 inline-block">HASH:</span> 
                {verificationHash}
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="bg-[#ffffff] p-2 rounded-lg border-2 border-[#f3f4f6] shadow-sm">
                <QRCodeSVG 
                  value={`https://verify.globalelitebank.com/${transaction.reference}?t=${transactionNo}`}
                  size={80}
                  level="H"
                  fgColor="#059669"
                />
              </div>
              <div className="slip-stamp border-[3px] border-[#15803d] rounded-full w-24 h-24 flex flex-col items-center justify-center text-[#15803d] rotate-[-15deg]" style={{ opacity: 0.8 }}>
                <span className="font-black text-sm tracking-wider">VERIFIED</span>
                <span className="text-[8px] font-bold mt-0.5">GEB SECURE</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-center mt-6 text-[#6b7280] relative z-10">
            This is a system-generated receipt. Verify authenticity via blockchain QR code or contact <br/>
            <span className="font-bold text-[#000000]">verify@globalelitebank.com</span>
          </p>
        </div>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
        <div className="bg-background border border-border rounded-2xl shadow-2xl relative w-full max-w-5xl my-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground z-10 bg-card p-2 rounded-full border border-border">
            <X size={20} />
          </button>
          <div className="p-4 sm:p-8">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}
