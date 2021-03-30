import React from "react";

export const ImageComponent = ({component}) => {
    return (
    <div className="prod-detail-component-image">
        <img src={component.src} />
    </div>
    );
}