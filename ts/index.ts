import {
  RequestValidatorHandlerType,
  IValidate,
  ValidateResponse,
} from "../src";
import { lookup } from "mime-types";
import fs from "fs";
import path from "path";
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
      sendFile: (url = "") => {
        const pth = path.join(__dirname, `../${url}`);
        const fileHeadType = lookup(pth);
        if (fileHeadType) {
          res.writeHead(200, {
            "Content-Type": fileHeadType.toString(),
          });
          const rs = fs.createReadStream(pth);
          rs.pipe(res);
        } else {
          res.status(404).send("Not found");
        }
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
        sendFile: (url = "") => {
          const pth = path.join(__dirname, `../${url}`);
          const fileHeadType = lookup(pth);
          if (fileHeadType) {
            res.writeHead(200, {
              "Content-Type": fileHeadType.toString(),
            });
            const rs = fs.createReadStream(pth);
            rs.pipe(res);
          } else {
            res.status(404).send("Not found");
          }
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
