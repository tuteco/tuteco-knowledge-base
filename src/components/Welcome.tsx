import ButtonWithIcon from "./UI/ButtonWithIcon.tsx";
import {useContext} from "react";
import StructureContext from "../store/StructureContext.tsx";
import NavigationContext from "../store/NavigationContext.tsx";


export default function Welcome() {
    const structureCtx = useContext(StructureContext);
    const navCtx = useContext(NavigationContext);

    return (
        <div className="h-full flex justify-center items-center">
            <div className="-mt-[10vh]">
                <h1 className="w-full text-xl font-bold text-neutral-800">Willkommen bei der Knowledge Base</h1>
                <p className="w-full mt-4 text-lg text-neutral-500">Wähle den Themenbereich aus</p>
                <ul className="mt-8">
                    {structureCtx.topicAreas.map(topic => {
                        return (
                            <li key={topic.id}>
                                <ButtonWithIcon icon={topic.icon} showIcon
                                                description={topic.description} showDescription
                                                onClick={() => navCtx.setTopicArea(topic)}/>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}