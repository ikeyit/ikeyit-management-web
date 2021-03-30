import React,{useEffect} from 'react'
import './HomePage.less'
import * as api from '../../api';
import {useAsyncTask} from "../../hooks";

export default function Home() {
    const {data, execute, status, error} = useAsyncTask(api.getHomeStats, {
        init: {
            data: {
                waitBuyerPayOrderCount: "-",
                paidOrderCount: "-",
                todayTurnover: "-",
                todayOrderCount: "-",
            },
        }
    });

    useEffect(execute, []);
    return <div>
        <div className="card">
            <div className="card-bd">
                <div className="card-row">
                    <div className="pending-status">
                        <div className="pending-status-title">待付款</div>
                        <div className="big-num">{data.waitBuyerPayOrderCount}</div>
                    </div>
                    <div className="pending-status">
                        <div className="pending-status-title">
                            待发货
                        </div>
                        <div className="big-num">{data.paidOrderCount}</div>
                    </div>
                    <div className="pending-status">
                        <div className="pending-status-title">
                            今日成交额
                        </div>
                        <div className="big-num">{data.todayTurnover}</div>
                    </div>
                    <div className="pending-status">
                        <div className="pending-status-title">
                            今日订单数
                        </div>
                        <div className="big-num">{data.todayOrderCount}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}