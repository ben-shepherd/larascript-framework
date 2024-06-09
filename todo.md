## What to work on next?
- database connections (so models can handle different data sources )

## Errors
- TypeError: Cannot read properties of undefined (reading 'findByEmail')
    at exports.default (C:\Users\bensh\Documents\Projects\TarkovFlea\src\core\domains\auth\actions\login.ts:14:65)
```
curl --location 'http://localhost:3000/api/auth/login' \
--header 'X-Authorization: odkf-0q9k09rf2309jf09w3fj0w9fgjwoifjwoiefjowi' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin3@example.com",
    "password": "password"
}'
```

### Future ideas
- Commands to make files e.g. a command to make a repository or a model
- Documentation
- Test suite
- Retry db connection attempts