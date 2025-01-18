# TabNav

Tabs interface with client-side routing. It provides a set of components that basically are tiny wrappers around React Router components (`TabNav` as `Switch`, `TabLink` as `NavLink`, `TabRoute` as `Route`). Plus, it handles appearance for different viewport sizes. All defined routes are relative.

```jsx
<TabNav>
  <TabNavPanel heading="Tabs">
    <div>
      <TabLink to="tab-1">Tab 1</TabLink>
      <TabLink to="tab-2">Tab 2</TabLink>
      <TabLink to="tab-3">Tab 3</TabLink>
    </div>
  </TabNavPanel>

  <TabRoute path="tab-1" heading="Tab 1">
    <Tab1 />
  </TabRoute>

  <TabRoute path="tab-2" heading="Tab 2">
    <Tab2 />
  </TabRoute>

  <TabRoute path="tab-3" heading="Tab 3">
    <Tab3 />
  </TabRoute>
</TabNav>
```

## Component API

### TabNav

Parent component of the tabs UI. It wraps the whole content into `<div>` element and handles appearance depending on viewport size.

```jsx
<TabNav>
  <TabNavPanel>...</TabNavPanel>
  <TabRoute path="...">...</TabRoute>
</TabNav>
```

| Prop        | Type | Required |
| ----------- | ---- | -------- |
| `children`  | node | Yes      |
| `div` props |      | No       |

### TabNavPanel

Wraps all inner content into a `div` that is always displayed on the left side on large viewports and displayed as the first view for small ones. All `TabLink`s should be placed inside `TabNavPanel`. Though, you are free to use any component hierarchy.

`heading` property is used as title for heading component for small viewport.

```jsx
<TabNavPanel heading="Heading">
  <div>
    <TabLink to="tab-1">Tab 1</TabLink>
    <TabLink to="tab-2">Tab 2</TabLink>
  </div>
  ...
</TabNavPanel>
```

| Prop        | Type   | Required |
| ----------- | ------ | -------- |
| `heading`   | string | No       |
| `children`  | node   | Yes      |
| `div` props |        | No       |

### TabLink

Wrapper around `NavLink` from `react-router-dom`. It also decorates resulting element with styles.

`to` prop represents relative path segment.

```jsx
<TabLink to="tab-1">Link</TabLink>
```

| Prop       | Type   | Required |
| ---------- | ------ | -------- |
| `to`       | string | Yes      |
| `children` | node   | Yes      |

### TabRoute

Wrapper around `Route` from `react-router-dom`. Displayed by `TabNav` when user-agent location matches relative path segment defined by `path` prop.

`heading` property is used in the same way as in `TabNavPanel` and sets title for heading component for small viewport.

```jsx
<TabRoute path="tab-1" heading="Content">
  <Component />
</TabRoute>
```

| Prop       | Type   | Required |
| ---------- | ------ | -------- |
| `path`     | string | Yes      |
| `heading`  | string | Yes      |
| `children` | node   | Yes      |
