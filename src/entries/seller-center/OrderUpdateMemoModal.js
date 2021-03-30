import React from "react";
import {Form, Input, Modal, Select} from "antd";
import * as api from "../../api";
import {Status} from "../../components";
import {useAsyncTask} from "../../hooks";

export default function OrderUpdateMemoModal({id, memo, onOk, ...restProps}) {
    const [form] = Form.useForm();
    const {status, error, execute} = useAsyncTask(api.updateSellerMemo, {onSuccess: onOk});
    return (
        <Modal
            {...restProps}
            onOk={()=>form.submit()}
            title="更新备注"
        >
            <Form
                form={form}
                onFinish={execute}
                initialValues={{id, memo}}
                labelAlign="left"
            >
                <Form.Item name="id" hidden>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item name="memo" label="备注" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
}