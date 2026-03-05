'use client';

import { useState, useCallback } from 'react';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

interface CallRecord {
  id: string;
  name: string;
  problem: string;
  details: string;
  todos: TodoItem[];
  createdAt: Date;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [todoInput, setTodoInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Store-like functions
  const addCall = useCallback(() => {
    const newCall: CallRecord = {
      id: generateId(),
      name: '',
      problem: '',
      details: '',
      todos: [],
      createdAt: new Date(),
    };
    setCalls(prev => [...prev, newCall]);
    setActiveCallId(newCall.id);
  }, []);

  const updateCall = useCallback((id: string, updates: Partial<CallRecord>) => {
    setCalls(prev => prev.map(call => call.id === id ? { ...call, ...updates } : call));
  }, []);

  const deleteCall = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirmId) {
      setCalls(prev => {
        const newCalls = prev.filter(call => call.id !== deleteConfirmId);
        if (activeCallId === deleteConfirmId) {
          setActiveCallId(newCalls.length > 0 ? newCalls[0].id : null);
        }
        return newCalls;
      });
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, activeCallId]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmId(null);
  }, []);

  const duplicateCall = useCallback((id: string) => {
    const call = calls.find(c => c.id === id);
    if (call) {
      const newCall: CallRecord = {
        ...call,
        id: generateId(),
        name: call.name + ' (Copy)',
        createdAt: new Date(),
      };
      setCalls(prev => [...prev, newCall]);
      setActiveCallId(newCall.id);
    }
  }, [calls]);

  const addTodo = useCallback((callId: string, text: string) => {
    if (!text.trim()) return;
    const newTodo: TodoItem = {
      id: generateId(),
      text: text.trim(),
      done: false,
    };
    updateCall(callId, { todos: [...(calls.find(c => c.id === callId)?.todos || []), newTodo] });
    setTodoInput('');
  }, [calls, updateCall]);

  const toggleTodo = useCallback((callId: string, todoId: string) => {
    const call = calls.find(c => c.id === callId);
    if (call) {
      const updatedTodos = call.todos.map(todo =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo
      );
      updateCall(callId, { todos: updatedTodos });
    }
  }, [calls, updateCall]);

  const deleteTodo = useCallback((callId: string, todoId: string) => {
    const call = calls.find(c => c.id === callId);
    if (call) {
      const updatedTodos = call.todos.filter(todo => todo.id !== todoId);
      updateCall(callId, { todos: updatedTodos });
    }
  }, [calls, updateCall]);

  const activeCall = calls.find(call => call.id === activeCallId) || null;
  const completedTodos = activeCall ? activeCall.todos.filter(t => t.done).length : 0;
  const totalTodos = activeCall ? activeCall.todos.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Warning Banner */}
        {bannerVisible && (
          <div className="bg-yellow-600 text-yellow-100 p-4 rounded-lg mb-6 flex justify-between items-start">
            <p className="text-sm">⚠️ Data is stored in memory only and will be lost on page refresh or close. This is intentional for session-only use.</p>
            <button
              onClick={() => setBannerVisible(false)}
              className="text-yellow-100 hover:text-yellow-50 ml-4 flex-shrink-0"
              aria-label="Close warning"
            >
              ✕
            </button>
          </div>
        )}

        {/* Delete Confirmation Banner */}
        {deleteConfirmId && (
          <div className="bg-red-600 text-red-100 p-4 rounded-lg mb-6 flex justify-between items-center">
            <p className="text-sm">Are you sure you want to delete this call? This action cannot be undone.</p>
            <div className="flex gap-3 ml-4 flex-shrink-0">
              <button
                onClick={confirmDelete}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-1 rounded text-sm font-medium transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-white mb-6">Call Notes & Troubleshooting</h1>

        {calls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">No calls yet. Create your first call to get started.</p>
            <button
              onClick={addCall}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create First Call
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar: Calls List */}
            <div className="lg:w-1/3 bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Calls</h2>
                <button
                  onClick={addCall}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  + New Call
                </button>
              </div>
              <div className="space-y-2">
                {calls.map(call => (
                  <div
                    key={call.id}
                    onClick={() => setActiveCallId(call.id)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      activeCallId === call.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-medium truncate">{call.name || 'Unnamed Caller'}</div>
                    <div className="text-sm truncate">{call.problem || 'No problem specified'}</div>
                    <div className="text-xs mt-1">
                      {call.todos.filter(t => t.done).length}/{call.todos.length} steps
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main: Call Editor */}
            {activeCall && (
              <div className="lg:w-2/3 bg-slate-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Call Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateCall(activeCall.id)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => deleteCall(activeCall.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={activeCall.name}
                      onChange={(e) => updateCall(activeCall.id, { name: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Caller name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Problem</label>
                    <input
                      type="text"
                      value={activeCall.problem}
                      onChange={(e) => updateCall(activeCall.id, { problem: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Brief problem description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Details</label>
                    <textarea
                      value={activeCall.details}
                      onChange={(e) => updateCall(activeCall.id, { details: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                      placeholder="Additional notes"
                    />
                  </div>

                  {/* Troubleshooting Steps */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Troubleshooting Steps ({completedTodos}/{totalTodos} complete)
                    </label>
                    <div className="mb-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a troubleshooting step..."
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addTodo(activeCall.id, todoInput);
                          }
                        }}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => addTodo(activeCall.id, todoInput)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors whitespace-nowrap"
                      >
                        Add Step
                      </button>
                    </div>
                    <div className="space-y-2">
                      {activeCall.todos.map(todo => (
                        <div key={todo.id} className="flex items-center gap-3 bg-slate-700 rounded p-2">
                          <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() => toggleTodo(activeCall.id, todo.id)}
                            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                          />
                          <span className={`flex-1 ${todo.done ? 'line-through text-slate-400' : 'text-white'}`}>
                            {todo.text}
                          </span>
                          <button
                            onClick={() => deleteTodo(activeCall.id, todo.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}