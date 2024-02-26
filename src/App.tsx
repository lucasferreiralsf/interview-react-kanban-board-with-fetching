import "./App.css";
import KanbanBoard from "./components/kanban-board";
import Navbar from "./components/navbar";

const title = "Kanban Board";

function App() {
  return (
    <div>
      <Navbar header={title}></Navbar>
      <KanbanBoard />
    </div>
  );
}

export default App;
