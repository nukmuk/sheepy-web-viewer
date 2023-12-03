import Viewport from "./Viewport.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";

function App() {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    return (
        <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
            {/*<p className={"text-3xl font-bold underline"}>hello</p>*/}
            <Viewport />
        </ThemeProvider>
    );
}

export default App;
