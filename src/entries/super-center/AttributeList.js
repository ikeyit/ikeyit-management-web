import React,{useEffect} from 'react';
import * as api from '../../api';
import {Status} from '../../components';
import {useAsyncTask, usePlainSearchParams} from '../../hooks';
import { Button, Space, Table, Input, Popconfirm, message} from 'antd';
import {Link} from "react-router-dom";
const {Search} = Input;


export default function AttributeList() {
    const [searchParams, setSearchParams] = usePlainSearchParams();
    const {status, error, data = {}, execute} = useAsyncTask(api.getAttributes);
    useEffect(()=> {
        execute(searchParams);
    },[]);

    function onClickDelete(id) {
        api.obsoleteAttribute({id}).then(data => {
            execute(searchParams);
        }).catch(error => {
            message.error(error.errMsg);
        });
    }
    const columns = [
        {
            title: '参数名称',
            dataIndex: 'name',
            width: '10%',
        },
        {
            title: '参数类型',
            dataIndex: 'attributeType',
            render: attributeType => attributeType === 0 ? "基本属性" : "销售属性",
            width: '10%',
        },
        {
            title: '必选项',
            dataIndex: 'required',
            render: required => required ? "是" : "否",
            width: '10%',
        },
        {
            title: '操作',
            key: 'actions',
            width: '10%',
            render: (text, item) => (
                <Space size="middle">
                    <Link to={"attribute_edit?id="+ item.attributeId} >编辑</Link>
                    <Popconfirm
                        placement="topRight"
                        title="属性删除后，只影响后续的商品，以前的商品不受影响。确认删除该属性?"
                        onConfirm={() => onClickDelete(item.attributeId)}>
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{marginBottom:20}}>
                <Link to="attribute_edit" ><Button type="primary">添加</Button></Link>
                <Search
                    placeholder="搜索参数名称"
                    enterButton="搜索"
                    allowClear
                    onSearch={(value)=>execute(setSearchParams({name:value, page: 1}))}
                    style={{ width: 200, margin: '0 10px' }}
                />
            </div>
            <Status status={status} errMsg={error && error.errMsg}>
                <Table
                    columns={columns}
                    dataSource={data.content}
                    rowKey="attributeId"
                    pagination={{total: data.total, pageSize: data.pageSize, current: data.page}}
                    onChange={(pagination)=> execute(setSearchParams({page: pagination.current, pageSize: pagination.pageSize}))}
                    size="small"
                />
            </Status>
        </>
    );
}
