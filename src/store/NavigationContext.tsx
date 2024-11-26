import React, {createContext, ReactNode, useContext, useState} from "react";
import {InformationCategoryType, LinkType, NavigationType, TopicAreaType} from "../model/datatypes.ts";
import StructureContext from "./StructureContext.tsx";

type NavigationContextType = {
    nav: NavigationType,
    setTopicArea: (topicArea: TopicAreaType) => void,
    setInformationCategory: (category: InformationCategoryType) => void,
    resetNav: () => void,
    navigateToEntity: (link: LinkType) => void,
}

const NavigationContext = createContext<NavigationContextType>({
    nav: {},
    setTopicArea: () => {
    },
    setInformationCategory: () => {
    },
    resetNav: () => {
    },
    navigateToEntity: () => {
    },
});

export const NavigationContextProvider: React.FC<{ children: ReactNode }> = (props) => {
    const structureCtx = useContext(StructureContext);
    const [nav, setNav] = useState<NavigationType>({});

    function setTopicArea(topicArea: TopicAreaType) {
        // set new topic and initialize category and entity
        setNav({
            topicArea,
        });
    }

    function setInformationCategory(category: InformationCategoryType) {
        // set new information category, does not change the topic and initialize the entity
        setNav((prevState) => (
            {
                topicArea: prevState!.topicArea,
                informationCategory: category,
            }
        ));
    }

    function resetNav() {
        setNav({});
    }

    const navigateToEntity = (link: LinkType) => {
        // find information category
        const informationCategory = structureCtx.informationCategories.find(category => category.id === link.category);
        // find corresponding topic
        const topicArea = structureCtx.topicAreas.find(topic => topic.id === informationCategory!.id.charAt(0))!;

        setNav({
            topicArea,
            informationCategory,
            entityId: link.id,
        });
    };

    const navCtx = {
        nav,
        setTopicArea,
        setInformationCategory,
        resetNav,
        navigateToEntity,
    };

    return (
        <NavigationContext.Provider value={navCtx}>
            {props.children}
        </NavigationContext.Provider>
    );
};

export default NavigationContext;
