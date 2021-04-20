import { ActionReducer } from "@ngrx/store";
import { UndoableAction } from "./undo";
import * as undoActions from "./undo.actions";
import { State } from "./undo.module";


export function undoMetaReducer(
  reducer: ActionReducer<any>
): ActionReducer<any, UndoableAction<State>> {
  return (
    state: State,
    action: UndoableAction<State>
  ) => {
    if (action.getUndoAction) {
      if (state && !!state.undo.inProgress) {
        state = reducer(state, undoActions.completeUndoLastAction());
      } else {
        state = reducer(
          state,
          undoActions.storeUndoAction({
            undoAction: action.getUndoAction(
              state,
              action.requestAction,
              action
            )
          })
        );
      }
    }

    return reducer(state, action);
  };
}
