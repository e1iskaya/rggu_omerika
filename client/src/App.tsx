import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Database from "./pages/Database";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import NetworkVisualization from "./pages/NetworkVisualization";
import Events from "./pages/Events";
import Publications from "./pages/Publications";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/database" component={Database} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/network" component={NetworkVisualization} />
      <Route path="/events" component={Events} />
      <Route path="/publications" component={Publications} />
      <Route path="/about" component={About} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
