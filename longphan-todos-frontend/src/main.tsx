import { render } from "preact";
import { App } from "./app.tsx";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { PrimeReactProvider } from "primereact/api";

render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>,
  document.getElementById("app")!,
);
