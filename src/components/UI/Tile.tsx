import {ReactNode} from "react";
import {Icon} from "@iconify/react";

type TilePropsType = {
    title: string,
    label?: string,
    cssClass?: string,
    onClose?: () => void,
    children?: ReactNode,
}

const Tile = ({title, label, cssClass, onClose, children}: TilePropsType) => {
    let tileCssClass = "m-4 bg-white border-t-4 border-primary-200 rounded-2xl shadow-2xl overflow-y-auto ";
    if (cssClass) {
        tileCssClass += cssClass;
    }

    return (
        <section className={tileCssClass}>
            <div className="flex justify-between mx-4 border-b-2 border-neutral-200">
                <div className="flex-1 py-4 flex gap-4 justify-center">
                    <div className="text-lg text-center">
                        {title}
                    </div>
                    {label === "1" && <Icon icon="clarity:exclamation-triangle-line" className="text-2xl text-amber-500"/>}
                </div>
                <button onClick={onClose} className="py-4 text-2xl text-primary-200 hover:text-neutral-700">
                    <Icon icon="material-symbols-light:close-rounded"/>
                </button>
            </div>
            <div className="p-4">
                {children}
            </div>
        </section>
    );
};

export default Tile;
