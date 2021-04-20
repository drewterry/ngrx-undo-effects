import { createSelector } from "@ngrx/store";

import { UndoState } from './undo.reducer';

const selectUndo = (state: { undo: UndoState }): UndoState => state.undo;

export const undoActions = createSelector(
  selectUndo,
  (undo: UndoState) => undo?.actions
);

export const undoInProgress = createSelector(
  selectUndo,
  (undo: UndoState) => undo?.inProgress
);
