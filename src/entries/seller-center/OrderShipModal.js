import React from "react";
import {Form, Input, Modal, Select} from "antd";
import * as api from "../../api";
import {Status} from "../../components";
import {useAsyncTask} from "../../hooks";

export default function OrderShipModal({id, onOk, ...restProps}) {
    const [form] = Form.useForm();
    const {status, error, execute} = useAsyncTask(api.shipOrder, {onSuccess: onOk});
    return (
        <Modal
            {...restProps}
            onOk={()=>form.submit()}
            title="发货"
        >
            <Form
                form={form}
                onFinish={execute}
                initialValues={{id}}
                labelAlign="left"
            >
                <Form.Item name="id" hidden>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item name="logisticsCompany" label="物流公司" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="选择快递"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Select.Option value="圆通快递">圆通快递</Select.Option>
                        <Select.Option value="中通快递">中通快递</Select.Option>
                        <Select.Option value="申通快递">申通快递</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="trackingNumber" label="物流单号" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
            </Form>
            <Status status={status} errMsg={error && error.errMsg}/>
        </Modal>
    );
}