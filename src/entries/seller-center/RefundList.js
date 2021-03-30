import React, {useEffect} from "react";
import {useAsyncTask, usePlainSearchParams} from "../../hooks";
import * as api from "../../api";
import {Button, Col, Form, Input, Radio, Row, Select, Space, Table} from "antd";
import {REFUND_STATUS, REFUND_STATUS_TEXT, ORDER_STATUS, ORDER_STATUS_TEXT, REFUND_TYPE, REFUND_TYPE_TEXT} from "./constant";
import * as moment from "moment";
import {Link} from "react-router-dom";
import {Status} from "../../components";


export default function RefundList() {
    const [searchParams, setSearchParams] = usePlainSearchParams();
    const {status, data, error, execute, setData} = useAsyncTask(api.getRefunds);
    const [form] = Form.useForm();

    useEffect(()=> {
        execute(searchParams);
    },[]);


    function onTableChange(pagination, filters, sorter) {
        execute(setSearchParams({
                page: pagination.current,
                pageSize: pagination.pageSize,
                // sort: sorter.order ? sorter.field + "_" + (sorter.order === 'ascend' ? "asc" : "desc") : undefined
            })
        );
    };

    const columns = [
        {
            title: '售后单号',
            dataIndex: 'id',
        },
        {
            title: '商品信息',
            key: 'name',
            render: refund => (
                <div className="good-info">
                    <img src={refund.image} alt="商品图片"/>
                    <div className="good-info-bd">
                        <div>{refund.title}</div>
                        <div>{refund.skuAttributes}</div>
                        <div>x {refund.quantity}</div>
                        <div>商品ID：{refund.productId}</div>
                    </div>
                </div>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '150px',
            render: createTime => moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: '实付金额',
            dataIndex: 'paymentAmount',
            width: '80px',
            render: paymentAmount => (
                <span className="money">¥{paymentAmount}</span>
            ),
        },
        {
            title: '退款金额',
            dataIndex: 'amount',
            width: '80px',
            render: amount => (
                <span className="money">¥{amount}</span>
            ),
        },
        {
            title: '退款类型',
            dataIndex: 'refundType',
            width: '80px',
            render: refundType => (
                <span>{REFUND_TYPE_TEXT[refundType]}</span>
            ),
        },
        {
            title: '退款理由',
            dataIndex: 'reason',
            width: '160px',
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            width: '80px',
            render: orderStatus => (
                <span>{ORDER_STATUS_TEXT[orderStatus]}</span>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: '140px',
            render: (status, refund) => (
                <Link to={"refund/" + refund.id}>{REFUND_STATUS_TEXT[status]}</Link>
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
                        <Form.Item name="status" onChange={()=>form.submit()} initialValue={null}>
                            <Radio.Group >
                                <Radio.Button value={null}>全部</Radio.Button>
                                <Radio.Button value={REFUND_STATUS.WAIT_SELLER_AGREE.toString()}>{REFUND_STATUS_TEXT[REFUND_STATUS.WAIT_SELLER_AGREE]}</Radio.Button>
                                <Radio.Button value={REFUND_STATUS.WAIT_SELLER_CONFIRM_GOODS.toString()}>{REFUND_STATUS_TEXT[REFUND_STATUS.WAIT_SELLER_CONFIRM_GOODS]}</Radio.Button>
                                <Radio.Button value={REFUND_STATUS.SUCCESS.toString()}>{REFUND_STATUS_TEXT[REFUND_STATUS.SUCCESS]}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="退款ID" name="id">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="退款类型" name="refundType" initialValue={null}>
                            <Select>
                                <Select.Option value={null}>全部</Select.Option>
                                <Select.Option value={REFUND_TYPE.ONLY_REFUND.toString()}>{REFUND_TYPE_TEXT[REFUND_TYPE.ONLY_REFUND]}</Select.Option>
                                <Select.Option value={REFUND_TYPE.RETURN_REFUND.toString()}>{REFUND_TYPE_TEXT[REFUND_TYPE.RETURN_REFUND]}</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{textAlign: 'right',}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{margin: '0 8px'}}
                                onClick={() => form.setFieldsValue({id: undefined, title: undefined})}
                        >
                            清空
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}>
                <Table
                    columns={columns}
                    dataSource={data && data.content}
                    rowKey="id"
                    pagination={data ? {total: data.total, pageSize: data.pageSize, current: data.page} : false}
                    onChange={onTableChange}
                    size="middle"
                />

            </Status>
        </div>);
}