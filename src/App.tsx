import { Autocomplete } from "./components/Autocomplete";

function App() {
  return (
    <div className="App">
      <Autocomplete>
        <Autocomplete.Input placeholder="Enter an name" />

        <Autocomplete.List>
          <Autocomplete.ListItem value="teste">Teste</Autocomplete.ListItem>
          <Autocomplete.ListItem value="olar">olar</Autocomplete.ListItem>
        </Autocomplete.List>
      </Autocomplete>
    </div>
  );
}

export default App;
