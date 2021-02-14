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
const path = require("path");
/**
 * @type { import("./src/index").IValidate }
 */
const Validate = (handlers) => {
  /**
   * @type { import("./src").RequestValidatorHandlerType }
   */
  const validateResponseCallback = function (req, res) {
    const _handlers = { ...handlers };
    /**
     * @type { import("./src").ValidateResponse<any> }
     */
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
    };
    try {
      RequestMethods.forEach((requestMethod) => {
        if (!handlers[requestMethod]) {
          /**
           * @type { import("./src").RequestValidatorHandlerType }
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
     * @type { import("./src").RequestValidatorHandlerType }
     */
    handler
  ) => {
    /**
     * @type { import("./src").RequestValidatorHandlerType }
     */
    const responseCb = (req, res) => {
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
module.exports = { Validate };
