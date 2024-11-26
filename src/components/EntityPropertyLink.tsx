import {ExtendedValueType} from "../model/datatypes.ts";

type PropsType = {
    key: string
    item: ExtendedValueType
}

const EntityPropertyLink = ({key, item}: PropsType) => {
    return (
        <a key={key}
           className="w-full block underline"
           href={item.content as string}
           target="_blank">
            {item.title}
        </a>
    );
};

export default EntityPropertyLink;
