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


export default function UserList() {
    const loadTask = useAsyncTask(api.getUsers);
    const saveTask = useAsyncTask({
        enable: api.setUsersEnabled,
    }, {
        onSuccess: loadTask.execute
    });

    const {onOpen, renderModal} = useModalTrigger(loadTask.execute);
    useEffect(loadTask.execute,[]);

    const columns = [
        {
            title: '用户ID',
            dataIndex: 'id',
            width: '80px',
        },
        {
            title: '登录名',
            dataIndex: 'loginName',
            width: '20%',
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            width: '80px',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: '20%',
        },
        {
            title: '状态',
            width: '80px',
            render: (text, item) => item.enabled ? "正常":"已禁用",
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (text, item) => (
                <>
                    <Button type="link" size="small" onClick={()=>onOpen({weixinClient: item})} >编辑</Button>
                    {item.enabled &&
                    <Popconfirm
                        placement="topRight"
                        title="确认禁用该用户？"
                        onConfirm={() => saveTask.execute("enable", {userIds:[item.id],enabled:false})}>
                        <Button
                            className="table-action"
                            type="link"
                            size="small">
                            禁用
                        </Button>
                    </Popconfirm>
                    }
                    {!item.enabled &&
                    <Popconfirm
                        placement="topRight"
                        title="确认解禁该用户？"
                        onConfirm={() => saveTask.execute("enable", {userIds:[item.id],enabled:true})}>
                        <Button
                            className="table-action"
                            type="link"
                            size="small">
                            解禁
                        </Button>
                    </Popconfirm>
                    }
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
                        dataSource={loadTask.data && loadTask.data.content}
                        rowKey="appId"
                        size="small"
                        pagination={{...loadTask.data}}
                    />
                </Status>
            </Status>
        </>
    );
}
