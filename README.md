# Serverless request validator

This is made to be used in Vercel serverless applications, it can be used with Javascript and Typescript.

To install it:

```sh
npm install serverless-request-validator
```
or
```
yarn add serverless-request-validator
```

## Using the library

If you are using Javascript:

```js
const { Validate } = require("serverless-request-validator");
```

With Typescript:

```ts
import { Validate } from "serverless-request-validator/ts";
```

<br/>

#### Handling one-method-only requests

If an endpoint in your app should only accept one HTTP method, use the property named as the only method allowed.
For example:


**Javascript**

```js
// /api/index.js
const { Validate } = require("serverless-request-validator")

// Only HTTP `GET` is allowed
module.exports = Validator.get((req, res)=>{
    res.send("get request")
})

```

**Typescript**

```ts
// /api/index.ts
import { Validator } = from "serverless-request-validator/ts";

// Only HTTP `GET` is allowed
export default Validator.get((req, res)=>{
    res.send("get request")
})

```

> The default export means that the application endpoint will only allow a request using the `GET` method.
> If a request is made using a different method, it will respond with a `405` (method not allowed) status code, and saying the method can't be used in that url (like in Express)


#### Handling multi-method requests

This makes it possible for an endpoint to handle requests of different methods. Very similar to the previous example:

**Javascript**

```js
// /api/index.js
const { Validate } = require("serverless-request-validator")

// GET, POST and PUT are allowed.
module.exports = Validator({
  get(req, res) {
    res.send("a get request");
  },
  post(req, res) {
    res.send(`A ${req.method} request`);
  },
  put(req, res) {
    res.send("a put request");
  },
})

```

**Typescript**

```ts
// /api/index.ts
import { Validate } = from "serverless-request-validator/ts";

// GET, POST and PUT are allowed
export default Validate({
  get(req, res) {
    res.send("Hello");
  },
  post(req, res) {
    res.send(`A ${req.method} request`);
  },
  put(req, res) {
    res.send("a PUT request");
  },
})

```

> In this case, this function will handle `GET`,`POST` and `PUT` methods sent to it.
> As in the previous example, other methods different that the allowed ones will send a `405` status code and the message saying the method can't be used in that url.

That's basically it, hopefuly it makes it easier to have different reponses for different methods=)