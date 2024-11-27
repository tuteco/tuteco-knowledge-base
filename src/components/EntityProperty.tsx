import {ExtendedValueType, PropertyType} from "../model/datatypes.ts";
import EntityPropertyLink from "./EntityPropertyLink.tsx";
import EntityPropertyString from "./EntityPropertyString.tsx";
import EntityPropertyNested from "./EntityPropertyNested.tsx";

type PropsType = {
    property: PropertyType
}

const EntityProperty = ({property}: PropsType) => {
    return (
        <li className="py-3">
            {property.value.map((item, index) => {
                return item.type === "nested"
                    ? <EntityPropertyNested key={index} accordionItemIndex={index} value={item.value as ExtendedValueType}/>
                    : item.type === "link"
                        ? <EntityPropertyLink key={index} value={item.value as ExtendedValueType}/>
                        : <EntityPropertyString key={index} value={item.value as string}/>;
            })}
            <label className="text-sm text-neutral-400">{property.key}</label>
        </li>
    );
};

export default EntityProperty;
