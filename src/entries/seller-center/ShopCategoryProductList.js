import React, {useEffect} from "react";
import {Button, Spin, Modal, Table, Alert} from "antd";
import ProductPicker from "./ProductPicker";
import {Status} from "../../components";
import {useAsyncTask, useModalTrigger} from "../../hooks";
import * as api from "../../api";
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import difference from "lodash/difference";
import {Form} from "antd";
const {useForm} = Form;

const saveApi = (shopCategoryId, selections, newSelections) => {
    const toAdd = difference(newSelections, selections);
    const toRemove = difference(selections, newSelections);
    const promises = [];
    if (toAdd && toAdd.length > 0) {
        promises.push(api.addProductIntoShopCategory({
                shopCategoryId,
                productIds: toAdd,
        }));
    }

    if (toRemove && toRemove.length > 0) {
        promises.push(api.removeProductIntoShopCategory({
            shopCategoryId,
            productIds: toRemove,
        }));
    }
    return Promise.all(promises);
};

export default function ShopCategoryProductList({shopCategory}) {
    // const params = useParams();
    const shopCategoryId2 = shopCategory.id;
    const loadTask = useAsyncTask(() => api.getShopCategoryProducts({shopCategoryId2}));
    const selections = loadTask.data && loadTask.data.map(product => product.id);
    const saveTask = useAsyncTask(saveApi, {
        onSuccess: loadTask.execute,
    });

    const {onOpen, renderModal} = useModalTrigger(newSelections => {
        saveTask.execute(shopCategoryId2, selections, newSelections);
    });
    useEffect(loadTask.execute,[]);


    const columns = [
        {
            title: '商品ID',
            dataIndex: 'id',
            width: '100px',
        },
        {
            title: '商品图片',
            dataIndex: 'image',
            width: '100px',
            render: (text, product) => <img src={product.image} style={{width:80}}/>
        },
        {
            title: '商品名称',
            dataIndex: 'title',
        },
        {
            title: '操作',
            key: 'actions',
            width: '100px',
            render: (text, product) => (<>
                    <Button type="link" className="table-action" onClick={()=>null}>删除</Button>
                </>
            ),
        },
    ];


    return (
        <Status task={saveTask}>
            <Status task={loadTask}>

                <div className="action-bar-flex">
                    <div className="action-bar-left">
                        <span>分类[{shopCategory.name}]已关联{selections && selections.length}个商品</span>
                    </div>
                    <div className="action-bar-right">
                        <Button onClick={()=>onOpen()} type="primary">添加商品</Button>
                    </div>
                </div>
                {renderModal(ProductPicker, {selections})}
                <Table
                       columns={columns}
                       dataSource={loadTask.data}
                       rowKey="id"
                       pagination={false}
                />
            </Status>
        </Status>
    );
}