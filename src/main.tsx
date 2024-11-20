import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/react-query";
import {StructureContextProvider} from "./store/StructureContext.tsx";
import {NavigationContextProvider} from "./store/NavigationContext.tsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false}/>
            <StructureContextProvider>
                <NavigationContextProvider>
                    <App/>
                </NavigationContextProvider>
            </StructureContextProvider>
        </QueryClientProvider>
    </StrictMode>,
);
