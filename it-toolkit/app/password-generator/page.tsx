'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, PageWrapper } from '@/components/ui';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%&?';
const ALL_CHARS = LOWERCASE + UPPERCASE + NUMBERS + SYMBOLS;

// Secure random value using crypto.getRandomValues
function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// Fisher-Yates shuffle with crypto randomness
function shuffleArray(arr: string[]): string[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate secure password
function generatePassword(length: number): string {
  if (length < 4) length = 4;
  if (length > 64) length = 64;

  // Start with one character from each required set
  const passwordChars = [
    LOWERCASE[getSecureRandomInt(LOWERCASE.length)],
    UPPERCASE[getSecureRandomInt(UPPERCASE.length)],
    NUMBERS[getSecureRandomInt(NUMBERS.length)],
    SYMBOLS[getSecureRandomInt(SYMBOLS.length)],
  ];

  // Fill remaining length with random characters from all sets
  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(ALL_CHARS[getSecureRandomInt(ALL_CHARS.length)]);
  }

  // Shuffle the entire password
  const shuffled = shuffleArray(passwordChars);
  return shuffled.join('');
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  // Generate password on mount and when length changes
  useEffect(() => {
    const newPassword = generatePassword(length);
    setPassword(newPassword);
  }, [length]);

  const handleCopy = async () => {
    if (!password) return;
    await copyToClipboard(password);
  };

  const handleRegenerate = () => {
    const newPassword = generatePassword(length);
    setPassword(newPassword);
  };

  return (
    <PageWrapper maxWidth="max-w-md">
      {/* Header with back link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <span className="mr-2">←</span>
          Back to Toolkit
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Password Generator</h1>
        <p className="text-slate-400">Create strong, unique passwords securely</p>
      </div>

      {/* Password Display */}
      <div className="mb-8">
        <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-3">
          Generated Password
        </label>
        <div className="relative">
          <input
            id="password"
            type="text"
            readOnly
            value={password}
            className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg font-mono text-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors select-all"
            onClick={(e) => e.currentTarget.select()}
          />
          {/* Copy button */}
          <Button
            onClick={handleCopy}
            disabled={!password}
            className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm px-3 py-1 ${
              isCopied ? 'bg-green-600 hover:bg-green-600' : ''
              }`}
              variant={isCopied ? 'primary' : 'primary'}
              size="sm"
              aria-label="Copy password to clipboard"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Length Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <label htmlFor="length" className="block text-sm font-semibold text-slate-200">
              Password Length
            </label>
            <span className="text-lg font-bold text-blue-400">{length}</span>
          </div>
          <input
            id="length"
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Adjust password length"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleRegenerate}
          variant="primary"
          className="w-full"
          size="md"
        >
          Generate New Password
        </Button>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-sm font-semibold text-slate-200 mb-2">Included in every password:</h2>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>✓ Lowercase letters (a-z)</li>
            <li>✓ Uppercase letters (A-Z)</li>
            <li>✓ Numbers (0-9)</li>
            <li>✓ Symbols (!@#$%^&*...)</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">
            Passwords are generated using cryptographically secure randomness.
          </p>
        </div>
    </PageWrapper>
  );
}
