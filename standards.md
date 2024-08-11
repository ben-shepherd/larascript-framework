# Coding Standards

### Naming Convetion Casing
- **Preferred casing:** camelCase

### File and Folder Naming

- All folders and files should be lowercase. Example: myService.ts
    - Exception: Interfaces should start with a capital "i". Example: IMyServiceInterface.ts

- Classes, Interfaces, Method and variables should follow camelCasing

- Type files should be suffixed with ".t.ts" Example: types.t.ts

- New features ideally should be self contained in app/domains or core/domains

    - More generic utility functions and helpers can sit outside of a domain

    - Interfaces should be used when interacting with classes and methods outside of it's self contained folder

## Import Standards
- All imports should be absolute.

- Prefixes available:
    - @src -> `/src`
    - @core -> `/src/core`
    - @app -> `/src/app`

Example
```ts
import MyService from '@app/domains/MyFeature/services/myService';
```

## Example

```
├── app/
│   ├── commands/
│   ├── events/
│   ├── models/
│   ├── observers/
│   ├── providers/
│   ├── repositories/
│   ├── routes/
│   └── domains/
│       ├── user/
│       │   ├── factory/
│       │   ├── repository/
│       │   ├── models/
│       │   ├── services/
│       │   └── types/
│       └── movie/
│           ├── factory/
│           ├── repository/
│           ├── exceptions/
│           ├── interfaces/
│           ├── services/
│           └── types/
├── core/
│   ├── domains/
│   │   └── database/
│   │       └── mongodb/
│   │           ├── services/
│   │           ├── interfaces/
│   │           ├── relationships/
│   │           └── exceptions/
│   └── make/
│       ├── base/
│       ├── commands/
│       ├── providers/
│       └── templates/
└── config/
    └── app.ts
```
