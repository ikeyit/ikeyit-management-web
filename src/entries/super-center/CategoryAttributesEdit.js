import React, {useCallback, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import * as api from '../../api';
import {Reorder, Status} from '../../components';
import {reorderArray} from "../../utils/reorderArray";
import {useAsyncTask, usePlainSearchParams} from '../../hooks';
import {message, Spin, Row, Col, Select, Popconfirm, Button, Descriptions} from "antd";
import debounce from 'lodash/debounce';
import {DeleteOutlined} from "@ant-design/icons";
import {ATTRIBUTE_TYPE} from "./constant";
import "./CategoryAttributesEdit.less";

export function AttributeSelect({onChange}) {
    const {status, error, data = {}, execute} = useAsyncTask(api.getAttributes);
    const onSearch = useCallback(debounce(value => execute({name: value}), 400),[execute]);

    function onSelectChange(attributeId) {
        if (data.content){
            const v = data.content.find(item=>item.attributeId === attributeId);
            onChange && onChange(v);
        }

    }

    return (
        <Select
            placeholder="输入要添加的参数名"
            notFoundContent={status === "loading" ? <Spin size="small" /> : null}
            showSearch={true}
            defaultActiveFirstOption={true}
            showArrow={false}
            filterOption={false}
            onSearch={onSearch}
            onChange={onSelectChange}
            className="category-attribute-select"
        >
            {data.content && data.content.map(d => (
                <Select.Option key={d.attributeId} value={d.attributeId}>{d.name} / {ATTRIBUTE_TYPE[d.attributeType]}</Select.Option>
            ))}
        </Select>
    );
}

export default function CategoryAttributesEdit() {
    console.info("CategoryAttributesEdit");
    const [{id}] = usePlainSearchParams();
    const {status : loadStatus, data: category = {} , error: loadError, execute: load, setData} = useAsyncTask(api.getCategoryDetail);
    const {status : saveStatus, error: saveError , execute: save} = useAsyncTask(api.updateCategoryAttributes, {
        onSuccess() {
            message.info("保存成功");
            load({id});
        }
    });

    useEffect(() => {id && load({id})},[id]);

    const {attributes = []} = category;
    function onSelectChange(attribute) {
        if (!attributes.some(item=>attribute.attributeId === item.attributeId)) {
            attributes.push(attribute);
            category.attributes = attributes;
            setData(category);
        }
    }

    function onDelete(attribute) {
        category.attributes = attributes.filter(item => item !== attribute);
        setData(category);
    }

    function onSubmit() {
        save({
            id,
            attributes: category.attributes,
        });
    }
    function move(dragIndex, dropIndex) {
        category.attributes = reorderArray(attributes, dragIndex, dropIndex);
        setData(category);
    }

    if (saveStatus === "success")
        return <div>保存成功</div>;
    return (
        <Status status={loadStatus} errMsg={loadError}>
            <Descriptions title="类目信息">
                <Descriptions.Item label="名称" span={3}>{category && category.name}</Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>{category && category.description}</Descriptions.Item>
            </Descriptions>
            <h3>关联参数</h3>
                {attributes.map((attribute, index) =>
                    <Reorder key={attribute.attributeId}
                    index={index}
                    type="CategoryAttribute"
                    onMove={move}
                    className="category-attribute">
                        <div className="category-attribute-name">
                            <Link to={"attribute_edit?id=" + attribute.attributeId}>{attribute.name}</Link>
                            {attribute.attributeType === 2 && <span className="category-attribute-sale">销售</span>}
                            {attribute.isNew && <span className="category-attribute-new">新加</span>}
                        </div>
                        <Popconfirm
                            placement="topRight"
                            title="确认删除该参数?"
                            onConfirm={() => onDelete(attribute)}>
                            <Button shape="circle" type="link" icon={<DeleteOutlined/>}/>
                        </Popconfirm>
                    </Reorder>
                )}
                <AttributeSelect onChange={(value)=>onSelectChange(value)}/>
            <Button type="primary" loading={saveStatus === "loading"} onClick={onSubmit}>提交</Button>
        </Status>
    );
}