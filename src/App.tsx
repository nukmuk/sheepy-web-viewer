import Viewport from "./Viewport.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

function App() {

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            {/*<p className={"text-3xl font-bold underline"}>hello</p>*/}
            <Viewport/>
        </ThemeProvider>
    )
}

export default App
