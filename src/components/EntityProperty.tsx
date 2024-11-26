import {ExtendedValueType, PropertyType} from "../model/datatypes.ts";
import EntityPropertyLink from "./EntityPropertyLink.tsx";
import EntityPropertyString from "./EntityPropertyString.tsx";
import EntityPropertyNested from "./EntityPropertyNested.tsx";

type PropsType = {
    property: PropertyType
}

const EntityProperty = ({property}: PropsType) => {
    return (
        <li key={property.key} className="py-3">
            {property.value.map((item, index) => {
                return item.type === "nested"
                    ? <EntityPropertyNested items={property.value}/>
                    :
                    item.type === "link"
                        ? <EntityPropertyLink key={`${property.key}-${index}`} item={item.value as ExtendedValueType}/>
                        : <EntityPropertyString key={`${property.key}-${index}`} item={item.value as string}/>;
            })}
            <label className="text-sm text-neutral-400">{property.key}</label>
        </li>
    );
};

export default EntityProperty;
