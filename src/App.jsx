import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routers/router";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        autoDismiss
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        icon
        theme="colored"
        pauseOnHover={false}
        rtl={false}
      />
    </QueryClientProvider>
  );
}

export default App;
