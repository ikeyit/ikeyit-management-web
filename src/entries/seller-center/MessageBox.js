import React, {useEffect, useState} from "react";
import  * as api from '../../api/messageApi';
import {MESSAGE_TYPE, MESSAGE_STATUS, ORDER_STATUS} from './constant';
import {Badge, Drawer, notification, Tabs, Pagination} from 'antd';
import {Message, MessageList} from './MessageList';
import {NotificationFilled } from '@ant-design/icons';
import './MessageBox.less';
const { TabPane } = Tabs;


export default function MessageBox() {
    const [activeType, setActiveType] = useState(MESSAGE_TYPE.TRADE.toString());
    const [messageStats, setMessageStats] = useState({items:[], totalMessageCount: 0});
    const [messageBoxVisible, setMessageBoxVisible] = useState(false);
    const [notificationApi, notificationHolder] = notification.useNotification();

    function refreshStats() {
        api.getMessageStats().then(items => {
            setMessageStats(prevStats =>
                //判断是不是有变化了
                prevStats.items.length === items.length && prevStats.items.every(preItem =>
                        items.some(item =>
                            item.messageType === preItem.messageType && item.unreadCount === preItem.unreadCount
                        )
                ) ?
                prevStats : {items, totalMessageCount: items.reduce((total, item) => total + item.unreadCount, 0)}
            );
        }).catch(error=> {
            console.error(`更新消息数量失败：${error.errMsg}`);
        })
    }

    function openMessageBox() {
        setMessageBoxVisible(true);
    }

    function closeMessageBox() {
        setMessageBoxVisible(false);
    }

    function onDrawerClick(e) {
        e.target.getAttribute("data-router-link") === 'true' && closeMessageBox();
    }

    useEffect(() => {
        const messageClient = api.messageClient({
            onMessage(message) {
                notificationApi.open({
                    // message: "title",
                    description: (<Message message={message}/>),
                });

                refreshStats();
            }
        });
        refreshStats();
        console.info("###start message stats loop");
        const intervalId = setInterval(refreshStats, 20000);
        return () => {
            messageClient.deactivate();
            console.info("###stop message stats loop");
            clearInterval(intervalId);
        }
    },[]);


    function renderTab(item) {
        return (
            <Badge count={item.unreadCount}>
                {MESSAGE_TYPE[item.messageType]}
            </Badge>
        );
    };

    return (
        <>
            {notificationHolder}
            <Badge count={messageStats.totalMessageCount} onClick={openMessageBox} className="msg-badge">
                <NotificationFilled style={{ fontSize: '16px', color: '#fff' }}/>
            </Badge>
            <Drawer onClose={closeMessageBox} onClick={onDrawerClick} visible={messageBoxVisible} width={640}>
                <Tabs activeKey={activeType} onChange={type=>setActiveType(type)}>
                    {messageStats.items.map(item =>
                    <TabPane tab={renderTab(item)} key={item.messageType}>
                        <MessageList
                            messageType={item.messageType}
                            visible={messageBoxVisible && activeType === item.messageType.toString()}
                            onMessageRead={refreshStats}/>
                    </TabPane>
                    )}
                </Tabs>
            </Drawer>
        </>
    );
}