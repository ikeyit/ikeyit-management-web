import React, {useEffect} from 'react';
import * as api from '../../api';
import {Status} from '../../components';
import {useAsyncTask, useModalTrigger} from '../../hooks';
import {Button, Table, Input, Popconfirm, message, Form, Modal} from 'antd';
import {Link} from "react-router-dom";
const {useForm} = Form;

const EditModal = React.memo(({weixinClient = {}, ...props}) => {
    const [form] = useForm();
    const {data, status, execute, error} = useAsyncTask(weixinClient.appId ? api.updateWeixinClient : api.createWeixinClient, {onSuccess:props.onOk});
    return (
        <Modal
            onOk={form.submit}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title={weixinClient.appId ? "编辑微信客户端" : "添加微信客户端"}
            confirmLoading={status === "loading"}
            width={800}
        >
            <Form form={form}
                  onFinish={execute}
                  initialValues={weixinClient}
            >
                <Form.Item name="appName" label="客户端名称" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="appId" label="appId" rules={[{required: true}]}>
                    <Input disabled={!!weixinClient.appId}/>
                </Form.Item>
                <Form.Item name="appSecret" label="appSecret" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="unionName" label="unionName" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
});


export default function WeixinClientList() {
    const loadTask = useAsyncTask(api.getWeixinClients);
    const saveTask = useAsyncTask({
        delete: api.deleteWeixinClient,
    }, {
        onSuccess: loadTask.execute
    });

    const {onOpen, renderModal} = useModalTrigger(()=> {
        console.info("OK");
        loadTask.execute();
    });
    useEffect(loadTask.execute,[]);

    const columns = [
        {
            title: 'appId',
            dataIndex: 'appId',
            width: '20%',
        },
        {
            title: 'appName',
            dataIndex: 'appName',
            width: '20%',
        },
        {
            title: 'unionName',
            dataIndex: 'unionName',
            width: '20%',
        },
        {
            title: 'appSecret',
            dataIndex: 'appSecret',
            width: '20%',
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (text, item) => (
                <>
                    <Button type="link" size="small" onClick={()=>onOpen({weixinClient: item})} >编辑</Button>
                    <Popconfirm
                        placement="topRight"
                        title="确认删除该微信客户端?删除后，将无法从该客户端登录！"
                        onConfirm={() => saveTask.execute("delete", {appId: item.appId})}>
                        <Button
                            type="link"
                            size="small">
                            删除
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];


    return (
        <>
            {renderModal(EditModal)}
            <div style={{marginBottom:20}}>
                <Button type="primary" onClick={()=>onOpen()}>添加微信客户端</Button>
            </div>

            <Status task={loadTask}>
                <Status task={saveTask}>
                    <Table
                        columns={columns}
                        dataSource={loadTask.data}
                        rowKey="appId"
                        size="small"
                        pagination={false}
                    />
                </Status>
            </Status>
        </>
    );
}
