import React, { useEffect } from "react";

import Autocomplete from "./components/Autocomplete";
import products from "./services/products";
import useAsync, { PromiseType } from "./hooks/useAsync";

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
      <Autocomplete options={data} onSearch={searchProductHandler} />
    </div>
  );
}

export default App;
