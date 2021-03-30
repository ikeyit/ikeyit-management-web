import React, {useEffect, useState} from 'react'
import * as api from '../../api';
import {useParams, useRouteMatch} from "react-router-dom";
import {Radio, Form, Input, Modal, Select} from 'antd';
import {useAsyncTask} from '../../hooks';
import {Status} from '../../components';
import ModalButton from '../../components/ModalButton';
import * as moment from 'moment';
import {ORDER_STATUS, ORDER_STATUS_TEXT, REFUND_STATUS, REFUND_STATUS_TEXT, REFUND_TYPE, REFUND_TYPE_TEXT} from './constant';
import './RefundDetail.less';

function RejectModal({id, onOk, ...restProps}) {
    const [form] = Form.useForm();
    const {status, error, execute} = useAsyncTask(api.rejectRefund, {
        onSuccess: onOk,
    });

    const onFinish = (data) => {
        execute({id, ...data});
    };

    return (
        <Modal
            {...restProps}
            onOk={()=>form.submit()}
            title="拒绝申请"
        >
            <Form
                form={form}
                onFinish={onFinish}
                labelAlign="left"
            >
                <Form.Item label="拒绝理由" name="reason" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="需退回货物后再申请">需退回货物后再申请</Select.Option>
                        <Select.Option value="其它">其它</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="memo" label="拒绝说明">
                    <Input.TextArea/>
                </Form.Item>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
}

function AgreeRefundModal({id, amount, onOk, ...restProps}) {
    const {status, error, execute} = useAsyncTask(api.agreeRefund, {
        onSuccess: onOk,
    });
    return (
        <Modal
            {...restProps}
            onOk={()=>execute({id})}
            title="退款"
        >
            <p>{amount}元将原路退回给买家！确认退款？</p>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
}

function AgreeReturnModal({id, onOk, ...restProps}) {
    const [form] = Form.useForm();
    const {status: addrStatus, data: addr, error: addrError, execute: loadAddr} = useAsyncTask(api.getDefaultReturnToAddress, {
        onSuccess(address) {
            form.setFieldsValue({addressId: address.id});
        }
    });
    useEffect(loadAddr, []);
    const {status, error, execute} = useAsyncTask(api.agreeReturn, {
        onSuccess: onOk,
    });

    const onFinish = (data) => {
        execute({id, ...data});
    };

    return (
        <Modal
            {...restProps}
            onOk={()=>form.submit()}
            title="同意申请"
            width={640}
        >
            <Status
                status={addrStatus}
                errMsg={addrError && addrError.errMsg}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={{memo:"请将退货商品包装好，且商品不影响二次销售；请勿发平邮或到付件，商品寄出后，需及时在每笔退款上操作“填写物流信息”，以免退款超时关闭"}}
                    labelAlign="left"
                >
                    <Form.Item name="addressId" label="退货地址">
                        <Radio.Group>
                            {addr &&
                            <Radio className="return-addr-radio" value={addr.id}>
                                <div>收件人：{addr.name}&nbsp;&nbsp;&nbsp;电话：{addr.phone}</div>
                                <div>地址：{addr.province} {addr.city} {addr.district} {addr.street}</div>
                            </Radio>
                            }
                            <Radio className="return-addr-radio" value={null}>
                                留言其它地址
                            </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="memo" label="留言给买家">
                        <Input.TextArea/>
                    </Form.Item>
                </Form>
            </Status>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
}




export default function RefundDetail() {
    const {id} = useParams();
    const {status, error, data = {}, execute} = useAsyncTask(()=>api.getRefund({id}));

    useEffect(()=>{
        execute();
    },[]);

    const renderActions = ()=> {
        switch(data.status) {
            case REFUND_STATUS.WAIT_SELLER_AGREE:
                if (data.refundType === REFUND_TYPE.ONLY_REFUND) {
                    return (
                        <>
                            <ModalButton modal={AgreeRefundModal} label="同意退款" amount={data.amount} id={data.id} onOK={execute}/>
                            <ModalButton modal={RejectModal} label="拒绝申请" id={data.id} onOK={execute}/>
                        </>
                    );
                } else {
                    return (
                        <>
                            <ModalButton modal={AgreeReturnModal} label="同意申请" id={data.id} onOK={execute}/>
                            <ModalButton modal={RejectModal} label="拒绝申请" id={data.id} onOK={execute}/>
                        </>
                    );
                }
                break;
            case REFUND_STATUS.WAIT_SELLER_CONFIRM_GOODS:
                return (
                    <>
                        <ModalButton modal={AgreeRefundModal} label="退款" id={data.id} amount={data.amount} onOK={execute}/>
                    </>
                );
                break;
        }
    };

    return (
        <Status status={status} errMsg={error && error.errMsg}>
            <div className="order-card order-ops">
                <div className="item">状态：{REFUND_STATUS_TEXT[data.status]}</div>
                {renderActions()}
            </div>
            <div className="order-card">
                {data.negotiations && data.negotiations.map(negotiation =>
                    <div className="refund-negotiation" key={negotiation.id}>
                        <div className="refund-negotiation-hd">
                            {negotiation.operator === "buyer" && "买家"}
                            {negotiation.operator === "seller" && "卖家"}
                            {negotiation.operator === "system" && "系统"}
                        </div>
                        <div className="refund-negotiation-bd">
                            <div className="refund-negotiation-operation">
                            <div className="operation">{negotiation.operation}</div>
                            <div className="time">{negotiation.createTime}</div>
                            </div>
                            <div className="refund-negotiation-message">
                                {negotiation.message && Object.entries(negotiation.message).map(([key, value])=>
                                    <div>{key}: {value}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="order-card order-basic">
                <div className="item">退款编号：{data.id}</div>
                <div className="item">退款类型：{REFUND_TYPE_TEXT[data.refundType]}</div>
                <div className="item">退款理由：{data.reason}</div>
                <div className="item">补充说明：{data.memo}</div>
                <div className="item">退款金额：{data.amount}元</div>
                <div className="item">商品：{data.title}</div>
                <div className="item">规格：{data.skuAttributes}</div>
                <div className="item">付款金额：{data.paymentAmount}元</div>
                <div className="item">数量：{data.quantity}</div>
                <div className="item">创建时间：{moment(data.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
            </div>
            <div className="order-card order-ops">
                <div className="item">快递公司：{data.logisticsCompany}</div>
                <div className="item">快递单号：{data.trackingNumber}</div>
            </div>
        </Status>
    );
}