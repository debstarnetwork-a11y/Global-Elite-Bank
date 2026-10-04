import re

with open('src/components/CurrencyConverter.tsx', 'r') as f:
    content = f.read()

replacement = """
export function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    calculateExchange();
  }, [amount, baseCurrency, toCurrency]);

  const calculateExchange = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const numAmount = parseFloat(amount) || 0;
      const amountInUSD = numAmount / EXCHANGE_RATES[baseCurrency];
      const converted = amountInUSD * EXCHANGE_RATES[toCurrency];
      setResult(converted);
      setIsCalculating(false);
    }, 400); // Simulate network delay for real-time feel
  };

  const swapCurrencies = () => {
    setBaseCurrency(toCurrency);
    setToCurrency(baseCurrency);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Real-Time FX Converter</h3>
        
        <div className="flex bg-background border border-border rounded-lg p-1">
          {['USD', 'EUR', 'GBP'].map(curr => (
            <button
              key={curr}
              onClick={() => setBaseCurrency(curr)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${baseCurrency === curr ? 'bg-card border border-border text-primary shadow-sm' : 'text-foreground/50 hover:text-foreground'}`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full flex-1">
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Send</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-4 text-lg font-bold focus:border-primary outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-foreground pointer-events-none">
                {baseCurrency}
              </span>
            </div>
          </div>
          
          <button 
            onClick={swapCurrencies}
            className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary/50 transition-colors mt-6 shrink-0 group"
          >
            <RefreshCcw size={16} className="text-foreground/50 group-hover:text-primary transition-colors" />
          </button>
          
          <div className="w-full flex-1">
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Receive</label>
            <div className="relative">
              <div className="w-full bg-background border border-border rounded-xl p-4 text-lg font-bold min-h-[60px] flex items-center">
                {isCalculating ? (
                  <span className="text-foreground/30">Calculating...</span>
                ) : (
                  <span>{result ? result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
                )}
              </div>
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent font-bold text-foreground outline-none appearance-none cursor-pointer pr-4"
              >
                {Object.keys(EXCHANGE_RATES).filter(c => c !== baseCurrency).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        {result && !isCalculating && (
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <p className="text-xs text-foreground/50 font-medium">
              1 {baseCurrency} = {(EXCHANGE_RATES[toCurrency] / EXCHANGE_RATES[baseCurrency]).toFixed(4)} {toCurrency}
            </p>
            <button className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              Initiate Transfer <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
"""

content = re.sub(r'export function CurrencyConverter\(\) \{[\s\S]*', replacement, content)

with open('src/components/CurrencyConverter.tsx', 'w') as f:
    f.write(content)
