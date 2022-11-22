# react-auto-complete

An awesome `Auto Complete` for your React application.

## How to install in your project

```
# Yarn
yarn add react-auto-complete

# NPM
npm install react-auto-complete
```

## How to run locally

First, you need to clone the repository

```
git clone https://github.com/jgamaraalv/react-auto-complete react-auto-complete
```

Then you can run

```
# Yarn
yarn install
yarn dev

# NPM
npm install
npm dev
```

## How to use the Autocomplete Component

You can use the pre compounded component like the example below

```jsx
  import Autocomplete from "react-auto-complete";

  function App() {
    const { run, data } = useAsync<PromiseType<ReturnType<typeof products>>>();

    useEffect(() => {
      run(products());
    }, []);

    async function searchProductHandler(
      event: React.ChangeEvent<HTMLInputElement>
    ) {
      run(products(event.target.value));
    }

    return (
      <div>
        <Autocomplete options={data} onSearch={searchProductHandler} onOptionSelected={(selectedValue) => console.log(selectedValue)} />
      </div>
    );
  }

  export default App;
```

Or you can compound by yourself

```jsx
import { Autocomplete } from "./components/Autocomplete";

function App() {
  return (
    <div>
      <Autocomplete>
        <Autocomplete.Input placeholder="Input value" />

        <Autocomplete.List>
          <Autocomplete.ListItem value="value1">Value 1</Autocomplete.ListItem>
          <Autocomplete.ListItem value="value2">Value 2</Autocomplete.ListItem>
        </Autocomplete.List>
      </Autocomplete>
    </div>
  );
}

export default App;
```
