import React,{useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import "./PageEdit.less";
import {useAsyncTask} from "../../hooks";
import * as api from "../../api";
import {Status} from "../../components";

const apiGetShopPage = (...args) => {
    return api.getShopPage(...args).then(res => {
        res.content = JSON.stringify(res.content);
        return res;
    });
}
export default function PageEdit() {
    const { pageId } = useParams();
    const {data, status, error, execute, setData} = useAsyncTask(apiGetShopPage);
    const saveTask = useAsyncTask(api.updateShopPage, {
        onSuccess() {
            setData({
                ...data,
                version: data.version + 1,
            });
        }
    });

    useEffect(() => {
        execute({id: pageId});
    }, []);

    const onSubmit = ()=> {
        saveTask.execute({
            id: pageId,
            version: data.version,
            content: JSON.parse(data.content),
        });
    };

    const onChange = e => {
        setData({
            ...data,
            content: e.currentTarget.value
        });
    }

    return (
        <Status status={status} errMsg={error&&error.errMsg}>
            <div className="decorate-header">
                <div className="decorate-header-left"><a href="/seller-center.html#/shop_decoration"><img src="logo-header.png"/><span>店铺装修</span></a></div>
                <div className="decorate-header-right">
                    <button onClick={onSubmit}>发布</button>
                </div>
            </div>
            <div className="decorate-body">
                <div className="decorate-left"></div>
                <div className="decorate-middle">
                <textarea value={data && data.content} onChange={onChange} className="decorate-content"/>
                </div>
                <div className="decorate-right"></div>
            </div>
        </Status>
    );
}
