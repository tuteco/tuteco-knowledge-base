type PropsType = {
    key: string
    item: string
}

const EntityPropertyString = ({key, item}: PropsType) => {
    return (
        <p key={key} className="w-full block">
            {item}
        </p>
    );
};

export default EntityPropertyString;
