import React, {useEffect} from "react";
import {Pagination} from "antd";
import {useAsyncTask} from "../../hooks";
import {Status} from "../../components";
import * as api from "../../api/messageApi";
import {MESSAGE_STATUS, MESSAGE_TYPE, ORDER_STATUS} from "./constant";
import {Link} from "react-router-dom";



function TradeMessage({message}) {
    const content = JSON.parse(message.content);
    return (
        <div>
            <div className="msg-box-hd">
                <div className="msg-box-title">订单{ORDER_STATUS[content.orderStatus]}</div>
                <div className="msg-box-time">{message.createTime}</div>
            </div>
            <div className="msg-box-bd msg-box-order">
                <div className="msg-box-order-image"><img src={content.image}/></div>
                <div className="msg-box-order-info">
                    <div className="msg-box-order-in">{content.title}</div>
                    <div className="msg-box-order-in">总数量：{content.totalQuantity}</div>
                    <div className="msg-box-order-in">总金额：{content.totalAmount}元</div>
                </div>
            </div>
            <div className="msg-box-ft"><Link to={"/order/" + content.orderId} data-router-link="true">查看详情</Link></div>
        </div>
    );
}

function SystemMessage({message}) {
    const content = JSON.parse(message.content);
    return (
        <div>
            <div className="msg-box-hd">
                <div className="msg-box-title">{content.title}</div>
                <div className="msg-box-time">{message.createTime}</div>
            </div>
            <div className="msg-box-bd">{content.detail}</div>
            {content.link ? <div className="msg-box-ft"><a href={content.link} target="_blank">查看详情</a></div> : ''}
        </div>
    );
}

function ShopMessage({message}) {
    const content = JSON.parse(message.content);
    return (
        <div>
            <div className="msg-box-hd">
                <div className="msg-box-title">{content.title}</div>
                <div className="msg-box-time">{message.createTime}</div>
            </div>
            <div className="msg-box-bd">{content.detail}</div>
            {content.link ? <div className="msg-box-ft"><a href={content.link} target="_blank">查看详情</a></div> : ''}
        </div>
    );
}


export const Message = React.memo(({message}) => {
    try {
        switch(message.messageType) {
            case MESSAGE_TYPE.TRADE:
                return <TradeMessage message={message}/>;
            case MESSAGE_TYPE.SYSTEM:
                return <SystemMessage message={message}/>;
            case MESSAGE_TYPE.SHOP:
                return <ShopMessage message={message}/>;
        }
        return <div>未知消息</div>;
    } catch(error) {
        return <div>消息格式错误</div>;
    }
});



export function MessageList({messageType, visible, onMessageRead}) {
    const {status, data, error = {}, execute} = useAsyncTask(api.getMessages , {
        onSuccess(data) {
            //如果有未读消息，标记为已读
            data.content.some((item => item.status === MESSAGE_STATUS.UNREAD))
            && api.setMessagesAllRead({messageType}).then(data => {
                data > 0 && onMessageRead && onMessageRead();
            }).catch(error=> {
                console.error(`消息标记已读失败：${error.errMsg}`);
            })
        }
    });

    useEffect(()=>{
        if (visible)
            execute({messageType});
    }, [visible]);


    return (
        <Status status={status} errMsg={error.errMsg}>
            {data &&
            <>
               <div className="msg-box-list">
                    {data.content.map(message =>
                        <div className="msg-box-item" key={message.id}>
                            <Message message={message}/>
                        </div>
                    )}
                </div>
                <Pagination
                    onChange={(page, pageSize) => execute({messageType, page, pageSize})}
                    hideOnSinglePage={true}
                    total={data.total}
                    pageSize={data.pageSize}
                    current={data.page}
                />
            </>
            }
        </Status>
    );
}