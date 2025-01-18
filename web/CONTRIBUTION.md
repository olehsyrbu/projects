# Design Decisions

Read over main concepts.

## Layers

Application consists of four layers: `Core`, `Modules`, `Features`, and `Tools`.

Layers are groups of packages with different proposes.

Main constraint for layers is that dependencies should go only in one direction from example Features → Modules → Core layer and Features → Core,
and not vice versa.

`Tools` layer stays aside and provides tests utilities, mock builders/storage, various CLI scripts for project infrastructure.

Before we move on to the purpose of each layer, let's get familiar with the basic concepts of `Package`, `Component` and `Module`.

### Package

Everything in application is build withing packages. Package is a folder that contains `index.js` file. So our package is not a npm-kind package, however it shouldn't be a problem to create one if needed.

One of the purposes of `index.js` file is to explicitly separate `public` and `private` dependencies and hide folder
structure details from upper levels (with minor exception for modules).

#### Naming conventions

For package names (aka folders) we prefer `kebab-case-notation`, with an exception for React components folders.

For source code files, we use `camelCaseNotation`. It's possible to use suffixes like `.test.js`.

For example:

```
my-package    ✅ Correct package naming
└─index.js

myPackage     ❌ Wrong package naming
└─index.js

MyComponent           ✅ Correct React component naming
├─MyComponent.jsx
├─MyComponent.css
└─index.js

my-react-component    ❌ Wrong React component naming
├─MyComponent.jsx
├─MyComponent.css
└─index.js
```

#### Named Exports

Use named export instead of default exports (with exception for `Features` layer)

It gives us next key benefits

- explicitly control on what is exported to upper levels (just inspect index.js)
- separate public vs private, able to change folder structure and files inside package
- easy to refactor (rename package exports)

For example:

```
utils/
   some-folder-1/
        someFile1.js
        someFile2.js
        index.js  // <-- exports only 'public' used in upper levels

    index.js // <-- exports only 'public' used in upper levels

```

Consumer of the `package` just write import without package exploration

```ts
import { logger, withLogger, createLogger } from '@/core/logger';
import { useDevice } from '@/core/hooks';
```

#### Edge Cases

1. Don't create packages with only one `index.js` inside a folder
1. Don't put `index.js` inside a module's root folder

### Component

We use react components to build UI, because UI usually build with
tree-like structure of components, we provide next rules to organize
components into packages

1. One component per file
1. Add styles in sep file with the same name but diff extensions
1. Create packages for component when it has more than one file
1. use `camelCaseNotation` for folders created for component (it's an exception only for that case)
1. Create child components in the same folder

Examples:

No styles, no child components

```
|-MySingleComponentWithoutStyles.jsx  <- just a file with not need to create a folder
```

With styles, no child components

```
|-MyComponent/
    |-MyComponent.jsx
    |-MyComponent.css
    |-index.js
```

With styles and child components

```
|-MyComplexComponent/
    |-MyLocalPartOfComplexComponent3/
        |-MyLocalPartOfComplexComponent3.jsx
        |-MyLocalPartOfComplexComponent3.css
        |-index.js
    |-MyComplexComponent.jsx
    |-MyComplexComponent.css
    |-MyLocalPartOfComplexComponent1.jsx
    |-MyLocalPartOfComplexComponent2.jsx
    |-index.js                              <- in most cases you would export only `MyComplexComponent`
```

### Module

It's goal to group UI and supporting code routines over special functional or business solutions.
Main propose is to share code between features or other modules

Module should have at least one of the next packages

- components/ - react components
- utils/ - various helpers dedicated for that particular module
- hooks/ - react hooks for that particular module

For example

```
my-module/
    components/
        MyComponent.jsx
        index.js          <- exports compoents to public
    hooks/
        useMyModuleResults.js
        index.js          <- exports hooks to public
    utils/
        myModuleUtil.js
        index.js          <-  exports utils to public

```

Module's root folder shouldn't have a `index.js`

So consumer of module expects for at least one standard sub package from module

```ts
import { MyComponent } from '@/modules/my-module/components';
import { useMyModuleResults } from '@/modules/my-module/hooks';
import { myModuleUtil } from '@/modules/my-module/utils';
```

### Core Layer

Common packages reused across all other levels, for example api calls to server,
logger, components, hooks and utils

All core packages should be located in `<root>/core`

### Modules Layer

It's a group of react ui modules (see `Module`). Located under `<root>/modules` folder

Main propose to build features from modules

### Features Layer

It's a place to combine modules and other packages in concrete business use case

Located under `<root>/features`.

By its structure, features resemble a `Module`, however feature created for concrete business use case

### Tools Layer

It's a location for cli scripts required by project's infrastructures. Also, we put here
common testing utilities and mock data

## Project Structure

### Root folders overview

- `core/` - core packages
- `modules/` - react ui modules
- `features/` - business use cases
- `tools/` - cli scripts and testing utilities
- `images/` - static assets

Example:

```

|-core/
    |-api/
    |-logger/
    |-components/
    |-config/
    |-hooks/
    |-utils/
|-modules/
    |-my-module/
        |-components/
            |-MyModuleSpecificComponent1.jsx
            |-MyModuleSpecificComponent2.jsx
            |-index.jsx
        |-hooks/
            |-myModuleEffects1.jsx
            |-myModuleEffects2.jsx
            |-myModuleEffects3.jsx
            |-index.jsx
        |-utils/
            |-myModuleHelper.jsx
            |-index.jsx
    |-other-feature/
|-features/
    my-feature/
        |-components/
        |-hooks/
        |-utils/
```

## Coding Style

Prettier and ESLint are here to help. You're free to use these tools locally as you like. Both formatting and lint checks run during CI pipeline. Integrating Prettier and ESLint with your editor/IDE is highly recommended.

## Testing

### Test Files Naming

All test files should be named using `.test` suffix.

`Core` and `Modules` test files should be placed next to the source file:

```
someUtilHere.js
someUtilHere.test.js
```

### Testing according to layers

Each layer has a primary level of testing

1. Core -> Unit Testing -> Integration Testing
2. Modules -> Integration Testing -> Unit Testing
3. Features -> E2E Testing -> Integration Testing

It doesn't mean that you can't write integration test for `Core` or unit test for `Features`.

- [Unit vs Integration vs E2E](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-testing-mistakes)

#### Unit Testing

`Core` layer should be fully covered by unit tests. Other layers utils and hooks should be covered with unit tests as well.

For UI testing we're using `testing-library/react`.

- [Intro for Testing Library](https://testing-library.com/docs/)
- [Guided Principles](https://testing-library.com/docs/guiding-principles)
- [How to Use React Testing Library](https://www.robinwieruch.de/react-testing-library)

##### Utils

Try to write utils as pure functions, so it'll be possible to apply [jest snapshots testing](https://jestjs.io/docs/snapshot-testing).

In case you have a function with a lot of dependencies, try next pattern for your function under test:

```js
import { doSomething as _doSomething } from './doSomething';

function someMyFunction(params, { doSomething: _doSomething } = deps) {
  // call
  deps.doSomething();
}
```

##### Hooks

Consider an extension [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library#react-hooks-testing-library).

For more advanced usage:

- [How to test custom React hooks](https://kentcdodds.com/blog/how-to-test-custom-react-hooks)

##### Components

UI testing is always tricky, however `testing-library` provides nice trade-offs.
Also, we introduce `jest-axe` so it should be a required part for component under test:

- [Jest Axe](https://github.com/nickcolley/jest-axe)

#### Integration Testing

It's important to mock as small as possible, because a lot of mocks makes test
hard to maintain, so it's always a trade off

1. For mocking network [MSW](https://mswjs.io/)
1. For testing utils and common mocks use `tools/test-*` packages, for example `tools/test-server-handler`
1. For test data use/write 'fixtures' from `tools/test-fixtures`

##### Server Mocks

To emulate server endpoint add you handler to `tools/test-server/handlers`

Then use next template

```ts
import { setupServer } from '@/tools/test-server';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('do test', () => {
  // do query, check use cases
});
```

##### Render App Contexts

To simplify rendering for components instead of `testing-lib/react` use `tools/test-app-utils`

so render will wrap your component with all common providers

```tsx
/**
 * @jest-environment jsdom
 */

import { render, client } from '@/tools/app-test-utils';
import { MyComponent } from './MyComponent';
import { setupServer } from '@/tools/test-server';

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => client.clearStore());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('displays account info', async () => {
  // render connect to apollo provider in render
  await render(<MyComponent />);
});
```
