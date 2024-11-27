import {ExtendedValueType} from "../model/datatypes.ts";

type PropsType = {
    value: ExtendedValueType
}

const EntityPropertyLink = ({value}: PropsType) => {
    return (
        <a className="w-full block underline"
           href={value.content as string}
           target="_blank">
            {value.title}
        </a>
    );
};

export default EntityPropertyLink;
