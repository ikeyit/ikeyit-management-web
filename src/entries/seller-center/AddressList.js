import React,{useEffect, useState} from 'react'
import * as api from '../../api';
import {Status} from '../../components/';
import {useAsyncTask, useModalTrigger} from '../../hooks';
import {Form, Input, Button, Switch, Cascader, Popconfirm, message, Space, Table, Modal} from 'antd';
import {chinaDivision} from "../../utils/chinaDivision";
import {CheckCircleFilled} from '@ant-design/icons';
const {useForm} = Form;

//新建页面对话框
const EditModal = React.memo(({address = {defaultShipFrom: true, defaultReturnTo: true}, ...props}) => {
    const [form] = useForm();
    const {data, status, execute, error} = useAsyncTask(address.id ? api.updateSellerAddress : api.addSellerAddress, {onSuccess:props.onOk});
    const onFinish = values => {
        values.province = values.division[0];
        values.city = values.division[1];
        values.district = values.division[2];
        if (address.id)
            values.id = address.id;
        delete values.division;
        execute(values);
    }
    const values = {...address};
    if (address.id)
        values.division = [address.province, address.city, address.district];
    return (
        <Modal
            onOk={form.submit}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title={address.id ? "编辑" : "添加地址"}
            confirmLoading={status === "loading"}
            width={800}
        >
            <Form form={form}
                  onFinish={onFinish}
                  initialValues={values}
            >
                <Form.Item name="name" label="联系人" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="phone" label="手机" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="division" label="地区" rules={[{required: true}]}>
                    <Cascader options={chinaDivision} fieldNames={{label: "l", value: "v", children: "c"}}
                              placeholder="请选择"/>
                </Form.Item>
                <Form.Item name="street" label="详细地址" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="defaultShipFrom" valuePropName="checked" label="作为默认发货地址">
                    <Switch/>
                </Form.Item>
                <Form.Item name="defaultReturnTo" valuePropName="checked" label="作为默认退货地址">
                    <Switch/>
                </Form.Item>
            </Form>
            <Status status={status} error={error}/>
        </Modal>
    );
});

export default function AddressList(props) {
    const {status, error, data, execute} = useAsyncTask(api.getSellerAddresses);
    const {onOpen, renderModal} = useModalTrigger(execute);
    useEffect(()=>{
        execute();
    },[]);

    function onDelete(id) {
        api.deleteSellerAddress(id).then(res=> {
            execute();
        }).catch(error=> {
            message.error(error.errMsg);
        })
    }

    const columns = [
        {
            title: '发货地址',
            dataIndex: 'defaultShipFrom',
            render: defaultShipFrom => defaultShipFrom && <CheckCircleFilled style={{fontSize: '16px', color: '#0088cc'}}/>,
            width: '10%',
        },
        {
            title: '退货地址',
            dataIndex: 'defaultReturnTo',
            render: defaultReturnTo => defaultReturnTo && <CheckCircleFilled style={{fontSize: '16px', color: '#08c'}}/>,
            width: '10%',
        },
        {
            title: '联系人',
            dataIndex: 'name',
            width: '10%',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            width: '15%',
        },
        {
            title: '地址',
            key: 'address',
            render: item => <span>{item.province}{item.city}{item.district} {item.street}</span>,
        },
        {
            title: '操作',
            key: 'actions',
            width: '130px',
            render: (text, address) => (
                <>
                    <Button onClick={()=>onOpen({address})} type="link" className="table-action">编辑</Button>
                    {!address.defaultShipFrom && !address.defaultReturnTo &&
                    <Popconfirm placement="topLeft" title="确认删除该地址?" onConfirm={() => onDelete(address.id)}>
                        <Button type="link"  danger className="table-action">删除</Button>
                    </Popconfirm>
                    }
                </>
            ),
        },
    ];

    return (
        <Status status={status} error={error}>
            {renderModal(EditModal)}
            <div className="action-bar">
                <Button onClick={()=>onOpen()} type="primary">添加</Button>
            </div>
            <Table
                   columns={columns}
                   dataSource={data}
                   rowKey="id"
                   pagination={false}
            />
        </Status>
    );
}
