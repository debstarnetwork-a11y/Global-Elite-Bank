import re

with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

# Replace getNextStep
old_get_next_step = """  const getNextStep = (current: string | number): string | number => {
    if (type !== 'wire') return 3;
    const seq = ['code1', 'code2', 'code3', 'code4', 'code5'];
    const enabled = seq.filter(code => {
       if (code === 'code1') return adminSettings.requireCode1;
       if (code === 'code2') return adminSettings.requireCode2;
       if (code === 'code3') return adminSettings.requireCode3;
       if (code === 'code4') return adminSettings.requireCode4;
       if (code === 'code5') return adminSettings.requireCode5;
       return false;
    });
    
    if (current === 1 || current === 'preview') return enabled.length > 0 ? enabled[0] : 3;
    
    const idx = enabled.indexOf(current as string);
    if (idx === -1 || idx === enabled.length - 1) return 3;
    return enabled[idx + 1];
  };"""

new_get_next_step = """  const getNextStep = (current: string | number): string | number => {
    const seq = ['code1', 'code2', 'code3', 'code4', 'code5'];
    const enabled = seq.filter(code => {
       if (code === 'code1') return adminSettings.requireCode1;
       if (code === 'code2') return adminSettings.requireCode2;
       if (code === 'code3') return adminSettings.requireCode3;
       if (code === 'code4') return adminSettings.requireCode4;
       if (code === 'code5') return adminSettings.requireCode5;
       return false;
    });

    if (current === 1 || current === 'preview') return 'pin';
    
    if (current === 'pin') {
        if (type === 'wire' && enabled.length > 0) return enabled[0];
        return 'success';
    }

    if (type !== 'wire') return 'success';

    const idx = enabled.indexOf(current as string);
    if (idx === -1 || idx === enabled.length - 1) return 'success';
    return enabled[idx + 1];
  };"""
content = content.replace(old_get_next_step, new_get_next_step)

# Replace getPrevStep
old_get_prev_step = """  const getPrevStep = (current: string | number): string | number => {
    if (current === 'preview') return 1;
    if (type !== 'wire') {
      if (current === 3) return 'preview';
      return 1;
    }
    const seq = ['code1', 'code2', 'code3', 'code4', 'code5'];
    const enabled = seq.filter(code => {
       if (code === 'code1') return adminSettings.requireCode1;
       if (code === 'code2') return adminSettings.requireCode2;
       if (code === 'code3') return adminSettings.requireCode3;
       if (code === 'code4') return adminSettings.requireCode4;
       if (code === 'code5') return adminSettings.requireCode5;
       return false;
    });
    
    if (current === 3) return enabled.length > 0 ? enabled[enabled.length - 1] : 'preview';
    
    const idx = enabled.indexOf(current as string);
    if (idx <= 0) return 'preview';
    return enabled[idx - 1];
  };"""

new_get_prev_step = """  const getPrevStep = (current: string | number): string | number => {
    if (current === 'preview') return 1;
    if (current === 'pin') return 'preview';
    if (current === 'success') return 'pin'; // Not really used if we don't allow back from success

    const seq = ['code1', 'code2', 'code3', 'code4', 'code5'];
    const enabled = seq.filter(code => {
       if (code === 'code1') return adminSettings.requireCode1;
       if (code === 'code2') return adminSettings.requireCode2;
       if (code === 'code3') return adminSettings.requireCode3;
       if (code === 'code4') return adminSettings.requireCode4;
       if (code === 'code5') return adminSettings.requireCode5;
       return false;
    });
    
    if (type !== 'wire' || enabled.length === 0) return 'pin';

    const idx = enabled.indexOf(current as string);
    if (idx <= 0) return 'pin';
    return enabled[idx - 1];
  };"""
content = content.replace(old_get_prev_step, new_get_prev_step)


# Replace handleTransfer (now called verifyPin)
old_handle_transfer = """  const handleTransfer = () => {
    if (!account) return;
    if (pin !== account.pin) {
      setError('Invalid transaction PIN.');
      return;
    }
    
    createTransaction({
      userId: currentUser.id,
      accountId: account.id,
      type: type === 'wire' ? 'transfer_wire' : type === 'local' ? 'transfer_local' : 'transfer_internal',
      amount: Number(amount),
      recipientDetails: recipient
    });
    
    onClose();
    if (onSuccess) onSuccess();
  };"""

new_verify_pin = """  const verifyPin = () => {
    if (!account) return;
    if (pin !== account.pin) {
      setError('Invalid transaction PIN.');
      return;
    }
    setError('');
    
    const next = getNextStep('pin');
    setStep(next);

    // If there are no more steps (i.e. local/internal), we execute the transfer now
    if (next === 'success') {
      executeTransfer();
    }
  };

  const executeTransfer = () => {
    createTransaction({
      userId: currentUser.id,
      accountId: account.id,
      type: type === 'wire' ? 'transfer_wire' : type === 'local' ? 'transfer_local' : 'transfer_internal',
      amount: Number(amount),
      status: 'completed',
      recipientDetails: recipient
    });
  };

  const handleVerifySingleCode = (codeName: string) => {
    if (!account) return;
    const codeMap: Record<string, keyof typeof account.codes> = {
      'code1': 'cot',
      'code2': 'swift',
      'code3': 'imf',
      'code4': 'tax',
      'code5': 'aml'
    };
    const accountCodeKey = codeMap[codeName];
    const actualCode = account.codes[accountCodeKey];
    
    if (currentCodeInput !== actualCode) {
      const codeDisplayName = adminSettings[((codeName + 'Name') as keyof typeof adminSettings)] as string || codeName.toUpperCase();
      setError(`Invalid ${codeDisplayName} code. Please contact your account manager.`);
      return;
    }
    
    setError('');
    setCurrentCodeInput('');
    const next = getNextStep(codeName);
    setStep(next);
    
    if (next === 'success') {
      executeTransfer();
    }
  };"""
content = content.replace(old_handle_transfer, new_verify_pin)

# Also fix the old verifySingleCode block, we need to remove it or replace it since we just defined handleVerifySingleCode
content = re.sub(r"  const verifySingleCode = \(codeName: string\) => \{.*?setStep\(getNextStep\(codeName\)\);\n  \};", "", content, flags=re.DOTALL)

with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)

print("Flow updated in TransferForm")
