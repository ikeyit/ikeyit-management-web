import {useRef} from "react";
import {message} from "antd";
import * as api from "../api";
import * as qiniu from "qiniu-js";

const qiniuUploadConfig = {
    // useCdnDomain: true,
    // region: qiniu.region.z0,
    disableStatisticsReport: true,
    defaultTypeLimit: ['image/png', 'image/jpeg', 'image/jpg'],
    defaultSizeLimit: 1024 * 1024 *2,
};

export function useQiniuUpload(typeLimit = qiniuUploadConfig.defaultTypeLimit, sizeLimit = qiniuUploadConfig.defaultSizeLimit) {
    const uploadData = useRef();

    function beforeUpload(file) {
        if (typeLimit.indexOf(file.type) < 0) {
            message.error("文件类型不支持");
            return false;
        }
        if (file.size > sizeLimit) {
            message.error(`文件大小不能超过${sizeLimit}`);
            return false;
        }
        if (!uploadData.current || uploadData.current.expireAt < Date.now()) {
            return new Promise((resolve, reject) => {
                api.prepareUploadImage().then(data => {
                    data.expireAt = Date.now() + data.expire * 1000 - 5000;
                    uploadData.current = data;
                    resolve();
                }).catch(error => {
                    message.error(error.errMsg);
                    reject();
                });
            });
        }

        return true;
    }


    function doUpload({file, onProgress, onError, onSuccess}) {
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        const observable = qiniu.upload(file, null, uploadData.current.token,
            {
                fname: filename,
                mimeType: file.type,
            }, qiniuUploadConfig);
        observable.subscribe({
            next(res){
                onProgress({percent: res.total.percent});
            },
            error: error => {
                let errMsg = "上传失败";
                if (error.code === 413)
                    errMsg = "文件太大了";
                else if (error.code === 403)
                    errMsg = "格式不对";
                message.error(errMsg);
                onError({errMsg}, errMsg);
            },
            complete: onSuccess,
        });
    }

    return {beforeUpload, doUpload};
}