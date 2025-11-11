import { Route, Routes } from "react-router-dom"
import Body from "./components/body"
import MyExpense from "./components/myExpense"
import AuthPage from "./components/auth"
import Error404 from "./Error404";


function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Body></Body>}>
          <Route path="/" element={<MyExpense></MyExpense>}></Route>
          <Route path="/Auth" element={<AuthPage></AuthPage>}></Route>
        </Route>
        <Route path="*" element={<Error404></Error404>} />
      </Routes>
    </>
  );
}

export default App
