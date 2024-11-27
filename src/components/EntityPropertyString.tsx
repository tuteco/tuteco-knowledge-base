type PropsType = {
    value: string
}

const EntityPropertyString = ({value}: PropsType) => {
    return (
        <p className="w-full block">
            {value}
        </p>
    );
};

export default EntityPropertyString;
