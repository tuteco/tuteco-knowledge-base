import {ReactNode} from "react";

type PropsType = {
    cssClass?: string;
    children: ReactNode;
}

const Accordion = ({cssClass, children}: PropsType) => {

    let css = 'max-w-md mx-auto '
    if (cssClass) {
        css += cssClass;
    }

    return (
        <div className={css}>
            {children}
        </div>
    );
};

export default Accordion;
