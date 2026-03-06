'use client';

import { useReducer, useCallback, useMemo } from 'react';
import { Button, Input, Textarea, Banner, Badge, PageWrapper } from '@/components/ui';
import Link from 'next/dist/client/link';

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

// State management
interface CallsState {
  calls: CallRecord[];
  activeCallId: string | null;
  bannerVisible: boolean;
  todoInput: string;
  deleteConfirmId: string | null;
}

type CallsAction =
  | { type: 'ADD_CALL' }
  | { type: 'UPDATE_CALL'; id: string; updates: Partial<CallRecord> }
  | { type: 'REQUEST_DELETE'; id: string }
  | { type: 'CONFIRM_DELETE' }
  | { type: 'CANCEL_DELETE' }
  | { type: 'DUPLICATE_CALL'; id: string }
  | { type: 'SET_ACTIVE_CALL'; id: string }
  | { type: 'ADD_TODO'; callId: string; text: string }
  | { type: 'TOGGLE_TODO'; callId: string; todoId: string }
  | { type: 'DELETE_TODO'; callId: string; todoId: string }
  | { type: 'SET_TODO_INPUT'; text: string }
  | { type: 'DISMISS_BANNER' };

const initialState: CallsState = {
  calls: [],
  activeCallId: null,
  bannerVisible: true,
  todoInput: '',
  deleteConfirmId: null,
};

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function callsReducer(state: CallsState, action: CallsAction): CallsState {
  switch (action.type) {
    case 'ADD_CALL': {
      const newCall: CallRecord = {
        id: generateId(),
        name: '',
        problem: '',
        details: '',
        todos: [],
        createdAt: new Date(),
      };
      return {
        ...state,
        calls: [...state.calls, newCall],
        activeCallId: newCall.id,
      };
    }

    case 'UPDATE_CALL': {
      return {
        ...state,
        calls: state.calls.map(call =>
          call.id === action.id ? { ...call, ...action.updates } : call
        ),
      };
    }

    case 'REQUEST_DELETE': {
      return { ...state, deleteConfirmId: action.id };
    }

    case 'CONFIRM_DELETE': {
      const newCalls = state.calls.filter(call => call.id !== state.deleteConfirmId);
      return {
        ...state,
        calls: newCalls,
        activeCallId:
          state.activeCallId === state.deleteConfirmId
            ? newCalls.length > 0
              ? newCalls[0].id
              : null
            : state.activeCallId,
        deleteConfirmId: null,
      };
    }

    case 'CANCEL_DELETE': {
      return { ...state, deleteConfirmId: null };
    }

    case 'DUPLICATE_CALL': {
      const call = state.calls.find(c => c.id === action.id);
      if (call) {
        const newCall: CallRecord = {
          ...call,
          id: generateId(),
          name: call.name + ' (Copy)',
          createdAt: new Date(),
        };
        return {
          ...state,
          calls: [...state.calls, newCall],
          activeCallId: newCall.id,
        };
      }
      return state;
    }

    case 'SET_ACTIVE_CALL': {
      return { ...state, activeCallId: action.id };
    }

    case 'ADD_TODO': {
      const text = action.text.trim();
      if (!text) return state;
      return {
        ...state,
        calls: state.calls.map(call =>
          call.id === action.callId
            ? {
                ...call,
                todos: [
                  ...call.todos,
                  { id: generateId(), text, done: false },
                ],
              }
            : call
        ),
        todoInput: '',
      };
    }

    case 'TOGGLE_TODO': {
      return {
        ...state,
        calls: state.calls.map(call =>
          call.id === action.callId
            ? {
                ...call,
                todos: call.todos.map(todo =>
                  todo.id === action.todoId
                    ? { ...todo, done: !todo.done }
                    : todo
                ),
              }
            : call
        ),
      };
    }

    case 'DELETE_TODO': {
      return {
        ...state,
        calls: state.calls.map(call =>
          call.id === action.callId
            ? {
                ...call,
                todos: call.todos.filter(todo => todo.id !== action.todoId),
              }
            : call
        ),
      };
    }

    case 'SET_TODO_INPUT': {
      return { ...state, todoInput: action.text };
    }

    case 'DISMISS_BANNER': {
      return { ...state, bannerVisible: false };
    }

    default: {
      return state;
    }
  }
}

export default function CallsPage() {
  const [state, dispatch] = useReducer(callsReducer, initialState);

  // Memoized derived state
  const activeCall = useMemo(
    () => state.calls.find(call => call.id === state.activeCallId) || null,
    [state.calls, state.activeCallId]
  );

  const completedTodos = useMemo(
    () => (activeCall ? activeCall.todos.filter(t => t.done).length : 0),
    [activeCall]
  );

  const totalTodos = useMemo(() => (activeCall ? activeCall.todos.length : 0), [activeCall]);

  // Callback handlers
  const handleAddCall = useCallback(() => {
    dispatch({ type: 'ADD_CALL' });
  }, []);

  const handleUpdateCall = useCallback(
    (updates: Partial<CallRecord>) => {
      if (activeCall) {
        dispatch({ type: 'UPDATE_CALL', id: activeCall.id, updates });
      }
    },
    [activeCall]
  );

  const handleRequestDelete = useCallback((id: string) => {
    dispatch({ type: 'REQUEST_DELETE', id });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    dispatch({ type: 'CONFIRM_DELETE' });
  }, []);

  const handleCancelDelete = useCallback(() => {
    dispatch({ type: 'CANCEL_DELETE' });
  }, []);

  const handleDuplicate = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_CALL', id });
  }, []);

  const handleSetActivCall = useCallback((id: string) => {
    dispatch({ type: 'SET_ACTIVE_CALL', id });
  }, []);

  const handleAddTodo = useCallback(
    (text: string) => {
      if (activeCall) {
        dispatch({ type: 'ADD_TODO', callId: activeCall.id, text });
      }
    },
    [activeCall]
  );

  const handleToggleTodo = useCallback(
    (todoId: string) => {
      if (activeCall) {
        dispatch({ type: 'TOGGLE_TODO', callId: activeCall.id, todoId });
      }
    },
    [activeCall]
  );

  const handleDeleteTodo = useCallback(
    (todoId: string) => {
      if (activeCall) {
        dispatch({ type: 'DELETE_TODO', callId: activeCall.id, todoId });
      }
    },
    [activeCall]
  );

  const handleSetTodoInput = useCallback((text: string) => {
    dispatch({ type: 'SET_TODO_INPUT', text });
  }, []);

  const handleDismissBanner = useCallback(() => {
    dispatch({ type: 'DISMISS_BANNER' });
  }, []);

  return (
    <PageWrapper maxWidth="max-w-7xl">
      {/* Warning Banner */}
      {state.bannerVisible && (
        <Banner
          type="warning"
          onClose={handleDismissBanner}
          showCloseButton={true}
        >
          ⚠️ Data is stored in memory only and will be lost on page refresh or close. This is intentional for session-only use.
        </Banner>
      )}

      <h1 className="text-4xl font-bold text-white mb-6">Call Notes</h1>
      {/* Header with back link */}
        <Link
          href="/"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <span className="mr-2">←</span>
          Back to Toolkit
        </Link>

{/* Delete Confirmation Banner */}
      {state.deleteConfirmId && (
        <Banner
          type="confirm"
          actions={[
            {
              label: 'Confirm Delete',
              onClick: handleConfirmDelete,
              variant: 'danger',
            },
            {
              label: 'Cancel',
              onClick: handleCancelDelete,
              variant: 'secondary',
              },
            ]}
            showCloseButton={false}
          >
            Are you sure you want to delete this call? This action cannot be undone.
          </Banner>
        )}

        {state.calls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">No calls yet. Create your first call to get started.</p>
            <Button onClick={handleAddCall} size="lg">
              Create First Call
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar: Calls List */}
            <div className="lg:w-1/3 bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Calls</h2>
                <Button onClick={handleAddCall} size="sm">
                  + New Call
                </Button>
              </div>
              <div className="space-y-2">
                {state.calls.map(call => (
                  <div
                    key={call.id}
                    onClick={() => handleSetActivCall(call.id)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      state.activeCallId === call.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-medium truncate">{call.name || 'Untitled Call'}</div>
                    <div className="text-sm truncate">{call.problem || 'No problem specified'}</div>
                    <div className="text-xs mt-1 flex items-center gap-2">
                      <span>
                        {call.todos.filter(t => t.done).length}/{call.todos.length} steps
                      </span>
                      {call.todos.length > 0 && call.todos.filter(t => t.done).length === call.todos.length && (
                        <Badge variant="success">Done</Badge>
                      )}
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
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDuplicate(activeCall.id)}
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRequestDelete(activeCall.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={activeCall.name}
                    onChange={(value) =>
                      handleUpdateCall({ name: value })
                    }
                    placeholder="Call name"
                  />
                  <Input
                    label="Problem"
                    value={activeCall.problem}
                    onChange={(value) =>
                      handleUpdateCall({ problem: value })
                    }
                    placeholder="Brief problem description"
                  />
                  <Textarea
                    label="Details"
                    value={activeCall.details}
                    onChange={(value) =>
                      handleUpdateCall({ details: value })
                    }
                    placeholder="Additional notes"
                    rows={4}
                  />

                  {/* Troubleshooting Steps */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Troubleshooting Steps ({completedTodos}/{totalTodos} complete)
                    </label>
                    <div className="mb-3 flex gap-2">
                      <Input
                        value={state.todoInput}
                        onChange={handleSetTodoInput}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTodo(state.todoInput);
                          }
                        }}
                        placeholder="Add a troubleshooting step..."
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleAddTodo(state.todoInput)}
                        className="whitespace-nowrap"
                      >
                        Add Step
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {activeCall.todos.map(todo => (
                        <div key={todo.id} className="flex items-center gap-3 bg-slate-700 rounded p-2">
                          <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() => handleToggleTodo(todo.id)}
                            className="w-4 h-4 accent-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <span
                            className={`flex-1 ${
                              todo.done ? 'text-slate-400' : 'text-white'
                            }`}
                          >
                            {todo.text}
                          </span>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                            aria-label="Delete step"
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
    </PageWrapper>
  );
}