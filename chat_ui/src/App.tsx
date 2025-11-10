import "./App.css";
import { Routes, Route } from "react-router-dom";
import { HomeView } from "./views/HomeView";
import { lazy, Suspense } from "react";

const ChatView = lazy(() => import("./views/ChatView"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading Page... </div>}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/chat" element={<ChatView />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
