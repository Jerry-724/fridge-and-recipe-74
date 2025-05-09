import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "./context/AuthContext";
import { InventoryProvider } from "./context/InventoryContext";
import { RecipeProvider } from "./context/RecipeContext";

import AuthPage from "./pages/AuthPage";
import InventoryPage from "./pages/InventoryPage";
import RecipePage from "./pages/RecipePage";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/AuthLayout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <InventoryProvider>
            <RecipeProvider>
              {/* Remove duplicate Toaster component, keep only one */}
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<AuthPage />} />

                  {/* Protected routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/recipe" element={<RecipePage />} />
                    <Route path="/mypage" element={<MyPage />} />
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </RecipeProvider>
          </InventoryProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
