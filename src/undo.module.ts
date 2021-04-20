import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UndoEffects } from './undo.effects';
import { undoMetaReducer } from './undo.meta';
import { undoReducer, UndoState } from './undo.reducer';

export interface State {
  undo: UndoState
}

@NgModule({
  imports: [
    StoreModule.forFeature<State>(
      'undo', 
      { undo: undoReducer }, 
      { metaReducers: [undoMetaReducer] }
    ),
    EffectsModule.forFeature([UndoEffects]),
  ],
})
export class NgrxUndoEffectsModule { }