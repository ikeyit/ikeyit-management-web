import React, {useEffect} from 'react';
import * as api from '../../api';
import {Status} from '../../components';
import {useAsyncTask, useModalTrigger} from '../../hooks';
import {Button, Table, Input, Popconfirm, message, Form, Modal} from 'antd';
import {Link} from "react-router-dom";
const {useForm} = Form;

const EditModal = React.memo(({category = {}, ...props}) => {
    const [form] = useForm();
    const {data, status, execute, error} = useAsyncTask(category.id ? api.updateCategory : api.createCategory, {onSuccess:props.onOk});
    return (
        <Modal
            onOk={form.submit}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title={category.id ? "编辑类目" : "添加类目"}
            confirmLoading={status === "loading"}
            width={800}
            initialValue={category}
        >
            <Form form={form}
                  onFinish={execute}
                  initialValues={category}
            >
                <Form.Item name="id" hidden>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item label="父类目">
                    {category.parentName}
                </Form.Item>
                <Form.Item name="parentId" hidden>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item name="name" label="名称" rules={[{required: true, message: "名称为必填项"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="description" label="描述">
                    <Input/>
                </Form.Item>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
});


export default function CategoryList() {
    const {status, error, data = [], execute} = useAsyncTask(api.getAllCategories);
    const {onOpen, renderModal} = useModalTrigger(execute);
    useEffect(()=> {
        execute();
    },[]);
    function onClickDelete(id) {
        api.obsoleteCategory({id}).then(data => {
            execute();
        }).catch(error => {
            message.error(error.errMsg);
        });
    }
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            width: '20%',
        },
        {
            title: '描述',
            dataIndex: 'description',
            width: '30%',
        },
        {
            title: '层级',
            dataIndex: 'level',
            width: '5%',
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (text, item) => (
                <>
                    <Button type="link" size="small" onClick={()=>onOpen({category: item})} >编辑</Button>
                    {item.level < 2 &&
                        <Button
                            type="link"
                            size="small"
                            onClick={()=>onOpen({category: {parentId: item.id, parentName: item.name}})}>
                            添加子类目
                        </Button>
                    }
                    {item.level === 2 &&
                        <Link
                            to={"category_attributes?id=" + item.id}>
                            关联参数
                        </Link>
                    }
                    <Popconfirm
                        placement="topRight"
                        title="属性删除后，只影响后续的商品，以前的商品不受影响。确认删除该属性?"
                        onConfirm={() => onClickDelete(item.id)}>
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
                <Button type="primary" onClick={()=>onOpen({category: {parentId: 0, parentName: "根类目"}})}>添加类目</Button>
            </div>

            <Status status={status} errMsg={error && error.errMsg}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    size="small"
                    pagination={false}
                />
            </Status>
        </>
    );
}
