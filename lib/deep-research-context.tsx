'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from 'react';

interface ActivityItem {
  type: 'search' | 'extract' | 'analyze' | 'reasoning' | 'synthesis' | 'thought';
  status: 'pending' | 'complete' | 'error';
  message: string;
  timestamp: string;
  depth?: number;
}

interface SourceItem {
  url: string;
  title: string;
  relevance: number;
}

interface DeepResearchState {
  isActive: boolean;
  activity: ActivityItem[];
  sources: SourceItem[];
  currentDepth: number;
  maxDepth: number;
  completedSteps: number;
  totalExpectedSteps: number;
}

type DeepResearchAction =
  | { type: 'TOGGLE_ACTIVE' }
  | { type: 'SET_ACTIVE'; payload: boolean }
  | { type: 'ADD_ACTIVITY'; payload: ActivityItem }
  | { type: 'ADD_SOURCE'; payload: SourceItem }
  | { type: 'SET_DEPTH'; payload: { current: number; max: number } }
  | { type: 'CLEAR_STATE' };

interface DeepResearchContextType {
  state: DeepResearchState;
  toggleActive: () => void;
  setActive: (active: boolean) => void;
  addActivity: (activity: ActivityItem) => void;
  addSource: (source: SourceItem) => void;
  setDepth: (current: number, max: number) => void;
  clearState: () => void;
}

const initialState: DeepResearchState = {
  isActive: true,
  activity: [],
  sources: [],
  currentDepth: 0,
  maxDepth: 7,
  completedSteps: 0,
  totalExpectedSteps: 0,
};

function deepResearchReducer(
  state: DeepResearchState,
  action: DeepResearchAction,
): DeepResearchState {
  switch (action.type) {
    case 'TOGGLE_ACTIVE':
      return {
        ...state,
        isActive: !state.isActive,
      };
    case 'SET_ACTIVE':
      return {
        ...state,
        isActive: action.payload,
      };
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activity: [...state.activity, action.payload],
      };
    case 'ADD_SOURCE':
      return {
        ...state,
        sources: [...state.sources, action.payload],
      };
    case 'SET_DEPTH':
      return {
        ...state,
        currentDepth: action.payload.current,
        maxDepth: action.payload.max,
      };
    case 'CLEAR_STATE':
      return initialState;
    default:
      return state;
  }
}

const DeepResearchContext = createContext<DeepResearchContextType | undefined>(
  undefined,
);

export function DeepResearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(deepResearchReducer, initialState);

  const toggleActive = useCallback(() => {
    dispatch({ type: 'TOGGLE_ACTIVE' });
  }, []);

  const setActive = useCallback((active: boolean) => {
    dispatch({ type: 'SET_ACTIVE', payload: active });
  }, []);

  const addActivity = useCallback((activity: ActivityItem) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  }, []);

  const addSource = useCallback((source: SourceItem) => {
    dispatch({ type: 'ADD_SOURCE', payload: source });
  }, []);

  const setDepth = useCallback((current: number, max: number) => {
    dispatch({ type: 'SET_DEPTH', payload: { current, max } });
  }, []);

  const clearState = useCallback(() => {
    dispatch({ type: 'CLEAR_STATE' });
  }, []);

  return (
    <DeepResearchContext.Provider
      value={{
        state,
        toggleActive,
        setActive,
        addActivity,
        addSource,
        setDepth,
        clearState,
      }}
    >
      {children}
    </DeepResearchContext.Provider>
  );
}

export function useDeepResearch() {
  const context = useContext(DeepResearchContext);
  if (context === undefined) {
    throw new Error(
      'useDeepResearch must be used within a DeepResearchProvider',
    );
  }
  return context;
}
