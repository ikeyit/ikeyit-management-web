import React,{useEffect} from 'react'
import * as api from '../../api';
import {Button, Form, Input, message} from "antd";
import {Status} from "../../components";
import {useAsyncTask} from "../../hooks";
const {useForm} = Form;


const formItemLayout = {
    labelCol: {
        span:4,
    },
    wrapperCol: {
        span:20,
    },
};
const formTailLayout = {
    wrapperCol: {
        offset: 4,
        span: 20
    },
};

export default function ShopBasicInfo() {
    const [form] = useForm();
    const loadTask = useAsyncTask(api.getShopBasicInfo, {
        onSuccess(data) {
            form.setFieldsValue(data);
        }
    });
    useEffect(loadTask.execute, []);
    const saveTask = useAsyncTask(api.updateShopBasicInfo, {
        onSuccess() {
            message.info("保存成功");
        }
    });
    return (
        <Status status={loadTask.status} errMsg={loadTask.error && loadTask.error.errMsg}>
            <Form
                {...formItemLayout}
                form={form}
                onFinish={saveTask.execute}
                labelAlign="left"
            >
                <Form.Item name="name" label="名称" rules={[{ required: true, message: "名称不能为空"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="description" label="描述" rules={[{ required: true, message: "描述不能为空"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item {...formTailLayout}>
                    <Button type="primary" htmlType="submit" loading={saveTask.status === "loading"}>
                        提交
                    </Button>
                    <Status status={saveTask.status} errMsg={saveTask.error && saveTask.error.errMsg}/>
                </Form.Item>
            </Form>
        </Status>
    );
}