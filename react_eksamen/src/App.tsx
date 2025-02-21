import './App.css'
import AddUser from "./components/AddUser";
import GetUsers from "./components/GetUsers";
import GetUser from "./components/GetUser";
import DeleteUser from "./components/DeleteUser";

function App() {
  return (
    <>
    <div>
      <input type="text" placeholder='id' />
      <text>Kill me now</text>
      <button>death</button>
      <AddUser />
      <GetUsers />
      <GetUser />
      <DeleteUser />
    </div>
    </>
  )
}

export default App
