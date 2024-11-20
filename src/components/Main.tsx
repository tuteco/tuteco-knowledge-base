import Welcome from "./Welcome.tsx";
import Header from "./Header.tsx";
import Details from "./Details.tsx";
import {useContext} from "react";
import NavigationContext from "../store/NavigationContext.tsx";


export default function Main() {
    const navCtx = useContext(NavigationContext);

    return (
        <div className="flex-1 overflow-y-auto"
             style={{
                 backgroundImage: "repeating-radial-gradient(ellipse at 0 0, transparent 0, hsl(0, 0%, 95%) 1000px), repeating-linear-gradient(#f2f2f2, hsla(67, 96%, 38%, 0.1))",
             }}>
            {
                navCtx.nav?.topicArea
                    ? <Header/>
                    : <Welcome/>
            }
            {
                navCtx.nav?.informationCategory
                    ? <Details/>
                    : undefined
            }
        </div>
    );
}