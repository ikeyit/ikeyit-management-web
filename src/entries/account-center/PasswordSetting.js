import React from 'react';
import './PasswordSetting.less';
import {Button, Form, Input, Modal, Steps} from "antd";
import {useAsyncTask} from "../../hooks";
import {Status} from "../../components";
import * as api from "../../api";
const {useForm} = Form;

export default function PasswordSetting({...props}) {
    const saveTask = useAsyncTask(api.updatePassword, {onSuccess: props.onOk});
    const [form] = useForm();
    const onFinish = values => {
        saveTask.execute(values);
    };

    return (
        <Modal
            onOk={form.submit}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title={"修改密码"}
            width={800}
            confirmLoading={saveTask.status === "loading"}
        >
        <Form className="password-setting"
              onFinish={onFinish}
              form={form}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
        >
            <Form.Item label="当前密码" name="oldPassword" rules={[{ required: true}]}>
                <Input.Password />
            </Form.Item>
            <Form.Item label="新密码" name="newPassword" rules={[{ required: true}]}>
                <Input.Password />
            </Form.Item>
            <Form.Item label="确认新密码"
               name="confirmPassword"
               rules={[
                   {
                       required: true,
                       message: '请确认新密码',
                   },
                   ({ getFieldValue }) => ({
                       validator(_, value) {
                           if (!value || getFieldValue('newPassword') === value) {
                               return Promise.resolve();
                           }

                           return Promise.reject(new Error('两次密码不一致'));
                       },
                   }),
               ]}
            >
                <Input.Password />
            </Form.Item>
            <Status task={saveTask}>
            </Status>
        </Form>
        </Modal>
    );
}