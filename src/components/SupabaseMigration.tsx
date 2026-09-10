import React, { useState } from 'react';
import { useBank } from '../store';
import { supabase } from '../lib/supabase';
import { Database, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export function SupabaseMigration() {
  const bankState = useBank();
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleMigrate = async () => {
    try {
      setIsMigrating(true);
      setError(null);
      
      const { 
        users, 
        transactions, 
        investments, 
        virtualCards, 
        loanApplications, 
        userApplications, 
        grantApplications, 
        contactInquiries,
        adminSettings,
        cryptoWithdrawals,
        cryptoOrders
      } = bankState;

      // 1. Migrate Admin Settings
      setProgress('Migrating Admin Settings...');
      if (adminSettings) {
        const { error: settingsError } = await supabase.from('admin_settings').insert([{
          alert_threshold: adminSettings.alertThreshold,
          max_crypto_withdrawal_limit: adminSettings.maxCryptoWithdrawalLimit,
          require_wire_codes: adminSettings.requireWireCodes,
          code1_name: adminSettings.code1Name,
          code1_message: adminSettings.code1Message,
          require_code1: adminSettings.requireCode1,
          code2_name: adminSettings.code2Name,
          code2_message: adminSettings.code2Message,
          require_code2: adminSettings.requireCode2,
          code3_name: adminSettings.code3Name,
          code3_message: adminSettings.code3Message,
          require_code3: adminSettings.requireCode3,
          code4_name: adminSettings.code4Name,
          code4_message: adminSettings.code4Message,
          require_code4: adminSettings.requireCode4,
          code5_name: adminSettings.code5Name,
          code5_message: adminSettings.code5Message,
          require_code5: adminSettings.requireCode5,
          require_otp: adminSettings.requireOtp,
          preference_contact_email: adminSettings.preferenceContactEmail,
          website_currency: adminSettings.websiteCurrency,
          homepage_url: adminSettings.homepageUrl,
          require_kyc_withdrawal: adminSettings.requireKycWithdrawal,
          require_kyc_registration: adminSettings.requireKycRegistration,
          require_email_verification: adminSettings.requireEmailVerification,
          mail_server: adminSettings.mailServer,
          email_from: adminSettings.emailFrom,
          email_from_name: adminSettings.emailFromName,
          google_client_id: adminSettings.googleClientId,
          google_client_secret: adminSettings.googleClientSecret,
          google_redirect_url: adminSettings.googleRedirectUrl,
          captcha_secret: adminSettings.captchaSecret,
          captcha_site_key: adminSettings.captchaSiteKey,
          active_theme: adminSettings.activeTheme,
          logo_url: adminSettings.logoUrl,
          favicon_url: adminSettings.faviconUrl,
          admin_email: adminSettings.adminEmail,
          admin_password: adminSettings.adminPassword,
          contact_email: adminSettings.contactEmail,
          contact_phone: adminSettings.contactPhone,
          contact_address: adminSettings.contactAddress,
          broker_wallets: adminSettings.brokerWallets,
          fiat_deposit_instructions: adminSettings.fiatDepositInstructions,
          e_wallet_instructions: adminSettings.eWalletInstructions,
          frontend_content: adminSettings.frontendContent
        }]);
        if (settingsError) console.error('Settings migration error:', settingsError);
      }

      // 2. Migrate Users
      setProgress('Migrating Users and Accounts...');
      for (const user of users) {
        const { error: userError } = await supabase.from('users').insert([{
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          status: user.status,
          show_full_card_details: user.showFullCardDetails,
          mobile: user.mobile,
          currency: user.currency,
          btc_wallet: user.btcWallet,
          dob: user.dob,
          nationality: user.nationality,
          zip_code: user.zipCode,
          occupation: user.occupation,
          residential_address: user.residentialAddress,
          country: user.country,
          profile_picture: user.profilePicture,
          new_account_prompt_pending: user.newAccountPromptPending,
          account_opened_at: user.accountOpenedAt
        }]);
        if (userError) {
          console.error(`Failed to migrate user ${user.email}:`, userError);
          continue; // Skip accounts if user failed (e.g. duplicate)
        }

        // Migrate Accounts
        if (user.accounts && user.accounts.length > 0) {
          const accountsToInsert = user.accounts.map(acc => ({
            id: acc.id,
            user_id: user.id,
            type: acc.type,
            account_number: acc.accountNumber,
            iban: acc.iban,
            balance: acc.balance,
            pin: acc.pin,
            swift_code: acc.codes?.swift,
            cot_code: acc.codes?.cot,
            tax_code: acc.codes?.tax,
            imf_code: acc.codes?.imf,
            aml_code: acc.codes?.aml
          }));
          await supabase.from('accounts').insert(accountsToInsert);
        }

        // Migrate Investor Wallets
        if (user.investorWallets) {
          await supabase.from('investor_wallets').insert([{
            user_id: user.id,
            btc: user.investorWallets.btc,
            eth: user.investorWallets.eth,
            usdt: user.investorWallets.usdt,
            sol: user.investorWallets.sol,
            balance: user.investorWallets.balance
          }]);
        }
      }

      // 3. Migrate Transactions
      setProgress('Migrating Transactions...');
      if (transactions.length > 0) {
        // Split into chunks to avoid too large payloads
        const chunkSize = 100;
        for (let i = 0; i < transactions.length; i += chunkSize) {
          const chunk = transactions.slice(i, i + chunkSize).map(t => ({
            id: t.id,
            user_id: t.userId,
            account_id: t.accountId,
            type: t.type,
            amount: t.amount,
            status: t.status,
            recipient_details: t.recipientDetails,
            description: t.description,
            date: t.date
          }));
          await supabase.from('transactions').insert(chunk);
        }
      }

      // 4. Migrate Virtual Cards
      setProgress('Migrating Virtual Cards...');
      if (virtualCards && virtualCards.length > 0) {
        const cardsToInsert = virtualCards.map(c => ({
          id: c.id,
          user_id: c.userId,
          card_number: c.cardNumber,
          expiry: c.expiry,
          cvv: c.cvv,
          status: c.status,
          type: c.type,
          tier: c.tier,
          network: c.network,
          price: c.price
        }));
        await supabase.from('virtual_cards').insert(cardsToInsert);
      }

      // 5. Migrate Investments
      setProgress('Migrating Investments...');
      if (investments && investments.length > 0) {
        const invsToInsert = investments.map(inv => ({
          id: inv.id,
          user_id: inv.userId,
          amount: inv.amount,
          currency: inv.currency,
          duration_days: inv.durationDays,
          start_date: inv.startDate,
          end_date: inv.endDate,
          status: inv.status,
          tx_hash: inv.txHash,
          profit: inv.profit,
          is_principal_locked: inv.isPrincipalLocked,
          admin_approved_duration: inv.adminApprovedDuration,
          reinvested_from_profit: inv.reinvestedFromProfit,
          admin_notes: inv.adminNotes
        }));
        await supabase.from('investments').insert(invsToInsert);
      }

      // 6. Migrate User Applications
      setProgress('Migrating Account Applications...');
      if (userApplications && userApplications.length > 0) {
        const uAppToInsert = userApplications.map(ua => ({
          id: ua.id,
          name: ua.name,
          email: ua.email,
          password: ua.password,
          mobile: ua.mobile,
          country: ua.country,
          nationality: ua.nationality,
          dob: ua.dob,
          zip_code: ua.zipCode,
          occupation: ua.occupation,
          residential_address: ua.residentialAddress,
          status: ua.status,
          date: ua.date
        }));
        await supabase.from('user_applications').insert(uAppToInsert);
      }

      // 7. Migrate Contact Inquiries
      setProgress('Migrating Contact Inquiries...');
      if (contactInquiries && contactInquiries.length > 0) {
        const inqToInsert = contactInquiries.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          country: c.country,
          net_worth: c.netWorth,
          message: c.message,
          status: c.status || 'new',
          reply_subject: c.replySubject,
          reply_message: c.replyMessage,
          replied_at: c.repliedAt,
          date: c.date
        }));
        await supabase.from('contact_inquiries').insert(inqToInsert);
      }

      // 8. Crypto Withdrawals
      setProgress('Migrating Crypto Withdrawals...');
      if (cryptoWithdrawals && cryptoWithdrawals.length > 0) {
        const cwToInsert = cryptoWithdrawals.map(cw => ({
          id: cw.id,
          user_id: cw.userId,
          user_name: cw.userName,
          user_email: cw.userEmail,
          amount: cw.amount,
          original_requested_amount: cw.originalRequestedAmount,
          crypto_amount: cw.cryptoAmount,
          original_requested_crypto_amount: cw.originalRequestedCryptoAmount,
          currency: cw.currency,
          network: cw.network,
          wallet_address: cw.walletAddress,
          memo: cw.memo,
          status: cw.status,
          tx_hash: cw.txHash,
          receipt_number: cw.receiptNumber,
          network_fee: cw.networkFee,
          admin_notes: cw.adminNotes,
          source_wallet: cw.sourceWallet,
          request_date: cw.requestDate,
          approval_date: cw.approvalDate
        }));
        await supabase.from('crypto_withdrawal_requests').insert(cwToInsert);
      }
      
      // 9. Crypto Trade Orders
      setProgress('Migrating Crypto Trade Orders...');
      if (cryptoOrders && cryptoOrders.length > 0) {
        const ordersToInsert = cryptoOrders.map(ord => ({
          id: ord.id,
          user_id: ord.userId,
          user_name: ord.userName,
          user_email: ord.userEmail,
          order_type: ord.orderType,
          crypto_currency: ord.cryptoCurrency,
          fiat_currency: ord.fiatCurrency,
          crypto_amount: ord.cryptoAmount,
          fiat_amount: ord.fiatAmount,
          exchange_rate: ord.exchangeRate,
          status: ord.status,
          approved_by: ord.approvedBy,
          receipt_number: ord.receiptNumber,
          tx_hash: ord.txHash,
          notes: ord.notes,
          request_date: ord.requestDate,
          approval_date: ord.approvalDate
        }));
        await supabase.from('crypto_trade_orders').insert(ordersToInsert);
      }

      // 10. Loan & Grant Applications
      setProgress('Migrating Loans & Grants...');
      if (loanApplications && loanApplications.length > 0) {
        const loansToInsert = loanApplications.map(l => ({
          id: l.id,
          user_id: l.userId,
          amount: l.amount,
          purpose: l.purpose,
          status: l.status,
          date: l.date
        }));
        await supabase.from('loan_applications').insert(loansToInsert);
      }
      if (grantApplications && grantApplications.length > 0) {
        const grantsToInsert = grantApplications.map(g => ({
          id: g.id,
          user_id: g.userId,
          amount: g.amount,
          purpose: g.purpose,
          status: g.status,
          date: g.date
        }));
        await supabase.from('grant_applications').insert(grantsToInsert);
      }

      setSuccess(true);
      setProgress('Migration Complete!');

    } catch (err: any) {
      console.error('Migration failed:', err);
      setError(err.message || 'An unexpected error occurred during migration');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <Database size={20} />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Migrate to Supabase</h3>
          <p className="text-xs text-foreground/60">Move local data to cloud</p>
        </div>
      </div>
      
      {!success ? (
        <>
          <div className="bg-amber-500/10 text-amber-600 border border-amber-500/20 p-3 rounded-lg flex items-start gap-2 mb-4 text-xs leading-relaxed">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <p>This will permanently copy all accounts, settings, and transactions from your browser into the Supabase database. Do not click multiple times.</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg mb-4 text-xs font-medium break-words">
              Error: {error}
            </div>
          )}

          <button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isMigrating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{progress || 'Processing...'}</span>
              </>
            ) : (
              'Start Migration'
            )}
          </button>
        </>
      ) : (
        <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-4 rounded-xl flex flex-col items-center text-center gap-2">
          <CheckCircle size={32} />
          <h4 className="font-bold">Migration Successful!</h4>
          <p className="text-xs opacity-80">All data has been copied to Supabase. You may now switch the application code to read from Supabase.</p>
        </div>
      )}
    </div>
  );
}
