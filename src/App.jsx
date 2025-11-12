import { Route, Routes } from "react-router-dom"
import Body from "./components/body"

import AuthPage from "./components/auth"
import Error404 from "./Error404";
import MyExpenseTracker from "./components/myExpense";
import LeaderBoard from "./components/leaderBoard";
import ExpenseReport from "./components/expenseReport";


function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Body></Body>}>
          <Route path="/" element={<MyExpenseTracker></MyExpenseTracker>}></Route>
          <Route path="/leaderboard" element={<LeaderBoard></LeaderBoard>}></Route>
          <Route path="/report" element={<ExpenseReport></ExpenseReport>}></Route>
          <Route path="/Auth" element={<AuthPage></AuthPage>}></Route>
        </Route>
        <Route path="*" element={<Error404></Error404>} />
      </Routes>
    </>
  );
}

export default App
