import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UndoEffects } from './undo.effects';
import { undoMetaReducer } from './undo.meta';
import { undoReducer, UndoState } from './undo.reducer';

export const undoFeatureKey = 'undo'
export interface State {
  [undoFeatureKey]: UndoState
}

@NgModule({
  imports: [
    StoreModule.forFeature<UndoState>(undoFeatureKey, undoReducer),
    EffectsModule.forFeature([UndoEffects]),
  ],
})
export class NgrxUndoEffectsModule {}