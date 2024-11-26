import Accordion from "./UI/Accordion.tsx";
import AccordionItem from "./UI/AccordionItem.tsx";
import {PropertyType, PropertyValueType} from "../model/datatypes.ts";
import EntityProperty from "./EntityProperty.tsx";

type PropsType = {
    items: PropertyValueType[]
}

const EntityPropertyNested = ({items}: PropsType) => {
    return (
        <Accordion>
            {items.map((item, index) => (
                <AccordionItem key={index}
                               index={index}
                               title={item.title}
                               content={
                                   <ul>
                                       {(item.content as PropertyType[]).map((property) => {
                                           return (
                                               <EntityProperty key={property.key} property={property}/>
                                           );
                                       })}
                                   </ul>
                               }/>
            ))}
        </Accordion>
    );
};

export default EntityPropertyNested;
