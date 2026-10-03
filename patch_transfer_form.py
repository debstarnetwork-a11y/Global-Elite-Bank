import re

with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

# Fix imports to include ArrowLeft
content = content.replace("import { X, Lock, AlertTriangle, CheckCircle } from 'lucide-react';",
                          "import { X, Lock, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';")

# Update handleNext logic
old_handle_next = """const handleNext = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!account || Number(amount) > account.balance) {
      setError('Insufficient funds.');
      return;
    }
    if (!recipient.name || !recipient.account) {
      setError('Please fill in recipient details.');
      return;
    }
    setError('');
    
    if (type === 'wire') {
       const nextStep = getNextStep(1);
       setStep(nextStep);
       setCurrentCodeInput('');
    } else {
      setStep(3);
    }
  };"""

new_handle_next = """const handleNext = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!account || Number(amount) > account.balance) {
      setError('Insufficient funds.');
      return;
    }
    if (!recipient.name || !recipient.account) {
      setError('Please fill in recipient details.');
      return;
    }
    setError('');
    setStep('preview');
  };"""
content = content.replace(old_handle_next, new_handle_next)

# Update getNextStep
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
    
    if (current === 1) return enabled.length > 0 ? enabled[0] : 3;
    
    const idx = enabled.indexOf(current as string);
    if (idx === -1 || idx === enabled.length - 1) return 3;
    return enabled[idx + 1];
  };"""

new_get_next_step = """  const getNextStep = (current: string | number): string | number => {
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
content = content.replace(old_get_next_step, new_get_next_step)

# Update getPrevStep
old_get_prev_step = """  const getPrevStep = (current: string | number): string | number => {
    if (type !== 'wire') return 1;
    const seq = ['code1', 'code2', 'code3', 'code4', 'code5'];
    const enabled = seq.filter(code => {
       if (code === 'code1') return adminSettings.requireCode1;
       if (code === 'code2') return adminSettings.requireCode2;
       if (code === 'code3') return adminSettings.requireCode3;
       if (code === 'code4') return adminSettings.requireCode4;
       if (code === 'code5') return adminSettings.requireCode5;
       return false;
    });
    
    if (current === 3) return enabled.length > 0 ? enabled[enabled.length - 1] : 1;
    
    const idx = enabled.indexOf(current as string);
    if (idx <= 0) return 1;
    return enabled[idx - 1];
  };"""

new_get_prev_step = """  const getPrevStep = (current: string | number): string | number => {
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
content = content.replace(old_get_prev_step, new_get_prev_step)

with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)

print("Updated state logic")
