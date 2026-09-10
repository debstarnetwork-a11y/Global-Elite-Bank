import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState } from 'react';

const monthlyData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 38000 },
  { name: 'Mar', value: 52000 },
  { name: 'Apr', value: 49000 },
  { name: 'May', value: 65000 },
  { name: 'Jun', value: 58000 },
  { name: 'Jul', value: 72000 },
];

const weeklyData = [
  { name: 'Mon', value: 2500 },
  { name: 'Tue', value: 4200 },
  { name: 'Wed', value: 3100 },
  { name: 'Thu', value: 8500 },
  { name: 'Fri', value: 6200 },
  { name: 'Sat', value: 12500 },
  { name: 'Sun', value: 4800 },
];

export function SpendingChart() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const data = period === 'monthly' ? monthlyData : weeklyData;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-foreground/50">Global Spending Analytics</h3>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
              period === 'weekly' ? 'bg-primary text-white shadow-md' : 'bg-border text-foreground/50 hover:text-foreground'
            }`}
          >
            1W
          </button>
          <button 
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
              period === 'monthly' ? 'bg-primary text-white shadow-md' : 'bg-border text-foreground/50 hover:text-foreground'
            }`}
          >
            1M
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
              tickFormatter={(val) => `$${val/1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: 'var(--foreground)' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spent']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
