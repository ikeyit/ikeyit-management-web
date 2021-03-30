import React, { useCallback} from 'react'
import {Select} from 'antd';

const AttributeSelect = React.memo(({attribute, error, dispatch}) => {
    if (!attribute)
        return <div></div>;
    const onChange = valueId => {
        dispatch({type:"CHANGE_BASIC_ATTRIBUTE", payload: {valueId: valueId, attributeId: attribute.attributeId}});
    };

    return (
        <div className="basic-attr" >
            <div className={"basic-attr-hd" + (attribute.required ? " form-required" : "")}>
                {attribute.name}
            </div>
            <div className="basic-attr-bd">
                <Select
                    value={attribute.selected}
                    onChange={onChange}
                    allowClear={true}
                    placeholder="请选择"
                    className="basic-attr-select">
                    {attribute.values.map(value =>
                        <Select.Option value={value.valueId} key={value.valueId}>
                            {value.val}
                        </Select.Option>
                    )}
                </Select>
                {error && <div className="form-error">{error}</div>}
            </div>
        </div>
    );
});

const BasicAttributesEdit = React.memo(({basicAttributes, error, dispatch}) => {
    //没有销售属性不显示规格区域
    if (!basicAttributes || !basicAttributes.length)
        return <div></div>;
    return (
        <div className="form-item">
            <label className="form-item-hd">
                参数
            </label>
            <div className="form-item-bd basic-attrs">
                {basicAttributes && basicAttributes.map(attribute =>
                    <AttributeSelect attribute={attribute} dispatch={dispatch} error={error && error[attribute.attributeId]} key={attribute.attributeId} />
                )}
            </div>
        </div>
    );
});

export default BasicAttributesEdit;