import {Icon} from "@iconify/react";
import {Tooltip} from "react-tooltip";


type IconPropsType = {
    icon?: string,
    showIcon?: boolean,
    description?: string,
    showDescription?: boolean,
    cssClass?: string,
    small?: boolean,
    dark?: boolean,
    focus?: boolean,
    showTooltip?: boolean,
    onClick: () => void,
}

const ButtonWithIcon = ({
                            icon, showIcon,
                            description, showDescription,
                            cssClass,
                            small,
                            dark,
                            focus,
                            showTooltip,
                            onClick,
                            ...props
                        }: IconPropsType) => {

    let buttonCssClass = "w-full flex gap-4 py-2 " + (
        small
            ? "text-md "
            : "text-lg "
    ) + (
        dark
            ? "hover:bg-neutral-800 " + (focus ? "text-primary-200 " : "text-primary-100 ")
            : "text-neutral-800 hover:bg-neutral-200 " + (focus ? "font-bold " : " ")
    );

    if (cssClass) {
        buttonCssClass += cssClass;
    }

    const iconCssClass = (
        small
            ? "text-2xl "
            : "text-4xl "
    ) + (
        dark
            ? "text-primary-200 "
            : "text-primary-300 "
    );

    return (
        <>
            <button {...props} onClick={onClick} className={buttonCssClass}>
                {showIcon && icon && <Icon icon={icon} className={iconCssClass}/>}
                {showDescription && description && <p className="flex-1 text-left">{description}</p>}
            </button>
            {showTooltip && <Tooltip id="navigation-tooltip" style={{zIndex: 999}}/>}
        </>
    );
};

export default ButtonWithIcon;