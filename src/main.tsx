import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { WalletProvider } from "./providers/WalletProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <WalletProvider>
      <App />
    </WalletProvider>
  </HelmetProvider>
);
