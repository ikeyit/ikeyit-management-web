import React, {useEffect,useState,useRef} from "react";
import {message, Upload} from "antd";
import {Reorder} from '../../../components';
import {reorderArray} from "../../../utils/reorderArray";
import {useQiniuUpload} from '../../../hooks';
import { PlusOutlined, LoadingOutlined} from '@ant-design/icons';



let toFileIndex = 0;
export function urlToFile(url) {
    return url ? {
        uid:"-" + (++toFileIndex),
        url,
        status: "done",
        name: "image"
    } : undefined;
}

export function urlsToFileList(urls) {
    return urls && urls.map(url => urlToFile(url));
}

export function fileListToUrls(fileList) {
    return fileList &&  fileList.map(file => file.url);
}

export const PicturesWall = React.memo(({fileList, onChange, typeLimit, sizeLimit, countLimit = 5, ...restProps}) => {
    const {beforeUpload, doUpload} = useQiniuUpload(typeLimit, sizeLimit);

    function onUploadChange({file, fileList}) {
        if (!file.status)
            return;
        if (file.status === "error")
            fileList = fileList.filter(file.status !== "error");
        fileList.forEach(file => file.url = file.response && file.response.url);
        onChange && onChange(fileList);
    }

    function onFileMove(dragIndex, dropIndex) {
       onChange && onChange(reorderArray(fileList, dragIndex, dropIndex));
    }

    return (
        <>
            <Upload
                {...restProps}
                listType="picture-card"
                accept="image/*"
                fileList={fileList}
                multiple={true}
                beforeUpload={beforeUpload}
                customRequest={doUpload}
                // onPreview={()=>setPreview(true)}
                onChange={onUploadChange}
                itemRender={(originNode, file, currFileList) => {
                    return (
                        <Reorder index={currFileList.indexOf(file)} onMove={onFileMove} type="PictureWall" className="pictures-wall-dnd">
                            {originNode}
                        </Reorder>
                    );
                }}
            >
                {fileList && fileList.length >= countLimit ? null : <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>}
            </Upload>
        </>
    );
});

export const PictureUpload = React.memo(({value, onChange, typeLimit, sizeLimit, ...restProps}) => {
    const [loadingFile, setLoadingFile] = useState();
    const {beforeUpload, doUpload} = useQiniuUpload(typeLimit, sizeLimit);
    function onUploadChange({file}) {
       if (file.status === "done")
            onChange && onChange(file.response.url);
       setLoadingFile(file.status === "uploading" ? file : undefined);
    }
    return (
        <Upload
            {...restProps}
            listType="picture-card"
            accept="image/*"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={doUpload}
            onChange={onUploadChange}
        >
            {loadingFile ? <LoadingOutlined /> :
                value ? <img src={value} alt="image" style={{ width: '100%' }} /> : <PlusOutlined />
            }

        </Upload>
    );
});