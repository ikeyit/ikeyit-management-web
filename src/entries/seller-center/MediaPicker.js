import React, {useEffect, useState} from "react";
import {Button, Modal, Upload ,message, Pagination} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useQiniuUpload, useAsyncTask, useModalTrigger} from "../../hooks";
import {Status} from "../../components";

import * as api from "../../api";
import "./MediaPicker.less";

//媒体选择对话框，暂时只支持图片！
//可以限制选择数量，文件类型，和大小
export const MediaPicker = React.memo(({visible, onOk, onCancel, afterClose, maxCount = 30, minCount = 1, typeLimit, sizeLimit})=> {
    const {status, data, error, execute} = useAsyncTask(api.getMedias);
    const [state, setState] = useState({
        selected: [],
        folderId: 0,//暂时没用，没有实现文件夹功能
        fileType: 0, //暂时没用，只有图片
    });
    const {beforeUpload, doUpload} = useQiniuUpload(typeLimit, sizeLimit);

    function addSelection(selected, media) {
        if (maxCount === 1) {
            selected[0] = media;
        } else if (selected.length < maxCount) {
            selected.push(media);
        }
        return selected;
    }

    //上传文件到OSS后将文件信息存储到业务数据库
    function save(file) {
        api.createMedia({
            ...file.response,
            folderId: 0,
        }).then(data => {
            setState(preState => ({
                ...preState,
                selected: addSelection([...preState.selected], data),
            }));
            execute({fileType: state.fileType, folderId: state.folderId, page: 1});
        }).catch(error => {
            message.error(error.errMsg);
        });
    }

    //
    function onUploadChange({file, fileList}) {
        if (!file.status)
            return;

        fileList = fileList.filter(item => item.status !== "done");
        if (file.status === "done")
            save(file);

        setState(prevState => ({...prevState, fileList}));
    }

    function onOkInternal() {
        if (state.selected && state.selected.length >= minCount && state.selected.length <= maxCount) {
            onOk(state.selected);
            setState(prevState => ({...prevState, selected: []}));
        }
    }

    function onCancelInternal() {
        setState(prevState => ({...prevState, selected: []}));
        onCancel && onCancel();
    }

    function onItemClick(media) {
        setState(preState => {
            const selected = preState.selected.filter(item => item.id !== media.id);
            if (selected.length === preState.selected.length) {
                addSelection(selected, media);
            }

            return {
                ...preState,
                selected,
            };
        });
    }

    function onPageChange(page, pageSize) {
        execute({fileType: state.fileType, folderId: state.folderId, page, pageSize});
    }

    useEffect(()=>{
        execute({fileType: state.fileType, folderId: state.folderId, page:1, pageSize:15});
    }, []);

    function renderMediaItem(media) {
        const {selected} = state;
        const selectionIndex = selected.findIndex(item => item.id === media.id) + 1;

        return (
            <div key={media.id} className={"image-picker-item" + (selectionIndex > 0 ? " image-picker-item-checked" : "")} onClick={()=>onItemClick(media)}>
                {selectionIndex > 0 &&
                    <div className="image-picker-selection">
                        {selectionIndex}
                    </div>
                }

                <div className="image-picker-thumbnail">
                    <img src={media.url} title={media.name} alt={media.name}/>
                </div>
                <div className="image-picker-name">
                    {media.name}
                </div>
            </div>
        );

    }
    return (
        <Modal
            onOk={onOkInternal}
            afterClose={afterClose}
            onCancel={onCancelInternal}
            visible={visible}
            className="image-picker"
            title="选择图片"
        >
            <div className="image-picker-middle">
                <Status status={status} errMsg={error && error.errMsg}>
                {data && data.content.map(media => renderMediaItem(media))}
                </Status>
                <div className="image-picker-middle-ft">
                    <div className="image-picker-middle-status">已选{state.selected.length}个,最多{maxCount}个,最少{minCount}个</div>
                {data &&
                    <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onChange={onPageChange}/>
                }
                </div>
            </div>
            <div className="image-picker-right">
                <Upload
                    accept="image/*"
                    className="image-picker-upload"
                    fileList={state.fileList}
                    multiple={true}
                    disabled={state.fileList && state.fileList.some(item=>item.status === "uploading")}
                    beforeUpload={beforeUpload}
                    customRequest={doUpload}
                    onChange={onUploadChange}
                >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </div>
        </Modal>

    );
});
