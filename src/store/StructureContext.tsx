import React, {createContext, ReactNode} from "react";
import {InformationCategoryType, TopicAreaType} from "../data/datatypes.ts";
import {useQuery} from "@tanstack/react-query";
import {getInformationCategories, getTopicAreas} from "../utils/fetch.ts";
import {Icon} from "@iconify/react";

type StructureContextType = {
    topicAreas: TopicAreaType[],
    informationCategories: InformationCategoryType[],
}

const StructureContext = createContext<StructureContextType>({
    topicAreas: [],
    informationCategories: [],
});

export const StructureContextProvider: React.FC<{ children: ReactNode }> = (props) => {

    const {
        data: topicAreas,
        isLoading: isLoadingTopicAreas,
        isFetched: isFetchedTopicAreas,
    } = useQuery<TopicAreaType[]>({
        queryKey: ["TopicAreas"],
        queryFn: getTopicAreas,
        staleTime: 2 * 60 * 1000,
    });

    const {
        data: informationCategories,
        isLoading: isLoadingInformationCategories,
        isFetched: isFetchedInformationCategories,
    } = useQuery<InformationCategoryType[]>({
        queryKey: ["InformationCategories"],
        queryFn: getInformationCategories,
        staleTime: 2 * 60 * 1000,
    });

    return (
        <>
            {
                isFetchedTopicAreas && topicAreas && isFetchedInformationCategories && informationCategories &&
                <StructureContext.Provider value={{
                    topicAreas,
                    informationCategories,
                }}>
                    {props.children}
                </StructureContext.Provider>
            }
            {
                (isLoadingTopicAreas || isLoadingInformationCategories) &&
                <section
                    className="w-[90%] max-w-[600px] mx-auto mt-4 bg-green-50 border-t-4 border-green-500 rounded-2xl shadow-2xl">
                    <div className="px-4 py-10 text-center text-green-900">
                        <div className="flex justify-center gap-4">
                            <Icon className="text-2xl" icon="line-md:loading-alt-loop"/>
                            <p className="text-lg">Daten werden geladen...</p>
                        </div>
                    </div>
                </section>
            }
            {
                ((!topicAreas && !isLoadingTopicAreas) || (!informationCategories && !isLoadingInformationCategories)) &&
                <section
                    className="w-[90%] max-w-[600px] mx-auto mt-4 bg-red-50 border-t-4 border-red-500 rounded-2xl shadow-2xl">
                    <div className="px-4 py-10 text-center text-red-900">
                        <div className="flex justify-center gap-4">
                            <Icon className="text-2xl" icon="clarity:error-standard-line"/>
                            <p className="text-lg">Daten konnten nicht geladen werden</p>
                        </div>
                    </div>
                </section>
            }
        </>
    );
};

export default StructureContext;
