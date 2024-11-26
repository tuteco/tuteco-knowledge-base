import {LinkType} from "../model/datatypes.ts";
import Tile from "./UI/Tile.tsx";
import ButtonWithIcon from "./UI/ButtonWithIcon.tsx";
import {useContext} from "react";
import StructureContext from "../store/StructureContext.tsx";
import NavigationContext from "../store/NavigationContext.tsx";

type PropsType = {
    linksData: LinkType[],
    onClose: () => void
}

const Links = ({linksData, onClose}: PropsType) => {
    const structureCtx = useContext(StructureContext);
    const navCtx = useContext(NavigationContext);

    return (
        <Tile title="Verknüpfungen" cssClass="h-[35%]" onClose={onClose}>
            <ul>
                {linksData.map(link => {
                    const category = structureCtx.informationCategories.find(category => category.id === link.category)!;
                    return (
                        <li key={link.id}>
                            <ButtonWithIcon icon={category.icon} showIcon
                                            description={link.name} showDescription
                                            onClick={() => navCtx.navigateToEntity(link)}
                                            small/>
                        </li>
                    );
                })}
            </ul>
        </Tile>
    );
};

export default Links;
