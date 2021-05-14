import React, {useEffect, useState} from 'react';
import * as api from '../../api';
import {Form, message, Input, Button, InputNumber} from "antd";
import {useAsyncTask} from "../../hooks";
import {Status} from "../../components";
const {useForm} = Form;
const formItemLayout = {
    labelCol: {
        span:4,
    },
    wrapperCol: {
        span: 6,
    },
};
const formTailLayout = {
    wrapperCol: {
        offset: 4,
        span: 6
    },
};
export default function ProductScoreEdit() {
    const [form] = useForm();
    const saveTask = useAsyncTask(api.updateProductScore , {
        onSuccess() {
            message.success("更新成功");
            form.resetFields();
        }
    });

    return (
        <Form
            form={form}
            onFinish={saveTask.execute}
            labelAlign="left"
            {...formItemLayout}
        >
            <Form.Item name="productId" label="产品ID" rules={[{required: true, message: "产品ID不能为空"}]}>
                <Input />
            </Form.Item>
            <Form.Item name="sales" label="增加销量" rules={[{ required: true, message: "数量不能为空"}]}>
                <InputNumber min={1} max={10000} />
            </Form.Item>
            <Form.Item {...formTailLayout}>
                <Button type="primary" htmlType="submit" loading={saveTask.status === "loading"}>
                    提交
                </Button>
                <Status task={saveTask}/>
            </Form.Item>
        </Form>
    );
}