import React, {useState, useEffect} from 'react';
import * as api from '../../api';
import {Status} from '../../components';
import {useAsyncTask, useModalTrigger, usePromise} from '../../hooks';
import {Button, Table, Input, Popconfirm, Popover, message, Form, Modal} from 'antd';
import {LeftOutlined} from "@ant-design/icons";
import ShopCategoryProductList from "./ShopCategoryProductList";
import {ImageCard} from "./ImageCard";
import {reorderArray} from "../../utils/reorderArray";
const {useForm} = Form;

const EditModal = React.memo(({category = {}, ...props}) => {
    const [form] = useForm();
    const {data, status, execute, error} = useAsyncTask(category.id ? api.updateShopCategory : api.createShopCategory, {onSuccess:props.onOk});
    return (
        <Modal
            onOk={form.submit}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title={category.id ? "编辑分类" : "添加分类"}
            confirmLoading={status === "loading"}
            width={800}
        >
            <Form form={form}
                  onFinish={execute}
                  initialValues={category}
            >
                <Form.Item name="id" hidden>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item name="position" hidden>
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
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
});


const loadApi = ()=> {
   return api.getShopCategories().then(data => {
       const lastIndex1 = data.length - 1;
       data.forEach((item1, index1)=> {
           item1.isFirst = index1 === 0;
           item1.isLast = index1 === lastIndex1;
           if (item1.children) {
               const lastIndex2 = item1.children.length - 1;
               item1.children.forEach((item2, index2) => {
                   item2.isFirst = index2 === 0;
                   item2.isLast = index2 === lastIndex2;
               });
           }
       });

       return data;
    });
}

const saveApi = (action, ...args) => {
    switch (action) {
        case "update":
            return api.updateShopCategory(...args);
        case "order":
            return api.orderShopCategories(...args);
        case "delete":
            return api.deleteShopCategory(...args);
        default:
            throw new Error("not support");
    }
}

export default function ShopCategoryList() {
    const loadTask = useAsyncTask(loadApi);
    const saveTask = useAsyncTask(saveApi, {
        onSuccess: loadTask.execute
    });

    const [productAssociation, setProductAssociation] = useState({visible: false});
    const {onOpen, renderModal} = useModalTrigger(loadTask.execute);
    useEffect(loadTask.execute,[]);

    const onClickDelete = id => {
        saveTask.execute("delete", {id});
    }

    const onImageChange = (image, category) => {
        saveTask.execute("update", {id: category.id, image: image});
    }

    //移动类目位置
    const onMove = (item, fromIndex, toIndex) => {
        let siblings = loadTask.data;
        if (item.parentId)
            siblings = loadTask.data.find(c => c.id === item.parentId).children;
        const oldIds = siblings.map(s => s.id);
        const ids = reorderArray(oldIds, fromIndex, toIndex);

        saveTask.execute("order", {ids});
    }

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const onExpand = (expanded, record) => {
        setExpandedRowKeys(pre => {
            if (expanded)
                return [...pre, record.id];
            else
                return pre.filter(id => id !== record.id);
        });
    };

    const expandRow = id => {
        if (expandedRowKeys.indexOf(id) < 0) {
            setExpandedRowKeys(pre=>[...pre, id]);
        }
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '图片',
            dataIndex: 'image',
            width: '80px',
            render: (text, item) => (
                <ImageCard image={item.image} onChange={image => onImageChange(image, item)} className="sku-image-upload"/>
            )
        },
        {
            title: '排序',
            width: '120px',
            render: (text, item, index) =>{
                return (
                <>
                    <Button className="table-action" disabled={item.isFirst} type="link" size="small" onClick={()=>onMove(item, index, index - 1)}>上移</Button>
                    <Button className="table-action" disabled={item.isLast} type="link" size="small" onClick={()=>onMove(item, index, index + 1)}>下移</Button>
                </>
            )}
        },
        {
            title: '操作',
            key: 'actions',
            width: '200px',
            render: (text, item) => (
                <>
                    <Button className="table-action" type="link" size="small" onClick={()=>onOpen({category: item})} >编辑</Button>
                    {item.level < 1 &&
                        <Button className="table-action"  type="link" size="small"
                            onClick={()=>{
                                expandRow(item.id);
                                onOpen({category: {parentId: item.id, parentName: item.name, position: item.children ? item.children.length : 0}})
                            }}>
                            添加子类目
                        </Button>
                    }
                    {item.level == 1 &&
                        // <Link
                        //     to={"shop_category_products/" + item.id}>
                        //     关联商品
                        // </Link>
                        <Button className="table-action"  type="link" size="small" onClick={()=>setProductAssociation({visible:true, shopCategory: item})}>
                            关联商品
                        </Button>
                    }
                    <Popconfirm
                        placement="topRight"
                        title="属性删除后，只影响后续的商品，以前的商品不受影响。确认删除该属性?"
                        onConfirm={() => onClickDelete(item.id)}>
                        <Button className="table-action" type="link" size="small">删除</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];


    if (productAssociation.visible)
        return (
            <div>
                <Button
                    className = "nav-back"
                    type="link"
                    icon={<LeftOutlined />}
                    size="small" onClick={()=>setProductAssociation({visible:false})}>
                    返回分类管理
                </Button>
                <ShopCategoryProductList shopCategory={productAssociation.shopCategory}/>
            </div>
        );

    return (
        <>
            <Status task={loadTask}>
                {renderModal(EditModal)}
                <div style={{marginBottom:20}}>
                    <Button type="primary" onClick={()=>onOpen({category:{parentName:"根分类", position: loadTask.data.length}})}>添加分类</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={loadTask.data}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    expandable={{
                        expandedRowKeys,
                        onExpand
                    }}
                />
            </Status>
        </>
    );
}
