import AccordionItem from "./UI/AccordionItem.tsx";
import {ExtendedValueType, PropertyType} from "../model/datatypes.ts";
import EntityProperty from "./EntityProperty.tsx";

type PropsType = {
    accordionItemIndex: number
    value: ExtendedValueType,
}

const EntityPropertyNested = ({accordionItemIndex, value}: PropsType) => {
    return (
        <AccordionItem index={accordionItemIndex}
                       title={value.title}
                       content={
                           <ul>
                               {(value.content as PropertyType[]).map((property, idx) => {
                                   return (
                                       <EntityProperty key={idx} property={property}/>
                                   );
                               })}
                           </ul>
                       }/>
    );
};

export default EntityPropertyNested;
