import { Action, ActionCreator, createAction } from "@ngrx/store";
import {
  TypedAction,
  NotAllowedCheck,
  ActionCreatorProps
} from "@ngrx/store/src/models";

type UndoActionCreator<
  State extends object,
  RequestProps extends object,
  ResponseProps extends object
> = (
  state: State,
  requestAction?: RequestProps & Action,
  responseAction?: ResponseProps & Action
) => Action;

type UndoableSuccessActionProps<
  ResponseProps extends object,
  RequestType extends string,
  RequestProps extends object
> = ResponseProps & {
  requestAction: RequestProps & TypedAction<RequestType>;
};

type UndoableSuccessAction<
  State extends object,
  ResponseType extends string,
  ResponseProps extends object,
  RequestType extends string,
  RequestProps extends object
> = ResponseProps &
  TypedAction<ResponseType> &
  UndoableActionInterface<State, RequestType, RequestProps, ResponseProps>;

type UndoableSuccessActionCreator<
  State extends object,
  RequestType extends string,
  RequestProps extends object,
  ResponseType extends string,
  ResponseProps extends object
> = ActionCreator<
  ResponseType,
  (
    props: UndoableSuccessActionProps<ResponseProps, RequestType, RequestProps>
  ) => UndoableSuccessAction<
    State,
    ResponseType,
    ResponseProps,
    RequestType,
    RequestProps
  >
>;

type ActionProps<P extends object> = P & NotAllowedCheck<P>;
type ActionPropsType<P extends object> = ActionCreatorProps<P> &
  NotAllowedCheck<P>;

export function createUndoableSuccessAction<
  RequestType extends string,
  RequestProps extends object,
  ResponseProps extends object,
  State extends object
>(
  requestActionCreator: ActionCreator,
  responseConfig: ActionPropsType<ResponseProps>,
  getUndoAction: UndoActionCreator<State, RequestProps, ResponseProps>
): UndoableSuccessActionCreator<
  State,
  RequestType,
  RequestProps,
  string,
  ResponseProps
> {
  const responseType = `${requestActionCreator.type} Success`;
  const responseActionCreator = createAction(responseType, responseConfig);

  const modifiedActionCreatorFunction = (
    properties: ActionProps<
      UndoableSuccessActionProps<ResponseProps, RequestType, RequestProps>
    >
  ): UndoableSuccessAction<
    State,
    string,
    ResponseProps,
    RequestType,
    RequestProps
  > => {
    const action = responseActionCreator(properties);
    const modifiedAction = {
      ...action,
      requestAction: properties.requestAction,
      getUndoAction
    };
    return modifiedAction;
  };

  const modifiedResponseActionCreator: UndoableSuccessActionCreator<
    State,
    RequestType,
    RequestProps,
    string,
    ResponseProps
  > = Object.defineProperty(modifiedActionCreatorFunction, "type", {
    value: responseActionCreator.type,
    writable: false
  });

  return modifiedResponseActionCreator;
}

export interface UndoableActionInterface<
  State extends object,
  RequestType extends string = string,
  RequestProps extends object = object,
  ResponseProps extends object = object
> {
  getUndoAction: UndoActionCreator<State, RequestProps, ResponseProps>;
  requestAction: RequestProps & TypedAction<RequestType>;
}

export interface UndoableAction<
  State extends object,
  RequestType extends string = string,
  RequestProps extends object = object,
  ResponseProps extends object = object
> extends Action {
  getUndoAction?: UndoActionCreator<State, RequestProps, ResponseProps>;
  requestAction?: RequestProps & TypedAction<RequestType>;
}