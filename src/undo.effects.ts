import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map, tap, withLatestFrom } from "rxjs/operators";
import * as undoActions from "./undo.actions";
import { State } from "./undo.module";
import * as undoSelectors from "./undo.selectors";

@Injectable()
export class UndoEffects {
  constructor(private store$: Store<State>, private actions$: Actions) {}

  undoLastAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undoActions.undoLastAction),
      withLatestFrom(this.store$.select(undoSelectors.undoInProgress)),
      map(([_, undoAction]) => undoAction),
      tap(console.log),
      filter(undoAction => undoAction !== null && undoAction !== undefined)
    )
  );
}
