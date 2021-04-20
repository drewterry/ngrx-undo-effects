import { Action, createReducer, on } from "@ngrx/store";

import * as undoActions from "./undo.actions";

export const MAX_UNDO_ACTIONS = 10;

export interface UndoState {
  actions: Action[];
  inProgress?: Action;
}

export const initialState: UndoState = {
  actions: [],
  inProgress: undefined,
};

const _undoReducer = createReducer(
  initialState,
  on(
    undoActions.storeUndoAction,
    (state: UndoState, { undoAction }): UndoState => ({
      ...state,
      actions: [undoAction, ...state.actions.slice(0, MAX_UNDO_ACTIONS - 1)]
    })
  ),
  on(
    undoActions.undoLastAction,
    (state: UndoState): UndoState => ({
      ...state,
      actions: state.actions.slice(1),
      inProgress: state.actions[0]
    })
  ),
  on(
    undoActions.completeUndoLastAction,
    (state: UndoState): UndoState => ({
      ...state,
      inProgress: undefined
    })
  )
);

export function undoReducer(state: UndoState | undefined, action: Action) {
  return _undoReducer(state, action);
} 
