import {createPortal} from "react-dom";
import ButtonWithIcon from "./UI/ButtonWithIcon.tsx";
import {useContext} from "react";
import StructureContext from "../store/StructureContext.tsx";
import NavigationContext from "../store/NavigationContext.tsx";

export default function Header() {
    const structureCtx = useContext(StructureContext);
    const navCtx = useContext(NavigationContext);

    return (
        <>
            {createPortal(
                <ul className="flex justify-end">
                    {structureCtx.topicAreas.map(topic => {
                        return (
                            <li key={topic.id}>
                                <ButtonWithIcon description={topic.description} showDescription
                                                cssClass="px-8 hover:text-primary-200"
                                                dark focus={navCtx.nav.topicArea!.id === topic.id}
                                                onClick={() => navCtx.setTopicArea(topic)}/>
                            </li>
                        );
                    })}
                </ul>,
                document.getElementById("header-nav")!,
            )}
        </>
    );
}