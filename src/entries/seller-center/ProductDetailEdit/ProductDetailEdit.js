import React, {useState, useCallback} from 'react';
import {Modal, Button} from 'antd';
import {FileImageFilled, FileTextFilled} from '@ant-design/icons';
import {MediaPicker} from '../MediaPicker';
import {DetailComponent} from './DetailComponent';
import {ImageComponentSetting} from './ImageComponentSetting';
import {TextComponentSetting} from './TextComponentSetting';
import {useModalTrigger} from "../../../hooks";
import cloneDeep from 'lodash/cloneDeep';
import "./ProductDetailEdit.less";

/**
 * 将组件插入当前选中组件的后边，如果当前没有选中的组件，则插入到末尾
 * @param components 当前的组件列表
 * @param selected 选中的索引
 * @param newComponents 新加的组件列表
 * @returns {[]} 合并后的组件的列表
 */
function insertComponents(components= [], selected, newComponents) {
    const ret = [];
    let done = false;
    components.forEach((item, index) => {
        ret.push(item);
        if (index === selected) {
            done = true;
            newComponents.forEach(v=>ret.push(v));

        }
    })
    if (!done)
        newComponents.forEach(v=>ret.push(v));
    return ret;
}

//产品细节编辑器对话框
export const ProductDetailEdit = React.memo(({visible, onOk, onCancel, afterClose, detail})=> {
    console.info(detail);
    const [state, setState] = useState({
        detail: detail ? cloneDeep(detail) : [],
        selected: -1,
    });

    //选中图片后，创建单图模块
    const onImagePicked = (images) => {
        const newComponents = images.map(image => ({type:"image", src: image.url}));
        setState(prevState => ({
            ...prevState,
            detail: insertComponents(prevState.detail, prevState.selected, newComponents),
        }));
    }

    const onCreateText = () => {
        const newComponent = [{
            type: "text",
            content: "修改您的文字"
        }];

        setState(prevState => ({
            ...prevState,
            detail: insertComponents(prevState.detail, prevState.selected, newComponent),
        }));
    }

    //向上移动模块
    const onUp = useCallback(index => {
        setState(prevState => {
            const preDetail = prevState.detail;
            if (index <= 0 || preDetail.length < 1)
                return prevState;
            const detail = [];
            for (let i = 0; i < preDetail.length;i++) {
                if (i === index - 1) {
                    detail[i] = preDetail[index];
                    detail[++i] = preDetail[index - 1];
                } else {
                    detail[i] = preDetail[i];
                }
            }
            return {
                ...prevState,
                detail,
                selected: index - 1,
            };
        });
    },[]);

    //向下移动模块
    const onDown = useCallback(index => {
        setState(prevState => {
            const preDetail = prevState.detail;
            if (index >= preDetail.length - 1 || preDetail.length < 1)
                return prevState;
            const detail = [];
            for (let i = 0; i < preDetail.length;i++) {
                if (i === index) {
                    detail[i] = preDetail[index + 1];
                    detail[++i] = preDetail[index];
                } else {
                    detail[i] = preDetail[i];
                }
            }
            return {
                ...prevState,
                detail,
                selected: index + 1,
            }
        });
    },[]);

    //删除模块
    const onDelete = useCallback(index => {
        setState(prevState => {
            const detail = prevState.detail.filter((item, i) => i !== index);
            const selected = prevState.selected === index ? -1 : prevState.selected;
            return {
                ...prevState,
                detail,
                selected,
            }
        });
    },[]);

    const onSelect = useCallback(index => {
        setState(prevState => {
            return {
                ...prevState,
                selected: index,
            }
        });
    },[]);

    const onSettingChange = useCallback((component, oldComponent) => {
        setState(prevState => {
            return {
                ...prevState,
                detail: prevState.detail.map(item => item === oldComponent ? component : item),
            }
        });
    },[]);

    const renderComponentSetting = (component, index) => {
        if (!component)
            return;

        if (component.type === "image") {
            return <ImageComponentSetting index={index+1} component={component} onChange={onSettingChange}/>;
        } else if (component.type === "text") {
            return <TextComponentSetting index={index+1} component={component} onChange={onSettingChange}/>;
        }
        return <div>未知模块</div>;
    };

    return (<Modal
        onOk={()=>onOk(state.detail)}
        onCancel={onCancel}
        afterClose={afterClose}
        visible={visible}
        className="prod-detail-edit-modal"
        title="编辑商品详情"
        width="auto"
    >
        <div className="prod-detail-edit">
            <div className="prod-detail-edit-left">
                <ul className="prod-detail-edit-comps">
                    <ImageComponentTrigger onFinish={onImagePicked}/>
                    <li onClick={onCreateText}>
                        <FileTextFilled />
                        <label>文本</label>
                    </li>
                </ul>
            </div>
            <div className="prod-detail-edit-middle">
                <div className="prod-detail-view">
                    <div className="prod-detail-view-title">
                        效果预览
                    </div>
                    {state.detail.map((component, index) =>
                        <DetailComponent
                            key={index}
                            component={component}
                            index={index}
                            total={state.detail.length}
                            selected={state.selected === index}
                            onSelect={onSelect}
                            onUp={onUp}
                            onDown={onDown}
                            onDelete={onDelete}/>
                    )}
                </div>
            </div>
            <div className="prod-detail-edit-right">
                {renderComponentSetting(state.selected >= 0 ? state.detail[state.selected] : undefined, state.selected)}
            </div>
        </div>
    </Modal>);
});


const ImageComponentTrigger = React.memo(({onFinish}) => {
    const {onOpen, renderModal} = useModalTrigger(onFinish);
    return (
        <>
            <li onClick={()=>onOpen()}>
                <FileImageFilled />
                <label>图片</label>
            </li>
            {renderModal(MediaPicker, {maxCount:10})}
        </>

    );
});
