import {useContext, useEffect, useState} from "react";
import Detail from "./Detail.tsx";
import {EntityType} from "../model/datatypes.ts";
import Tile from "./UI/Tile.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCategoryData} from "../utils/fetch.ts";
import NavigationContext from "../store/NavigationContext.tsx";
import {Icon} from "@iconify/react";


export default function Details() {
    const navCtx = useContext(NavigationContext);

    const [selectedEntityData, setSelectedEntityData] = useState<EntityType>();

    const {data, isLoading, isFetched, isError} = useQuery<EntityType[]>({
        queryKey: ["CategoryData", navCtx.nav.informationCategory!.id],
        queryFn: () => getCategoryData({category: navCtx.nav.informationCategory!.id}),
        staleTime: 2 * 60 * 1000,
        enabled: navCtx.nav.informationCategory !== undefined,
    });

    useEffect(() => {
        if (isFetched && data && navCtx.nav.entityId) {
            const entityData = data.find(entity => entity.id === navCtx.nav.entityId);
            setSelectedEntityData(entityData);
        } else {
            setSelectedEntityData(undefined);
        }
    }, [isFetched, data, navCtx.nav.entityId]);

    function handleShowDetails(id: string) {
        const entityData = data!.find(entity => entity.id === id);
        setSelectedEntityData(entityData);
    }

    function handleHideDetails() {
        setSelectedEntityData(undefined);
    }

    const noData = (
        <Tile title={navCtx.nav.informationCategory!.description} cssClass="w-full"
              onClose={() => navCtx.setTopicArea(navCtx.nav.topicArea!)}>
            <p className="py-4">
                {isLoading ? "Die Daten werden geladen ..." : "In dieser Kategorie gibt es noch keine Daten"}
            </p>
        </Tile>
    );

    return (
        <div className={`flex ${selectedEntityData ? "h-full" : undefined}`}>
            {isLoading && noData}
            {isError && noData}
            {
                isFetched && data && data.length
                    ? <>
                        <Tile title={navCtx.nav.informationCategory!.description}
                              cssClass={`${selectedEntityData ? "w-[35%]" : "w-full"}`}
                              onClose={() => navCtx.setTopicArea(navCtx.nav.topicArea!)}>
                            <ul>
                                {data.map(entity => (
                                    <li key={entity.id}>
                                        <button onClick={() => handleShowDetails(entity.id)}
                                                className="w-full flex gap-4 py-2 text-md text-neutral-800 hover:bg-neutral-200">
                                            <Icon icon={navCtx.nav.informationCategory!.icon}
                                                  className="text-2xl text-primary-300"/>
                                            <div className="flex-1 flex gap-4">
                                                <p>{entity.name}</p>
                                                {entity.meta?.label === "1" &&
                                                    <Icon icon="clarity:exclamation-triangle-line" className="text-2xl text-amber-500"/>}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </Tile>
                        {selectedEntityData
                            && <Detail entityData={selectedEntityData} onClose={handleHideDetails}/>
                        }
                    </>
                    : <>{noData}</>
            }
        </div>
    );
}