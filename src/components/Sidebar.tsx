import {useContext, useEffect, useMemo, useState} from "react";
import logoImg from "../assets/logo-tuteco-512.png";
import useMediaQuery from "../hooks/useMediaQuery.ts";
import ButtonWithIcon from "./UI/ButtonWithIcon.tsx";
import StructureContext from "../store/StructureContext.tsx";
import NavigationContext from "../store/NavigationContext.tsx";


const Sidebar = () => {
    const structureCtx = useContext(StructureContext);
    const navCtx = useContext(NavigationContext);

    const filteredCategories = useMemo(() => {
        if (navCtx.nav.topicArea) {
            return structureCtx.informationCategories.filter(
                category => category.id.charAt(0) === navCtx.nav.topicArea!.id,
            );
        }
        return [];
    }, [structureCtx.informationCategories, navCtx.nav.topicArea]);

    const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);

    const isSmallScreen = useMediaQuery("(max-width: 1280px)");
    const isLowScreen = useMediaQuery("(max-height: 600px)");

    useEffect(() => {
        if (isSmallScreen) {
            setIsDescriptionVisible(false);
        }
    }, [isSmallScreen]);

    function toggleDescriptionVisible() {
        setIsDescriptionVisible(prevState => !prevState);
    }

    return (
        <aside
            className={`relative h-screen bg-neutral-700 border-t-4 border-t-primary-200 ${isSmallScreen || !isDescriptionVisible || !filteredCategories.length ? "w-[100px]" : "w-[355px]"} overflow-auto`}>
            <div className="w-full h-20 bg-neutral-800">
                <button className="h-full py-4 pl-6" onClick={navCtx.resetNav}>
                    <img src={logoImg} alt="Tuteco GmbH" className="h-full"/>
                </button>
            </div>
            <div className="mt-8">
                <ul className="flex flex-col">
                    {filteredCategories.map(category => (
                        <li key={category.id} className="list-none">
                            <ButtonWithIcon icon={category.icon} showIcon
                                            description={category.description}
                                            showDescription={!isSmallScreen && isDescriptionVisible}
                                            cssClass="px-8" dark
                                            focus={navCtx.nav?.informationCategory?.id === category.id}
                                            onClick={() => navCtx.setInformationCategory(category)}
                                            showTooltip
                                            data-tooltip-hidden={!isSmallScreen && isDescriptionVisible}
                                            data-tooltip-id="navigation-tooltip"
                                            data-tooltip-place="right"
                                            data-tooltip-position-strategy="fixed"
                                            data-tooltip-content={category.description}/>
                        </li>
                    ))}
                </ul>
            </div>

            {!isSmallScreen && !isLowScreen && <div
                className={`absolute left-0 bottom-0 h-20 w-full py-4 pl-8 bg-neutral-800`}>
                <ButtonWithIcon
                    icon={isDescriptionVisible ? "octicon:sidebar-expand-24" : "octicon:sidebar-collapse-24"} showIcon
                    cssClass="h-full" dark
                    onClick={toggleDescriptionVisible}/>
            </div>}
        </aside>
    );
};

export default Sidebar;
