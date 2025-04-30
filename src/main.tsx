import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GoogleDrivePicker from "./picker.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleDrivePicker />
  </StrictMode>
);
