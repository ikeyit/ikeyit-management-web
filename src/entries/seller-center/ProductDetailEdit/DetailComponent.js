import React from "react";
import {CaretDownFilled, CaretUpFilled, DeleteFilled} from "@ant-design/icons";
import {ImageComponent} from "./ImageComponent";
import {TextComponent} from "./TextComponent";
export const DetailComponent = React.memo(({component, selected = false, index, total, onSelect, onUp, onDown, onDelete})=> {
    const renderComponent= (component) => {
        if (component.type === "image") {
            return <ImageComponent component={component}/>;
        } else if (component.type === "text")
            return <TextComponent component={component}/>;
        return null;
    };
    const onUpClick = e => {
        e.stopPropagation();
        if (index >= 1)
            onUp(index);
    };
    const onDownClick = e => {
        e.stopPropagation();
        if (index <= total - 1)
            onDown(index);
    };
    const onDeleteClick = e => {
        e.stopPropagation();
        onDelete(index);
    };

    const onSelectClick = e => {
        e.stopPropagation();
        if (!selected)
            onSelect(index);
    };

    return (
        <div className={"prod-detail-component" + (selected ? " prod-detail-component-selected" : "")}  onClick={()=>onSelect(index)}>
            {renderComponent(component)}
            <div className="prod-detail-component-handler">
                {selected ?
                    <>
                        <CaretUpFilled className={index <= 0 ? "disabled":""} onClick={onUpClick}/>
                        <CaretDownFilled className={index >= total - 1 ? "disabled":""} onClick={onDownClick}/>
                        <DeleteFilled onClick={onDeleteClick}/>
                    </> :
                    <>
                        模块{index+1}
                    </>
                }
            </div>
        </div>
    );
});
