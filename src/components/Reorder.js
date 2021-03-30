import React, {useRef} from "react";
import {useReorder} from "../hooks";
export function Reorder({index, onMove, children, type, className, ...rest}) {
    const ref = useRef();
    const {dndClassName} = useReorder({ref, index, onMove, type});
    return (
        <div
            className = {className + " " + dndClassName}
            ref={ref}
            {...rest}
        >
            {children}
        </div>
    );
}
