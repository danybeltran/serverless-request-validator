import {
  RequestValidatorHandlerType,
  IValidate,
  ValidateResponse,
} from "../src";

export const RequestMethods = [
  "get",
  "post",
  "put",
  "delete",
  "head",
  "connect",
  "options",
  "trace",
  "patch",
];

export const Validate: IValidate = (handlers) => {
  const validateResponseCallback: RequestValidatorHandlerType = function (
    req,
    res
  ) {
    const _handlers = { ...handlers };
    const vResponse = {
      ...res,
      sendStatus: (code, message = "") => {
        res.status(code).send(message);
      },
    } as ValidateResponse<any>;
    try {
      RequestMethods.forEach((requestMethod) => {
        if (!handlers[requestMethod]) {
          const invalidMethodCb: RequestValidatorHandlerType = (req, res) => {
            res
              .status(405)
              .send(`Cannot ${requestMethod.toUpperCase()} ${req.url}`);
          };
          _handlers[requestMethod] = invalidMethodCb;
        }
      });
      return _handlers[req.method.toLowerCase()](req, vResponse);
    } catch (err) {
      res.send("An error ocurred");
      throw err;
    }
  };
  return validateResponseCallback;
};
RequestMethods.forEach((requestMethod) => {
  Validate[requestMethod] = (handler: RequestValidatorHandlerType) => {
    const responseCb: RequestValidatorHandlerType = (req, res) => {
      const { method } = req;
      const vResponse = {
        ...res,
        sendStatus: (code, message = "") => {
          res.status(code).send(message);
        },
      } as ValidateResponse<any>;
      if (method.toLowerCase() === requestMethod) {
        handler(req, vResponse);
      } else {
        vResponse.sendStatus(405, `Cannot ${method} ${req.url}`);
      }
    };
    return responseCb;
  };
});

export default Validate;
