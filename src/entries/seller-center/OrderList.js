import React,{useEffect, useState} from 'react'
import * as api from '../../api';
import {usePlainSearchParams, useAsyncTask, useModalTrigger} from '../../hooks';
import {Status} from '../../components';
import {ORDER_STATUS, ORDER_STATUS_TEXT} from './constant';
import {Link, useRouteMatch} from 'react-router-dom';
import {Pagination, Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
import * as moment from 'moment';
import OrderUpdateMemoModal from './OrderUpdateMemoModal';
import './OrderList.less';

const { RangePicker } = DatePicker;

export default function OrderList(props) {
    const [searchParams, setSearchParams] = usePlainSearchParams();
    const {status, data, error, execute} = useAsyncTask(api.getOrders);
    const [form] = Form.useForm();

    const memoModalTrigger = useModalTrigger();

    useEffect(()=>{
        execute(searchParams);
    }, []);


    function onPageChange(page, pageSize) {
        execute(setSearchParams({page, pageSize}));
    }

    function onFinish(values) {
        if (values.createTime) {
            const [createTimeStart, createTimeEnd] = values.createTime;
            values.createTimeStart = createTimeStart && createTimeStart.format();
            values.createTimeEnd = createTimeEnd && createTimeEnd.format();
            values.createTime = undefined;
        } else {
            values.createTimeStart = undefined;
            values.createTimeEnd = undefined;
        }

        execute(setSearchParams({...values, page: 1}));
    }

    return (
        <div>
            <Form form={form}
                  initialValues={{
                      ...searchParams,
                      createTime: [
                          searchParams.createTimeStart && moment(searchParams.createTimeStart),
                          searchParams.createTimeEnd && moment(searchParams.createTimeEnd)
                      ]
                  }}
                onFinish={onFinish}
                style={{marginBottom: 20}}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="????????????" name="orderId">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="????????????" name="receiverName">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="????????????" name="receiverPhone">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="????????????" name="trackingNumber">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="????????????" name="status">
                            <Select>
                                <Select.Option>??????</Select.Option>
                                <Select.Option value={ORDER_STATUS.WAIT_BUYER_PAY.toString()}>{ORDER_STATUS_TEXT[ORDER_STATUS.WAIT_BUYER_PAY]}</Select.Option>
                                <Select.Option value={ORDER_STATUS.PAID.toString()}>{ORDER_STATUS_TEXT[ORDER_STATUS.PAID]}</Select.Option>
                                <Select.Option value={ORDER_STATUS.SHIPPED.toString()}>{ORDER_STATUS_TEXT[ORDER_STATUS.SHIPPED]}</Select.Option>
                                <Select.Option value={ORDER_STATUS.FINISHED.toString()}>{ORDER_STATUS_TEXT[ORDER_STATUS.FINISHED]}</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item label="????????????" name="createTime">
                            <RangePicker allowEmpty={[false, true]} showTime placeholder={["????????????","????????????"]}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{textAlign: 'right',}}>
                        <Button type="primary" htmlType="submit">??????</Button>
                        <Button style={{margin: '0 8px'}}
                                onClick={() => form.setFieldsValue({
                                    orderId: undefined,
                                    receiverName: undefined,
                                    receiverPhone: undefined,
                                    trackingNumber: undefined,
                                    status: undefined,
                                    createTime: undefined,
                                })}
                        >
                            ??????
                        </Button>
                    </Col>
                </Row>

            </Form>
            <Status status={status} errMsg={error && error.errMsg}>
                {data && data.content.map((order, i) =>
                    <table className="order-list-table" key={order.id}>
                        <colgroup>
                            <col className="order-list-table-col1"/>
                            <col className="order-list-table-col2"/>
                            <col className="order-list-table-col3"/>
                            <col className="order-list-table-col4"/>
                            <col className="order-list-table-col5"/>
                            <col className="order-list-table-col6"/>
                            <col className="order-list-table-col7"/>
                            <col className="order-list-table-col8"/>
                        </colgroup>
                        <thead>
                        <tr className="order-list-table-title">
                            <th colSpan="8">
                                <Link to={`order/${order.id}`}>???????????????{order.id}</Link>
                                <span style={{marginLeft: 30}}>???????????????{moment(order.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </th>
                        </tr>
                        <tr className="order-list-table-head">
                            <th>????????????</th>
                            <th>??????</th>
                            <th>??????</th>
                            <th>??????</th>
                            <th>??????</th>
                            <th>??????</th>
                            <th>??????</th>
                            <th>??????</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item) =>
                            <tr key={item.id}>
                                <td>
                                    <div className="order-list-table-prod">
                                        <img src={item.image} alt="????????????"/>
                                        <div className="content">
                                            <div>{item.title}</div>
                                            <div>ID???<span>{item.productId}</span></div>
                                            <div>???????????????<span>{item.skuCode}</span></div>
                                            <div>?????????<span>{item.skuAttributes}</span></div>
                                        </div>
                                    </div>
                                </td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.paymentAmount}</td>
                                <td><a data-id={order.buyerId}>{order.buyerNick}</a></td>
                                <td>{item.refundStatus}</td>
                                <td>{ORDER_STATUS_TEXT[order.status]}</td>
                                <td>
                                    <Link className="table-action" to={"order/" + order.id}>??????</Link>
                                    <Button onClick={()=>memoModalTrigger.onOpen({id: order.id, memo: order.sellerMemo})} type="link" className="table-action">
                                        ????????????
                                    </Button>
                                </td>
                            </tr>
                        )}

                        </tbody>
                    </table>
                )}
                {data &&
                    <Pagination
                        onChange={onPageChange}
                        hideOnSinglePage={true}
                        total={data.total}
                        pageSize={data.pageSize}
                        current={data.page}/>
                }

            </Status>

            {memoModalTrigger.renderModal(OrderUpdateMemoModal)}
        </div>
    );
}
