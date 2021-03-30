import React, { useRef, useState, useCallback} from 'react'
import {Popover, Input, Button, Checkbox, Modal} from 'antd';
import {EditOutlined} from "@ant-design/icons";
import {Reorder} from "../../../components";
import {reorderArray} from "../../../utils/reorderArray";

const SpecInput = React.memo(({val, onFinish, buttonLabel = "添加"}) => {
    const [state, setState] = useState({val});
    const onAddClick = () => {
        const error = onFinish(state.val);
        if (error)
            setState({...state, error});
        else
            setState({});
    };

    return (
        <>
            <Input className="spec-input" value={state.val} onChange={e=>setState({val: e.target.value})} allowClear={true} maxLength={50}/>
            <Button className="spec-input-button" onClick={onAddClick}>{buttonLabel}</Button>
            <div className="spec-input-error">{state.error}</div>
        </>
    );
});

const SpecEdit = React.memo(({val, onFinish}) => {
    const [visible, setVisible] = useState(false);
    function internalFinish(val) {
        const error = onFinish(val);
        if (error)
            return error;
        setVisible(false);
    }
    return (
        <Popover
            placement="bottom"
            trigger="click"
            visible={visible}
            onVisibleChange={visible => setVisible(visible)}
            destroyTooltipOnHide={true}
            content={<SpecInput val={val} onFinish={internalFinish} buttonLabel="确定"/>}
        >
            <EditOutlined />
        </Popover>
    );
});

const SpecValue = React.memo(({value, onCheckChange, onEditFinish}) => {
    return (
        <div key={value.valueId} className="spec-item">
            <Checkbox className="spec-item-check" checked={value.checked} onChange={e => onCheckChange(e.target.checked, value.valueId)}/>
            <span>{value.val}</span>
            {value.customized && value.checked &&
            <SpecEdit val={value.val} onFinish={val => onEditFinish(val, value.valueId)}/>
            }
        </div>
    );
});


const SpecValueModal = React.memo(({values, onChange}) => {
    const [state, setState] = useState({visible: false});
    const onOpen = ()=> {
        setState({visible: true, values: values && values.map(item=>({...item}))})
    };

    const onOk = ()=> {
        setState({...state, visible: false});
        if (!values || !values.length || values.every((value, i) => value.valueId === state.values[i].valueId))
            return;

        onChange(state.values);
    };

    const onCancel = ()=> {
        setState({...state, visible: false});
    }

    const onMove = (dragIndex, dropIndex) => {
        setState({...state, values: reorderArray(state.values, dragIndex, dropIndex)});
    }

    return (
        <div>
            <Button onClick={()=>onOpen()}>开始排序</Button>
            <Modal title="拖拽排序" visible={state.visible} onOk={onOk} onCancel={onCancel}>
                {state.values && state.values.map((value, index)=> value.checked &&
                    <Reorder key={value.valueId} index={index} type="SpecValues" onMove={onMove} className="spec-sort-item">
                        {value.val}
                    </Reorder>
                )}

            </Modal>
        </div>
    );
});


const SpecItem = React.memo(({saleAttribute, dispatch}) => {
    const saleAttributeRef = useRef(saleAttribute);
    saleAttributeRef.current = saleAttribute;
    const onCheckChange = useCallback((checked, valueId) => {
        dispatch({type:"CHANGE_SPEC", payload: {valueId, params: {checked}}});
    }, [dispatch]);
    const onEditFinish = useCallback((val, valueId) => {
        if (!val)
            return "不能为空";

        if (saleAttributeRef.current.values.some(value => value.val === val))
            return "存在啦";

        if (valueId) {
            dispatch({type:"CHANGE_SPEC", payload: {valueId, params:{val}}});
        } else {
            dispatch({type:"ADD_SPEC", payload: {attributeId: saleAttributeRef.current.attributeId, params: {val}}});
        }
    }, [dispatch]);

    const onOrderChange = useCallback((values) => {
        dispatch({type:"ORDER_SPEC", payload: values});
    }, [dispatch]);

    return (
        <div className="spec" >
            <div className="spec-hd">
                <div className="spec-name">{saleAttribute.name}</div>
                <SpecInput onFinish={onEditFinish}/>
            </div>
            <div className="spec-bd">
                {saleAttribute.values.map((value) =>
                  <SpecValue value={value} key={value.valueId} onCheckChange={onCheckChange} onEditFinish={onEditFinish}/>
                )}
            </div>
            <div className="spec-ft">
            <SpecValueModal values={saleAttribute.values} onChange={onOrderChange}/>
            </div>
        </div>
    );
});

const SpecPicker = React.memo(({saleAttributes, dispatch}) => {
    //没有销售属性不显示规格区域
    if (!saleAttributes || !saleAttributes.length)
        return <div></div>;
    return (
        <div className="form-item">
            <label className="form-item-hd">
                规格
            </label>
            <div className="form-item-bd">
                {saleAttributes && saleAttributes.map(saleAttribute =>
                    <SpecItem saleAttribute={saleAttribute} dispatch={dispatch} key={saleAttribute.attributeId} />
                )}
            </div>
        </div>
    );
});

export default SpecPicker;