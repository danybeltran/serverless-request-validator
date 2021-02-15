/// <reference types="./src/index"/>
const RequestMethods = [
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
const { lookup } = require("mime-types");
const fs = require("fs");
/**
 * @type { import("serverless-request-validator/src").IValidate }
 */
const Validate = (handlers) => {
  /**
   * @type { import("serverless-request-validator/src").RequestValidatorHandlerType }
   */
  const validateResponseCallback = function (req, res) {
    const _handlers = { ...handlers };
    /**
     * @type { import("serverless-request-validator/src").ValidateResponse<any> }
     */
    const vResponse = {
      ...res,
      sendStatus: (code, message = "") => {
        res.status(code).send(message);
      },
      sendFile: (url = "") => {
        try {
          const fileHeadType = lookup(url);
          if (typeof fileHeadType === "string") {
            res.writeHead(200, {
              "Content-Type": fileHeadType.toString(),
            });
            const rs = fs.createReadStream(url);
            rs.pipe(res);
          } else {
            res.status(404).send("File not found");
          }
        } catch (err) {
          throw err;
        }
      },
    };
    try {
      RequestMethods.forEach((requestMethod) => {
        if (!handlers[requestMethod]) {
          /**
           * @type { import("serverless-request-validator/src").RequestValidatorHandlerType }
           */
          const invalidMethodCb = (req, res) => {
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
  Validate[requestMethod] = (
    /**
     * @type { import("serverless-request-validator/src").RequestValidatorHandlerType }
     */
    handler
  ) => {
    /**
     * @type { import("serverless-request-validator/src").RequestValidatorHandlerType }
     */
    const responseCb = (req, res) => {
      const { method } = req;
      const vResponse = {
        ...res,
        sendStatus: (code, message = "") => {
          res.status(code).send(message);
        },
        sendFile: (url = "") => {
          try {
            const fileHeadType = lookup(url);
            if (typeof fileHeadType === "string") {
              res.writeHead(200, {
                "Content-Type": fileHeadType.toString(),
              });
              const rs = fs.createReadStream(url);
              rs.pipe(res);
            } else {
              res.status(404).send("File not found");
            }
          } catch (err) {
            throw err;
          }
        },
      };
      if (method.toLowerCase() === requestMethod) {
        handler(req, vResponse);
      } else {
        vResponse.sendStatus(405, `Cannot ${method} ${req.url}`);
      }
    };
    return responseCb;
  };
});
exports.RequestMethods = RequestMethods;
exports.Validate = Validate;
module.exports = Validate;
