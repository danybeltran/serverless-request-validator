import { NowRequest, NowResponse } from "@vercel/node";

interface ValidateRequest extends NowRequest {}

interface ValidateResponse<T> extends NowResponse {
  sendStatus?: (code?: number, message?: string) => void;
  sendFile?: (url?: string) => void;
}

/** Request handler */
type RequestValidatorHandlerType = (
  /** Request object */
  Req?: ValidateRequest,
  /** Response object */
  Res?: ValidateResponse<any>
) => void;

type SingleHandler = (
  /** Handle only requests using one request method */
  Req: RequestValidatorHandlerType
) => void;

export interface IValidator {
  /** Handles a GET request */
  get?: SingleHandler;
  /** Handles a POST request */
  post?: SingleHandler;
  /** Handles a PUT request */
  put?: SingleHandler;
  /** Handles a DELETE request */
  delete?: SingleHandler;
  /** Handles a HEAD request */
  head?: SingleHandler;
  /** Handles a CONNECT request */
  connect?: SingleHandler;
  /** Handles an OPTIONS request */
  options?: SingleHandler;
  /** Handles a TRACE request */
  trace?: SingleHandler;
  /** Handles a PATCH request */
  patch?: SingleHandler;
}

export interface IValidatorProps {
  /** Handles a GET request */
  get?: RequestValidatorHandlerType;
  /** Handles a POST request */
  post?: RequestValidatorHandlerType;
  /** Handles a PUT request */
  put?: RequestValidatorHandlerType;
  /** Handles a DELETE request */
  delete?: RequestValidatorHandlerType;
  /** Handles a HEAD request */
  head?: RequestValidatorHandlerType;
  /** Handles a CONNECT request */
  connect?: RequestValidatorHandlerType;
  /** Handles an OPTIONS request */
  options?: RequestValidatorHandlerType;
  /** Handles a TRACE request */
  trace?: RequestValidatorHandlerType;
  /** Handles a PATCH request */
  patch?: RequestValidatorHandlerType;
}

/** Specify callbacks for different methods made to an endpoint */
type ValidateType = (handlers: IValidatorProps) => Function;
interface IValidate extends IValidator, ValidateType {}
