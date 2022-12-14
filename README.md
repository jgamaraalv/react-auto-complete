# react-auto-complete

An awesome `Auto Complete` for your React application. <br />
Live preview: https://react-ac-4.vercel.app/

## How to install in your project

```
# Yarn
yarn add @jgamaraalv/react-auto-complete

# NPM
npm install @jgamaraalv/react-auto-complete
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

# Run locally
yarn dev

# Unit tests
yarn test:unit

# NPM
npm install

# Run locally
npm dev

# Unit tests
npm test:unit
```

## How to use the Autocomplete Component

You can use the pre compounded component like the example below

```jsx
  import Autocomplete from "@jgamaraalv/react-auto-complete";
  // if you are running locally
  // import { Autocomplete } from "./components/Autocomplete";

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
import { Autocomplete } from "@jgamaraalv/react-auto-complete";
// if you are running locally
// import { Autocomplete } from "./components/Autocomplete";

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
