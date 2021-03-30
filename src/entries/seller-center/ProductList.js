import React,{useEffect} from 'react'
import * as api from '../../api';
import {PRODUCT_STATUS} from './constant';
import {Link} from 'react-router-dom';
import {usePlainSearchParams, useAsyncTask} from '../../hooks';
import {Status} from '../../components';
import {Button, Col, Form, Input, Row, Radio, Table, Space} from "antd";
import * as moment from "moment";

import './ProductList.less';



export default function ProductList(props) {
    const [searchParams, setSearchParams] = usePlainSearchParams();
    const {status, data, error, execute, setData} = useAsyncTask(api.getProducts);
    const [form] = Form.useForm();

    useEffect(()=> {
        execute(searchParams);
    },[]);


    function onTableChange(pagination, filters, sorter) {
        execute(setSearchParams({
                page: pagination.current,
                pageSize: pagination.pageSize,
                sort: sorter.order ? sorter.field + "_" + (sorter.order === 'ascend' ? "asc" : "desc") : undefined
            })
        );
    };

    function setProductOnSale(product) {
        api.setProductOnSale({id: product.id}).then(res => {
            product.status = PRODUCT_STATUS.ON_SALE;
            setData({...data});
        }).catch(error=>{

        });
    }

    function setProductOffSale(product) {
        api.setProductOffSale({id: product.id}).then(res => {
            product.status = PRODUCT_STATUS.OFF_SALE;
            setData({...data});
        }).catch(error=>{

        });
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const columns = [
        {
            title: '商品信息',
            key: 'name',
            render: product => (
                <div className="good-info">
                    <img src={product.image} alt="商品图片"/>
                    <div className="good-info-bd">
                        <div>{product.title}</div>
                        <div>ID：<span>{product.id}</span></div>
                        <div>商家编码：<span>{product.model}</span></div>
                    </div>
                </div>
            ),
        },
        {
            title: '价格',
            dataIndex: 'price',
            sorter: true,
            width: '8%',
        },
        {
            title: '库存',
            sorter: true,
            dataIndex: 'stock',
            width: '8%',
        },
        {
            title: '销量',
            sorter: true,
            dataIndex: 'sales',
            width: '8%',
        },
        {
            title: '创建时间',
            sorter: true,
            dataIndex: 'createTime',
            render: createTime => moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: status => (
                PRODUCT_STATUS[status]
            ),
            width: '8%',
        },
        {
            title: '操作',
            key: 'actions',
            width: '200px',
            render: (text, product) => (
                <>
                    <Link className="table-action" to={"product_edit?id=" + product.id}>编辑</Link>
                    <Link className="table-action" to={"product/" + product.id}>查看</Link>
                    {product.status === PRODUCT_STATUS.OFF_SALE &&
                        <Button onClick={()=>setProductOnSale(product)} type="link" className="table-action">上架</Button>
                    }
                    {product.status === PRODUCT_STATUS.ON_SALE &&
                        <Button onClick={()=>setProductOffSale(product)} type="link" className="table-action">下架</Button>
                    }
                </>
            ),
        },
    ];


    return (
        <div>
        <Form form={form}
              onFinish={(values)=>execute(setSearchParams({...values, page: 1}))}
              initialValues={searchParams}
              style={{marginBottom: 20}}>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name="status" onChange={()=>form.submit()}>
                        <Radio.Group>
                            <Radio.Button value={undefined}>全部</Radio.Button>
                            <Radio.Button value="1">在售中</Radio.Button>
                            <Radio.Button value="0">已下架</Radio.Button>
                            <Radio.Button value="3">已售罄</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="产品ID" name="id">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="商品标题" name="title">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="商家编码" name="model">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{textAlign: 'right',}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{margin: '0 8px'}}
                            onClick={() => form.setFieldsValue({id: undefined, title: undefined, model: undefined})}
                    >
                        清空
                    </Button>
                </Col>
            </Row>
        </Form>
        <Status status={status} errMsg={error && error.errMsg}>
            <Table rowSelection={{...rowSelection}}
                   columns={columns}
                   dataSource={data && data.content}
                   rowKey="id"
                   pagination={data ? {total: data.total, pageSize: data.pageSize, current: data.page} : false}
                   onChange={onTableChange}
            />

        </Status>
    </div>);
}
