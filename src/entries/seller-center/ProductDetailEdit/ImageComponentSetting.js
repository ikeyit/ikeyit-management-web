import React from "react";
import {ImageCard} from "../ImageCard";

export const ImageComponentSetting = React.memo(({component, onChange, index})=> {
    const onImageChange = (image) => {
        onChange && onChange({
            ...component,
            src: image,
        }, component);
    };

    return (
        <div className="prod-detail-setting prod-detail-setting-image">
            <div className="prod-detail-setting-hd">单图模块：模块{index}</div>
            <div className="prod-detail-setting-bd">
                <ImageCard image={component.src} disableDelete={true} onChange={onImageChange}/>
            </div>
        </div>
    );
});
