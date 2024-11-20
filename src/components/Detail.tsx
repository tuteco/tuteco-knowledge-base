import {EntityType} from "../data/datatypes.ts";
import Links from "./Links.tsx";
import Tile from "./UI/Tile.tsx";
import {useState} from "react";

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
        <div className='flex-1 h-full flex flex-col'>
            <Tile title={entityData.name} label={entityData.meta?.label} cssClass="flex-1"
                  onClose={onClose}>
                <div className="w-full h-full grid grid-cols-2 text-md text-neutral-800 px-4">
                    <div className="col-span-1">
                        <ul>
                            {entityData.properties.map((property) => {
                                return (
                                    <li key={property.key} className="py-3">
                                        {property.value.map((item, index) => {
                                            return typeof item === "object"
                                                ? <a key={`${property.key}-${index}`}
                                                     className="w-full block underline"
                                                     href={item.link} target="_blank">{item.value}</a>
                                                : <p key={`${property.key}-${index}`}
                                                     className="w-full block">{item}</p>;
                                        })}
                                        <label className="text-sm text-neutral-400">{property.key}</label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <ul>
                            {entityData.notes &&
                                <li key={entityData.notes.key} className="py-3">
                                    {entityData.notes.value.map((item, index) => {
                                        return typeof item === "object"
                                            ? <a key={`${entityData.notes!.key}-${index}`}
                                                 className="w-full block underline"
                                                 href={item.link} target="_blank">{item.value}</a>
                                            : <p key={`${entityData.notes!.key}-${index}`}
                                                 className="w-full block">{item}</p>;
                                    })}
                                    <label className="text-sm text-neutral-400">{entityData.notes.key}</label>
                                </li>}
                        </ul>
                    </div>
                </div>
                {!showLinks &&
                    <div className="mt-6 text-right text-sm text-primary-300">
                        <button onClick={handleShowLinks}
                                className="p-4 hover:text-neutral-700">Verknüpfungen
                            einblenden...
                        </button>
                    </div>
                }
            </Tile>
            {entityData?.links && showLinks &&
                <Links linksData={entityData.links} onClose={handleHideLinks}/>}
        </div>
    );
};

export default Detail;
