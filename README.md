# ngrx-undo-effects

Package to enable undo-able NgRx actions with side effects.

## Overview

This feature enables undo functionality on explicitly defined NgRx actions. From a high level, it allows the developer to create actions with associated undo actions. When these actions are dispatched, the corresponding undo action will be added to an array in the store. Later, if the user wants to undo this action, an `undoLastAction` action can be dispatched, which will pull the most recent undo action out of the store, and dispatch it.

## Setup

Import `NgrxUndoEffectsModule` in `app.module.ts`, and add `undoMetaReducer` to the `metaReducers` array in `StoreModule.forRoot`

```ts
@NgModule({
  ...
  imports: [
    ...
    StoreModule.forRoot({
      reducer,
      { metaReducers: [
        ...
        undoMetaReducer    // Add this
      ]}
    }),
    NgrxUndoEffectsModule  // Add this
  ]
})
```

## Usage

The package contains a function `createUndoableSuccessAction` which enables the creation of paired action (request/response) and enforces a specific set of rules regarding actions/undo actions.  Specifically, the following rules are enforced:

- When creating the success action, an undo action factory must be provided.  This factory function accepts the current state and the request action, and returns a new action which would undo the changes made by the request action.  
- When dispatching the response (success) action, the typings require the user to pass in the request action to the response action.

## Undo

To undo the last action saved in the store, simply dispatch `undoLastAction`.

```ts
this.store.dispatch(undoLastAction());
```

The list of actions can be retrieved using the `undoActions` selector.

```ts
this.undoActions$ = this.store.pipe(select(undoActions));
```

### Example Flow

If we have a key in the store called name as follows:

```json
{
  name: string;
}
```

If we send an action to the API to update the key, we might have an action like this:

```ts
fromActions.updateName({ name: 'newName' })
```

In order to reverse this change, we would need to provide a factory to create an action to reverse this change.

```ts
(state, action) => fromActions.updateName({ name: store.name })
```

Here we can see that we are creating a new action (`updateName`), with a payload based on the current name from the store.  In this case, we didn't need the request action, because it only contained the new name.

### Another example

Here is a more complex example which would require the use of the `action` parameter. Consider the scenario of updating an array of items. For example, if we have a key in the store with a list of items as follows:

```json
{
  items: [
    { id: number, name: string }
  ]
}
```

In order to send an action to the API to update the name of the item with id of '5', we might have an action like this:

```ts
fromActions.updateItemNames({ 
  items: [ 
    { id: 5, name: 'newName' } 
  ] 
})
```

To reverse this change, we would need to provide a factory to create an action to reverse this change.

```ts
(state, action) => fromActions.updateItemNames({
  items: {
    action.items.map((item) => ({
      id,
      name: store.items.find((item) => item.id === id).name
    }))
  }
)
```

Here we can see that we are creating a new action (`updateItemNames`), with a payload based on the request actions payload.  To generate the undo payload, we take the items from the request action (`{ id: 5, name: 'newName' }` from the earlier example), and extract the current name for each one from the store.

## Creating New Undo-able Actions

Due in large part to the code in `posts.undo.ts`, the creation of new undo-able action is simple, using the `createUndoableSuccessAction` function.

```ts
// Create the request action normally, using `createAction`

export const updatePostName =                  // Name of the new request Action
  createAction(
    '[Posts] Update Post Name',                // Type of new request Action
    props<UpdatePostNameRequest>(),            // Payload of the request Action.  Use the `props` helper function from NgRx.
  )

// Create the response action using `createUndoableSuccessAction`

export const updatePostNameSuccess =           // Name of the new response Action
  createUndoableSuccessAction(
    updatePostName                             // The request action we are creating a response action for.
    props<UpdatePostNameResponse>(),           // Payload of the response Action.  Use the `props` helper function from NgRx.
    (state: State, action: Action) =>          // Undo action factory.
      updatePostName({
        postId: state?.post?.postId,
        postName: state?.post?.postName,
      })
  );
```

The resulting actions (`updatePostName` and `updatePostNameSuccess` above) can be dispatched just like any other NgRx action.

The expectation is that the response/success action would be dispatched from an effect. Please note that `requestAction` is a required field for the success/response action.
