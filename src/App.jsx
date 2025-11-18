import { Route, Routes } from "react-router-dom";
import Body from "./components/body";

import AuthPage from "./components/auth";
import Error404 from "./Error404";
import MyExpenseTracker from "./components/myExpense";
import LeaderBoard from "./components/leaderBoard";
import ExpenseReport from "./components/expenseReport";
import AiChatInterface from "./components/AiChat";
import Profile from "./components/profile";
import ChatApp from "./components/chat";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Body></Body>}>
          <Route
            path="/"
            element={<MyExpenseTracker></MyExpenseTracker>}
          ></Route>
          <Route path="/profile" element={<Profile></Profile>}></Route>
          <Route
            path="/leaderboard"
            element={<LeaderBoard></LeaderBoard>}
          ></Route>
          <Route
            path="/report"
            element={<ExpenseReport></ExpenseReport>}
          ></Route>
          <Route path="/chat" element={<ChatApp></ChatApp>}></Route>
          <Route
            path="/Expense/AI"
            element={<AiChatInterface></AiChatInterface>}
          ></Route>
          <Route path="/Auth" element={<AuthPage></AuthPage>}></Route>
        </Route>
        <Route path="*" element={<Error404></Error404>} />
      </Routes>
    </>
  );
}

export default App;
