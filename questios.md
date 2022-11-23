### 1. What is the difference between Component and PureComponent? give an example where it might break my app.

The difference between Components and PureComponents is that PureComponents does shallow comparison on both props and state and helps to improves the perfomance of the app.
On the other hand, by doing only shallow comparisons, PureComponents can skips props updates for the whole component subtree if couldn't find difference in shallow comparison, as if we have a deep state, for example.
Shallow compares does check for equality. When comparing primitives values (numbers, strings) it compares their values. When comparing objects only their references are compared.
In React, every new rerender an object will have a different reference.

### 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

The problem is very similar to the one mentioned in the question above, because the `shouldComponentUpdate` can breaks the rerenderings of a part of component tree and this way block the context propagation of the states changes in the children components.

### 3. Describe 3 ways to pass information from a component to its PARENT.

1 - We can pass a function callback to the component children that will returns the value for us.

```jsx
  <Children onChangeValue={(value) => console.log(value)}>
```

2 - We can pass a `ref` to the children component, so we can acess the value with `ref.current` in the parent component.

```jsx
  const inputReft = useRef();

  <InputComponent ref={inputRef}>
```

3 - We can use a `Context` to share information between components, including parents and children that share this context, just like I did on the test.

### 4. Give 2 ways to prevent components from re-rendering.

We can use hooks to memoized values and functions and avoid unnecessary re-renderings.
The `useMemo` hook is used for values, and `useCallback` hook is used for functions.
These hooks make the values/functions only be updated if the reference values used by them undergo changes.
We can also replace `useState` with `useRef` when possible. For example, with uncontrolled inputs.

### 5. What is a fragment and why do we need it? Give an example where it might break my app.

In React, fragments allow us to return a list of children without adding extra nodes to the DOM, because in React we must wrap multiple elements in a container element like a `div`.
If we use no nodes in the DOM and no fragments and try to return multiple elements then we will break our app.
🐛 example:

```jsx
  function MyBreakableApp() {
    return (
      <p>Ops</p>
      <p>Something went wrong :/</p>
    )
  }
```

🤗 example:

```jsx
function MyAwesomeApp() {
  return (
    <>
      <p>Everything is</p>
      <p>gonna be alright</p>
    </>
  );
}
```

### 6. Give 3 examples of the HOC pattern.

Higher-Order Components (HOC) make it easy to pass logic to components by wrapping them and were heavily used before the hooks update.
When using multiple composed HOCs that all pass props to the element that's wrapped within them, it can be difficult to figure out which HOC is responsible for which prop. This can hinder debugging and scaling an application easily.
Examples that use HOC pattern: `ReduxProvider`, `ThemeProvider`, `BrowserRouter`, `IntlProvider` and so much more.
An application example:

```jsx
function withStyles(Component) {
  return (props) => {
    const style = {
      color: "red",
      fontSize: "1em",
      ...props.style,
    };

    return <Component {...props} style={style} />;
  };
}

const Text = () => <p style={{ fontFamily: "Inter" }}>Hello HOC!</p>;
const StyledText = withStyles(Text);
```

### 7. What's the difference in handling exceptions in promises, callbacks and async...await.

With callbacks we need to chain callback functions to catch errors or responses (the famous callback hell 👿).
For example:

```jsx
myPromise
  .then(() => {
    /* do something*/
  })
  .catch((err) => console.log(err));
```

With `async..await`, we need to use `try {} catch{}` to handle with exceptions.

```jsx
async function promisedFunction() {
  try {
    await thisPromiseWillFail();
  } catch (e) {
    console.log("that failed", e);
  }
}
```

This is because the async keyword implicitly creates a Promise for its function.
The only difference between these two is that the callback for catch() has it's own execution context, so variable scope works like you'd expect it to.

### 8. How many arguments does setState take and why is it async.

`setState` accepts two arguments. The first is the new state values, and the second is a callback function which gets called immediately after the setState is completed and the components get re-rendered.
The reason that `setState` is async its for performance improvements.
Because javascript its single thread and `setState` causes re-render, this can be an expensive synchronous operation and might leave the browser unresponsive and our users very sad :(

### 9. List the steps needed to migrate a Class to Function Component.

1 - First of all we need to switch from class to function, removes the `constructor` and the `render` method;
2 - By the way, we don't need `this` keyword everywhere anymore;
3 - Replaces the class methods to functions/arrow functions;
4 - So, we need to analyse the lifecycle methods and replace them to the correspondents hooks (99% with `useEffect`).
Thats it. Very concise but very effective.

### 10. List a few ways styles can be used with components.

1 - Inline styles

```jsx
<MyComponent style={{ marginTop: "10px", color: "red" }} />
```

2 - Global classes

```jsx
import "./my-global-styles.css";

<MyComponent className="someGlobalClassInGlobalStyles" />;
```

3 - Scoped classes (CSS Modules) - Like I did in the test

```jsx
import classes from "./my-classes.module.css";

<MyComponent className={classes.scopedClass} />;
```

4 - Extra (and my favorite) `styled-components`

```jsx
import styled from "styled-components";

export const StyledDiv = styled.div`
  background-color: red;
  padding: 20px;
`;
```

### 11. How to render an HTML string coming from the server.

By default (and for security reasons), React already renders HTML coming from the server as string.
So, if we want to execute the tags, like a HTML code, we need to use `dangerouslySetInnerHTML`.
(The name is self explanatory ✨).
