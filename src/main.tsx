import { createRoot } from "react-dom/client";
import { toast } from "sonner";
import App from "./App.tsx";
import "./index.css";

// Safety net for promises that reject without a local try/catch — otherwise
// the failure vanishes into the console with zero user-facing indication.
window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    toast.error("Something went wrong. Please try again.");
});

createRoot(document.getElementById("root")!).render(<App />);
