// import UsersPage from "./pages/UserPage/UserPage";


// function App() {
//   return (

//       <UsersPage />

//   );
// }

// export default App;
// src/App.tsx


import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;