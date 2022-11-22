import { useEffect } from "react";

import Autocomplete from "./components/Autocomplete";
import products, { Product } from "./services/products";
import useAsync, { PromiseType } from "./hooks/useAsync";

function App() {
  const { run, data } = useAsync<PromiseType<ReturnType<typeof products>>>();

  useEffect(() => {
    run(products());
  }, []);

  return (
    <div className="App">
      <Autocomplete options={data} />
    </div>
  );
}

export default App;
