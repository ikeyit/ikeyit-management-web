import React, {useEffect} from "react";
import {Button, Input, Modal, Table} from "antd";
import {Status} from "../../components";
import * as moment from "moment";
import {useAsyncTask, useModalTrigger} from "../../hooks";
import * as api from "../../api";
import {Form} from "antd";
const {useForm} = Form;

const PAGE_STATUS = {
    DRAFT: 0,
    PUBLISHED: 1,
};

const PAGE_STATUS_TEXT = {
    [PAGE_STATUS.DRAFT]: "未发布",
    [PAGE_STATUS.PUBLISHED]: "已发布",
};


const PAGE_TYPE = {
    HOMEPAGE: 1,
    CUSTOM: 2,
}

//新建页面对话框
const CreateModal = React.memo(props => {
    const [form] = useForm();
    const {data, status, execute, error} = useAsyncTask(api.createShopPage, {onSuccess:props.onOk});
    return (
        <Modal
            onOk={form.submit}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title="新建页面"
            confirmLoading={status === "loading"}
        >
            <Form form={form} onFinish={execute}>
                <Form.Item name="type" initialValue={PAGE_TYPE.HOMEPAGE} hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="name" label="名称" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
});


//重新命名对话框
const RenameModal = React.memo(({pageId, name, ...props})=> {
    const [form] = useForm();
    const {data, status, execute, error} = useAsyncTask(api.updateShopPage, {onSuccess:props.onOk});
    return (
        <Modal
            onOk={form.submit}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title="新建页面"
            confirmLoading={status === "loading"}
        >
            <Form form={form} onFinish={execute}>
                <Form.Item name="id" initialValue={pageId} hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="name" initialValue={name} label="名称" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
});

export default function ShopDecoration() {
    const {status, data, error, execute, setData} = useAsyncTask(() => api.getShopPages({
        type: PAGE_TYPE.HOMEPAGE
    }));
    const createModalTrigger = useModalTrigger(execute);
    const renameModalTrigger = useModalTrigger(execute);

    const setPrefer = (id)=> {
        api.updateShopPage({
            id,
            preferred: true,
        }).then(()=> {
            execute();
        });
    }
    const columns = [
        {
            title: '页面',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            sorter: true,
            dataIndex: 'createTime',
            width: '200px',
            render: createTime => moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: '80px',
            render: status => PAGE_STATUS_TEXT[status],
        },
        {
            title: '操作',
            key: 'actions',
            width: '260px',
            render: (text, page) => (<>
                {
                    page.preferred ?
                    <span className="table-action">默认首页</span>
                        :
                    <Button type="link" className="table-action" onClick={()=>setPrefer(page.id)}>设置首页</Button>
                }
                    <Button type="link" className="table-action" onClick={()=>window.open("/shop-decorator.html#/edit/" + page.id)}>编辑</Button>
                    <Button type="link" className="table-action">发布</Button>
                    <Button type="link" className="table-action" onClick={()=>renameModalTrigger.onOpen({pageId: page.id, name: page.name})} >重命名</Button>
                </>
            ),
        },
    ];

    useEffect(()=> {
        execute({
            type: PAGE_TYPE.HOMEPAGE
        });
    },[]);

    function onTableChange(pagination, filters, sorter) {
        execute();
    };

    return (<div>
        <div className="action-bar">
            <Button onClick={createModalTrigger.onOpen} type="primary">新建页面</Button>
        </div>
        {createModalTrigger.renderModal(CreateModal)}
        {renameModalTrigger.renderModal(RenameModal)}
        <Status status={status} errMsg={error && error.errMsg}>
            <Table
                   columns={columns}
                   dataSource={data && data.content}
                   rowKey="id"
                   pagination={data ? {total: data.total, pageSize: data.pageSize, current: data.page} : false}
                   onChange={onTableChange}
            />
        </Status>
    </div>);
}