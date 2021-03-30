import React from "react";
import {Input} from 'antd';

export const TextComponentSetting = React.memo(({component, onChange, index})=> {
    const onTextChange = (e) => {
        onChange && onChange({
            ...component,
            content: e.target.value,
        }, component);
    };

    return (
        <div className="prod-detail-setting prod-detail-setting-text">
            <div className="prod-detail-setting-hd">文字模块：模块{index}</div>
            <div className="prod-detail-setting-bd">
                <Input.TextArea rows={4}  value={component.content} onChange={onTextChange}/>
            </div>
        </div>
    );
});
