import {ReactNode, useState} from "react";
import {Icon} from "@iconify/react";

type PropsType = {
    index: number
    title: string
    content: ReactNode
}

const AccordionItem = ({index, title, content}: PropsType) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div key={index} className="bg-neutral-100 border-b border-neutral-200">
            <button className="w-full text-left p-2" onClick={() => toggleAccordion(index)}>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-neutral-700">{title}</span>
                    <Icon icon="material-symbols-light:keyboard-arrow-down"
                          className={`text-2xl transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}/>
                </div>
            </button>
            {openIndex === index && <div className="p-4 bg-white">{content}</div>}
        </div>
    );
};

export default AccordionItem;
