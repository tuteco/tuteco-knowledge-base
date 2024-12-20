import {EntityType} from "../model/datatypes.ts";
import Links from "./Links.tsx";
import Tile from "./UI/Tile.tsx";
import {useState} from "react";
import EntityProperty from "./EntityProperty.tsx";

type DetailPropsType = {
    entityData: EntityType,
    onClose: () => void
}

const Detail = ({entityData, onClose}: DetailPropsType) => {
    const [showLinks, setShowLinks] = useState<boolean>(true);

    function handleShowLinks() {
        setShowLinks(true);
    }

    function handleHideLinks() {
        setShowLinks(false);
    }

    return (
        <div className="flex-1 h-full flex flex-col">
            <Tile title={entityData.name} label={entityData.meta?.label} cssClass="flex-1"
                  onClose={onClose}>
                <div
                    className={`w-full h-full grid ${entityData.notes ? 'grid-cols-2' : 'grid-cols-1'} text-md text-neutral-800`}>
                    <div className="col-span-1 px-4">
                        <ul>
                            {entityData.properties.map((property, index) =>
                                <EntityProperty key={index} property={property}/>)}
                        </ul>
                    </div>
                    {entityData.notes &&
                        <div className="col-span-1 px-4">
                            <ul>
                                <EntityProperty property={entityData.notes}/>
                            </ul>
                        </div>
                    }
                </div>
                {!showLinks &&
                    <div className="mt-6 text-right text-sm text-primary-300">
                        <button onClick={handleShowLinks}
                                className="p-4 hover:text-neutral-700">
                            Verknüpfungen einblenden...
                        </button>
                    </div>
                }
            </Tile>
            {entityData?.links && showLinks && <Links linksData={entityData.links} onClose={handleHideLinks}/>}
        </div>
    );
};

export default Detail;
