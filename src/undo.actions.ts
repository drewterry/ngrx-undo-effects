import { Action, createAction, props } from "@ngrx/store";

export const storeUndoAction = createAction(
  "[Undo] Store Undo Action",
  props<{ undoAction: Action }>()
);

export const undoLastAction = createAction("[Undo] Undo Last Action");

export const completeUndoLastAction = createAction(
  "[Undo] Complete Undo Last Action"
);
