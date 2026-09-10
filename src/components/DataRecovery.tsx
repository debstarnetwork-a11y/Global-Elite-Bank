import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { camelToSnake } from '../lib/casing';
import { Database, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export function DataRecovery() {
  const [hasLocalData, setHasLocalData] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const users = window.localStorage.getItem('bank_users');
    if (users && JSON.parse(users).length > 1) { // more than just default admin
      setHasLocalData(true);
    }
  }, []);

  const handleRecover = async () => {
    try {
      setIsMigrating(true);
      
      const getLocal = (key: string) => {
        try { return JSON.parse(window.localStorage.getItem(key) || '[]'); } catch { return []; }
      };

      const users = getLocal('bank_users');
      const txns = getLocal('bank_transactions');
      const admin = getLocal('bank_adminSettings');
      // get other arrays if needed

      if (admin && !Array.isArray(admin)) {
        setProgress('Recovering settings...');
        await supabase.from('admin_settings').upsert(camelToSnake(admin));
      }

      if (users.length > 0) {
        setProgress('Recovering users...');
        const flatUsers = users.map((u: any) => {
          const { accounts, investorWallets, ...rest } = u;
          return rest;
        });
        await supabase.from('users').upsert(flatUsers.map(camelToSnake));

        setProgress('Recovering accounts...');
        const flatAccounts = users.flatMap((u: any) => (u.accounts || []).map((a: any) => ({ ...a, userId: u.id })));
        if (flatAccounts.length > 0) {
          await supabase.from('accounts').upsert(flatAccounts.map(camelToSnake));
        }
      }

      if (txns.length > 0) {
        setProgress('Recovering transactions...');
        const chunkSize = 100;
        for (let i = 0; i < txns.length; i += chunkSize) {
          const chunk = txns.slice(i, i + chunkSize);
          await supabase.from('transactions').upsert(chunk.map(camelToSnake));
        }
      }

      setProgress('Recovery Complete! Refreshing...');
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      alert('Recovery Error: ' + err.message);
      setIsMigrating(false);
    }
  };

  if (!hasLocalData || success) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[999] bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Local Data Found</h3>
          <p className="text-xs text-foreground/60">Recover missing data</p>
        </div>
      </div>
      
      <p className="text-xs mb-4">It looks like your old accounts and users are still saved in your browser's local storage. Click below to securely upload them to your new Supabase database.</p>

      <button
        onClick={handleRecover}
        disabled={isMigrating}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isMigrating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{progress}</span>
          </>
        ) : (
          'Recover Data to Supabase'
        )}
      </button>
    </div>
  );
}
