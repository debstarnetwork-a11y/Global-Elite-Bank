import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

imports_addition = """import React, { useState } from 'react';
import { useBank } from '../store';
import { ArrowRight, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { BiometricLogin } from './BiometricLogin';"""
content = re.sub(r'import React, { useState } from \'react\';\s*import { useBank } from \'../store\';\s*import { ArrowRight, ShieldCheck, Mail, Lock, User } from \'lucide-react\';', imports_addition, content, count=1)

signin_old = """export function SignInView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isAdminPath = typeof window !== "undefined" && window.location.pathname === "/admin";
  const { login, adminSettings } = useBank();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      onSuccess();
    } else {
      setError("Invalid email or password");
    }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">"""

signin_new = """export function SignInView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const isAdminPath = typeof window !== "undefined" && window.location.pathname === "/admin";
  const { login, adminSettings } = useBank();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  if (step === 2) {
    return <BiometricLogin onLogin={onSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">"""

content = content.replace(signin_old, signin_new)

signup_old = """export function SignUpView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const { register, login, adminSettings } = useBank();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isAdminPath = typeof window !== "undefined" && window.location.pathname === "/admin";

  const handleRegister = (e: any) => {
    e.preventDefault();
    register(name, email, password);
    const result = login(email, password);
    if (result && result.success) {
      onSuccess();
    } else {
      setError(result?.error || "Registration successful, but your account needs to be activated by an admin.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">"""

signup_new = """export function SignUpView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const { register, login, adminSettings } = useBank();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const isAdminPath = typeof window !== "undefined" && window.location.pathname === "/admin";

  const handleRegister = (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    register(name, email, password);
    const result = login(email, password);
    if (result && result.success) {
      setStep(2);
    } else {
      setError(result?.error || "Registration successful, but your account needs to be activated by an admin.");
    }
  };

  if (step === 2) {
    return <BiometricLogin onLogin={onSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">"""
    
content = content.replace(signup_old, signup_new)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)
