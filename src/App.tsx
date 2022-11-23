import React, { useEffect } from "react";

import Autocomplete from "./components/Autocomplete";
import products from "./services/products";
import useAsync, { PromiseType } from "./hooks/useAsync";
import "./global.css";

function App() {
  const { run, data } = useAsync<PromiseType<ReturnType<typeof products>>>();

  useEffect(() => {
    void run(products());
  }, []);

  async function searchProductHandler(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    void run(products(event.target.value));
  }

  return (
    <div>
      <Autocomplete
        options={data}
        onSearch={searchProductHandler}
        onOptionSelected={(selectedValue) => console.log(selectedValue)}
      />
    </div>
  );
}

export default App;
