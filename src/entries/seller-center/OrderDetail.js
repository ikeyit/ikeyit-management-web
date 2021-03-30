import React, {useEffect, useState} from 'react'
import * as api from '../../api';
import {useParams, useRouteMatch} from "react-router-dom";
import {Button} from 'antd';
import {useAsyncTask} from '../../hooks';
import {Status} from '../../components';
import * as moment from 'moment';
import {ORDER_STATUS, ORDER_STATUS_TEXT} from './constant';
import OrderShipModal from './OrderShipModal';
import OrderUpdateMemoModal from './OrderUpdateMemoModal';
import ModalButton from '../../components/ModalButton';
import './OrderDetail.less';

export default function OrderDetail() {
    const {id} = useParams();
    const {status, error, data, execute} = useAsyncTask(()=>api.getOrder({id}));
    useEffect(()=>{
        execute();
    },[]);

    return (
        <Status status={status} errMsg={error && error.errMsg}>
            {data && <>
            <div className="order-card order-ops">
                <Button type="primary" onClick={()=>execute()}>刷新</Button>
                {data.status === ORDER_STATUS.PAID &&
                <ModalButton label="发货" modal={OrderShipModal} id={id} onOK={execute}/>
                }
            </div>

            <div className="order-card order-basic">
                <div className="item">订单编号：{data.id}</div>
                <div className="item">状态：{ORDER_STATUS_TEXT[data.status]}</div>
            </div>

            {data.trackingNumber &&
            <div className="order-card order-basic">
                <div className="item">快递公司：{data.logisticsCompany}</div>
                <div className="item">快递单号：{data.trackingNumber}</div>
            </div>
            }


            <div className="order-card order-buyer">
                <div className="item">买家：{data.buyerNick}</div>
                <div className="item">收货人：{data.receiverName}</div>
                <div className="item">收货人手机号：{data.receiverPhone}</div>
                <div className="item">收货地址：{data.receiverProvince} {data.receiverCity} {data.receiverDistrict} {data.receiverStreet}</div>
                <div className="item">买家留言：{data.buyerMemo}</div>
            </div>

            <div className="order-card order-seller">
                <div className="item">卖家留言：{data.sellerMemo}</div>
                <div className="item">
                    <ModalButton label="更新备注" modal={OrderUpdateMemoModal} id={id} memo={data.sellerMemo} onOK={execute}/>
                </div>
            </div>

            <div className="order-card order-items">
                <table className="order-item-table">
                    <colgroup>
                        <col className="order-item-table-col1"/>
                        <col className="order-item-table-col2"/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>图片</th>
                        <th>名称</th>
                        <th>规格</th>
                        <th>数量</th>
                        <th>单价</th>
                    </tr>
                    </thead>
                    <tbody>{data.items ? data.items.map((item) =>
                        <tr key={item.id}>
                        <td className="order-item-table-prod">
                            <img src={item.image}/>
                        </td>
                        <td>{item.title}</td>
                        <td>{item.skuAttributes}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        </tr>) : ''}</tbody>
                </table>
                <div className="item">商品总数：{data.goodsQuantity}</div>
                <div className="item">商品金额：{data.goodsAmount}元</div>
                <div className="item">优惠金额：{data.discountAmount}元</div>
                <div className="item">运费：{data.freightAmount}元</div>
                <div className="item">支付金额：{data.paymentAmount}元</div>
                <div className="item">创建时间：{moment(data.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                {data.payTime &&
                <div className="item">支付时间：{moment(data.payTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                }
                {data.shipTime &&
                <div className="item">发货时间：{moment(data.shipTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                }
                {data.finishTime &&
                <div className="item">完成时间：{moment(data.finishTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                }
            </div>
            </>}
        </Status>
    );
}