'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Command {
  id: string;
  command: string;
  platform: string;
  useCase: string;
  featured?: boolean;
}

const COMMANDS: Command[] = [
  // Featured Windows
  {
    id: 'win-task-mgr',
    command: 'Ctrl+Shift+Esc',
    platform: 'Windows',
    useCase: 'Open Task Manager to monitor processes and performance',
    featured: true,
  },
  {
    id: 'win-clipboard',
    command: 'Win+V',
    platform: 'Windows',
    useCase: 'Open clipboard history to access recent copies',
    featured: true,
  },
  {
    id: 'win-quick-menu',
    command: 'Win+X',
    platform: 'Windows',
    useCase: 'Quick access menu for power user options',
  },
  {
    id: 'win-alt-tab',
    command: 'Alt+Tab',
    platform: 'Windows',
    useCase: 'Switch between open applications',
  },
  {
    id: 'win-file-explorer',
    command: 'Win+E',
    platform: 'Windows',
    useCase: 'Open File Explorer quickly',
  },
  {
    id: 'win-snip',
    command: 'Win+Shift+S',
    platform: 'Windows',
    useCase: 'Take a screenshot with Snipping Tool',
  },
  {
    id: 'win-settings',
    command: 'Win+I',
    platform: 'Windows',
    useCase: 'Open Windows Settings',
  },
  {
    id: 'ipconfig',
    command: 'ipconfig',
    platform: 'Windows',
    useCase: 'Display network configuration and IP address',
    featured: true,
  },

  // Featured macOS
  {
    id: 'mac-spotlight',
    command: 'Cmd+Space',
    platform: 'macOS',
    useCase: 'Open Spotlight search to find files and apps',
    featured: true,
  },
  {
    id: 'mac-force-quit',
    command: 'Cmd+Option+Esc',
    platform: 'macOS',
    useCase: 'Force quit unresponsive applications',
    featured: true,
  },
  {
    id: 'mac-empty-trash',
    command: 'Cmd+Shift+Delete',
    platform: 'macOS',
    useCase: 'Empty Trash bin',
  },
  {
    id: 'mac-activity-monitor',
    command: 'Cmd+Space, then "Activity Monitor"',
    platform: 'macOS',
    useCase: 'Open Activity Monitor to view processes',
  },
  {
    id: 'mac-switch-app',
    command: 'Cmd+Tab',
    platform: 'macOS',
    useCase: 'Switch between open applications',
  },
  {
    id: 'ifconfig',
    command: 'ifconfig',
    platform: 'macOS',
    useCase: 'Display network interface configuration',
  },

  // Featured Linux
  {
    id: 'linux-ls',
    command: 'ls -la',
    platform: 'Linux',
    useCase: 'List all files with details including hidden files',
    featured: true,
  },
  {
    id: 'linux-sudo',
    command: 'sudo reboot',
    platform: 'Linux',
    useCase: 'Restart the system with administrator privileges',
    featured: true,
  },
  {
    id: 'linux-ps-aux',
    command: 'ps aux',
    platform: 'Linux',
    useCase: 'Display all running processes with details',
  },
  {
    id: 'linux-grep',
    command: 'grep -r "search term"',
    platform: 'Linux',
    useCase: 'Search for text recursively in files',
  },
  {
    id: 'linux-chmod',
    command: 'chmod 755 file',
    platform: 'Linux',
    useCase: 'Change file permissions (755 = full owner, rx others)',
  },
  {
    id: 'linux-sudo-apt',
    command: 'sudo apt update && sudo apt upgrade',
    platform: 'Linux',
    useCase: 'Update package manager and upgrade packages',
  },
  {
    id: 'linux-kill',
    command: 'kill -9 <PID>',
    platform: 'Linux',
    useCase: 'Force terminate a process by PID',
  },

  // Featured Network
  {
    id: 'ping',
    command: 'ping google.com',
    platform: 'Network',
    useCase: 'Test connectivity and DNS resolution to a host',
    featured: true,
  },
  {
    id: 'netstat',
    command: 'netstat -an',
    platform: 'Network',
    useCase: 'Display active network connections and listening ports',
    featured: true,
  },
  {
    id: 'nslookup',
    command: 'nslookup domain.com',
    platform: 'Network',
    useCase: 'Look up DNS records for a domain',
  },
  {
    id: 'curl',
    command: 'curl https://example.com',
    platform: 'Network',
    useCase: 'Fetch web content and test API endpoints',
  },
  {
    id: 'tracert',
    command: 'tracert google.com',
    platform: 'Network',
    useCase: 'Trace the route packets take to a destination',
  },

  // Cross-platform
  {
    id: 'git-status',
    command: 'git status',
    platform: 'Cross-platform',
    useCase: 'Check the status of your Git repository',
    featured: true,
  },
  {
    id: 'npm-install',
    command: 'npm install',
    platform: 'Cross-platform',
    useCase: 'Install Node.js project dependencies',
  },
  {
    id: 'npm-run-dev',
    command: 'npm run dev',
    platform: 'Cross-platform',
    useCase: 'Start development server',
  },
];

const PLATFORMS = [
  'All Platforms',
  'Windows',
  'macOS',
  'Linux',
  'Network',
  'Cross-platform',
];

export default function CommandsReference() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter and sort commands
  const filteredCommands = useMemo(() => {
    const filtered = COMMANDS.filter((cmd) => {
      const matchesSearch =
        searchQuery === '' ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.platform.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform =
        selectedPlatform === 'All Platforms' || cmd.platform === selectedPlatform;

      return matchesSearch && matchesPlatform;
    });

    // Separate featured and regular commands
    const featured = filtered.filter((cmd) => cmd.featured);
    const regular = filtered.filter((cmd) => !cmd.featured);

    return { featured, regular };
  }, [searchQuery, selectedPlatform]);

  const handleCopy = async (command: string, id: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
      alert('Failed to copy command');
    }
  };

  const totalResults = filteredCommands.featured.length + filteredCommands.regular.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-6"
          >
            <span className="mr-2">←</span>
            Back to Toolkit
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Common Commands Reference</h1>
          <p className="text-slate-400">Quick access to essential shortcuts and commands for Windows, macOS, Linux, and networking</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-slate-200 mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by command, platform, or use case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              aria-label="Search commands"
            />
          </div>

          {/* Platform Filter */}
          <div>
            <label htmlFor="platform" className="block text-sm font-semibold text-slate-200 mb-2">
              Filter by Platform
            </label>
            <select
              id="platform"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full md:w-64 px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              aria-label="Filter commands by platform"
            >
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-slate-400">
          {totalResults === 0 ? (
            <p>No commands found. Try adjusting your search or filter.</p>
          ) : (
            <p>{totalResults} command(s) found</p>
          )}
        </div>

        {/* Featured Commands Section */}
        {filteredCommands.featured.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ⭐ Top Picks
            </h2>
            <div className="space-y-3">
              {filteredCommands.featured.map((cmd) => (
                <div
                  key={cmd.id}
                  className="p-4 bg-gradient-to-r from-slate-800 to-slate-750 border-l-4 border-yellow-400 rounded-lg hover:from-slate-750 hover:to-slate-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="px-3 py-1 bg-slate-900 text-blue-300 font-mono text-sm rounded">
                          {cmd.command}
                        </code>
                        <span className="text-xs font-semibold px-2 py-1 bg-yellow-900 text-yellow-200 rounded">
                          {cmd.platform}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{cmd.useCase}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(cmd.command, cmd.id)}
                      className={`flex-shrink-0 px-3 py-2 rounded font-medium text-sm transition-all ${
                        copiedId === cmd.id
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      aria-label={`Copy command: ${cmd.command}`}
                    >
                      {copiedId === cmd.id ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Commands Section */}
        {filteredCommands.regular.length > 0 && (
          <div>
            {filteredCommands.featured.length > 0 && (
              <h2 className="text-2xl font-bold text-white mb-4">All Commands</h2>
            )}
            <div className="space-y-3">
              {filteredCommands.regular.map((cmd) => (
                <div
                  key={cmd.id}
                  className="p-4 bg-slate-800 border-2 border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="px-3 py-1 bg-slate-900 text-blue-300 font-mono text-sm rounded">
                          {cmd.command}
                        </code>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-700 text-slate-200 rounded">
                          {cmd.platform}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{cmd.useCase}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(cmd.command, cmd.id)}
                      className={`flex-shrink-0 px-3 py-2 rounded font-medium text-sm transition-all ${
                        copiedId === cmd.id
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                      aria-label={`Copy command: ${cmd.command}`}
                    >
                      {copiedId === cmd.id ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
