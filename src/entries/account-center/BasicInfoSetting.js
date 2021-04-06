import React, {useEffect} from 'react';
import {Button, Input} from 'antd';
import {useAsyncTask, useModalTrigger} from "../../hooks";
import {Status} from "../../components";
import * as api from "../../api";
import  "./BasicInfoSetting.less";
import EmailSetting from "./EmailSetting";
import PasswordSetting from "./PasswordSetting";

export default function BasicInfoSetting() {
    const loadTask = useAsyncTask(api.getUserDetail);
    useEffect(loadTask.execute,[]);
    const emailSettingTrigger = useModalTrigger(loadTask.execute);
    const mobileSettingTrigger = useModalTrigger(loadTask.execute);
    const passwordSettingTrigger = useModalTrigger();

    const user = loadTask.data || {
        loginName: "无",
        mobile: "无",
        email: "无",
    };
    return (
        <Status task={loadTask}>
        <div className="account-setting">
            <div className="account-setting-item">
                <div className="left">
                </div>
                <div className="middle">
                    <div className="middle-hd">
                        账户ID
                    </div>
                    <div className="middle-bd">
                        {user.id}
                    </div>
                </div>
                <div className="right">
                </div>
            </div>
            <div className="account-setting-item">
                <div className="left">
                </div>
                <div className="middle">
                    <div className="middle-hd">
                        账户登录名
                    </div>
                    <div className="middle-bd">
                        {user.loginName}
                    </div>
                </div>
                <div className="right">
                </div>
            </div>
            <div className="account-setting-item">
                <div className="left">
                </div>
                <div className="middle">
                    <div className="middle-hd">
                        账户密码
                    </div>
                    <div className="middle-bd">
                        ***
                    </div>
                </div>
                <div className="right">
                    <Button type="primary" onClick={passwordSettingTrigger.onOpen}>修改密码</Button>
                    {passwordSettingTrigger.renderModal(PasswordSetting)}
                </div>
            </div>
            <div className="account-setting-item">
                <div className="left">
                </div>
                <div className="middle">
                    <div className="middle-hd">
                        账户邮箱
                    </div>
                    <div className="middle-bd">
                        {user.email}
                    </div>
                </div>
                <div className="right">
                    <Button type="primary" onClick={emailSettingTrigger.onOpen}>修改邮箱</Button>
                    {emailSettingTrigger.renderModal(EmailSetting, {currentEmail: user.email})}
                </div>
            </div>
            <div className="account-setting-item">
                <div className="left">
                </div>
                <div className="middle">
                    <div className="middle-hd">
                        账户手机
                    </div>
                    <div className="middle-bd">
                        {user.mobile}
                    </div>
                </div>
                <div className="right">
                    <Button type="primary" disabled>修改手机</Button>
                </div>
            </div>
        </div>
        </Status>
    );
}