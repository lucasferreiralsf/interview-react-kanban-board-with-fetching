import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import KanbanBoard from "./components/kanban-board";
import Navbar from "./components/navbar";
import { Toaster } from "react-hot-toast";

const title = "Kanban Board";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Navbar header={title}></Navbar>
        <KanbanBoard />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
