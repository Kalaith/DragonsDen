import React from "react";
import { GamePage } from "./pages/GamePage";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import { useAuthSession } from "./hooks/useAuthSession";
import "./styles/globals.css";

function App() {
  useAuthBootstrap();
  useAuthSession();
  return <GamePage />;
}

export default App;
