import {PropertyType, PropertyValueType} from "../model/datatypes.ts";
import EntityPropertyLink from "./EntityPropertyLink.tsx";
import EntityPropertyString from "./EntityPropertyString.tsx";
import EntityPropertyNested from "./EntityPropertyNested.tsx";

type PropsType = {
    property: PropertyType
}

const EntityProperty = ({property}: PropsType) => {
    return (
        <li key={property.key} className="py-3">
            {property.type === "nested"
                ? <EntityPropertyNested items={property.value as PropertyValueType[]}/>
                :
                <>
                    {property.value.map((item, index) => {
                        return property.type === "link"
                            ? <EntityPropertyLink key={`${property.key}-${index}`} item={item as PropertyValueType}/>
                            : <EntityPropertyString key={`${property.key}-${index}`} item={item as string}/>;
                    })}
                </>
            }
            <label className="text-sm text-neutral-400">{property.key}</label>
        </li>
    );
};

export default EntityProperty;
