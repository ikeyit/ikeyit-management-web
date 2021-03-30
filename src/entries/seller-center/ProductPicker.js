import React, {useEffect, useMemo, useState} from 'react'
import {Button, Form, Input, Modal, Popconfirm, Table} from "antd";
import {Status} from "../../components";
import {useAsyncTask} from "../../hooks";
import * as api from "../../api";

const ProductPicker = React.memo(({selections, ...props}) => {
    const {status, error, data = [], execute} = useAsyncTask(api.getProducts);
    const [selectedRowKeys, setSelectedRowKeys] = useState(selections || []);
    useEffect(execute, []);
    const columns = [
        {
            title: '商品ID',
            dataIndex: 'id',
            width: '100px',
        },
        {
            title: '商品图片',
            dataIndex: 'image',
            width: '80px',
            render: (text, product) => <img src={product.image} style={{width:80}}/>
        },
        {
            title: '商品名称',
            dataIndex: 'title',

        }
    ];
    const onSelectionChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const onOk = () => {
        props.onOk && props.onOk(selectedRowKeys);
    }

    return (
        <Modal
            onOk={onOk}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title={"选择商品"}
            width={1000}
        >

            <Status status={status} errMsg={error && error.errMsg}>
                <div style={{marginBottom:10}}>共选中{selectedRowKeys.length}个商品</div>
                <Table
                    columns={columns}
                    dataSource={data && data.content}
                    rowKey="id"
                    rowSelection={{
                        selectedRowKeys,
                        onChange: onSelectionChange
                    }}
                    pagination={data ? {total: data.total, pageSize: data.pageSize, current: data.page} : false}
                />
            </Status>
        </Modal>
    );
});

export default ProductPicker;