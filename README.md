# jwt server

make a .env file with your DB_URI
`npm install` to get all dependencies

run one ( or more instances ) like this:

```
PORT=9000 SECRET=shared-secret node server.js
PORT=8000 SECRET=shared-secret node server.js

PORT=7777 SECRET=unique-secret node server.js
```

> 9000 and 8000 have the same secret key for encrypting / decrypting tokens, so they can decrypt each others' tokens.

> 7777 has a unique token, so the token's it creates aren't readable by other server
> instances. It can also not read the tokens from server 9000 or 8000.

use the salt-hash example program like `P=test123 node salt-hash.js`
