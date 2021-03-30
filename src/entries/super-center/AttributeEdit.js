import React, {useEffect, useState} from 'react';
import * as api from '../../api';
import {Form, Input, Select, Switch, Button, Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {Reorder, Status} from '../../components';
import {ATTRIBUTE_TYPE} from "./constant";
import "./AttributeEdit.less";
import {useAsyncTask, usePlainSearchParams} from "../../hooks";

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

const loadData = id => id ? api.getAttribute({id}) : Promise.resolve({});

export default function AttributeEdit() {
    const [{id}] = usePlainSearchParams();
    const history = useHistory();
    const [newValue, setNewValue] = useState(null);
    const [form] = Form.useForm();
    const loadTask = useAsyncTask(loadData, {
        onSuccess(data) {
            form.setFieldsValue(data);
        }
    });
    const saveTask = useAsyncTask(id ? api.updateAttribute : api.createAttribute, {
        onSuccess() {
            history.push("attributes");
        }
    });

    useEffect(() => {
        loadTask.execute(id);
    },[id]);

    function onValueAdd(add) {
        //TODO 数据验证
        if (!newValue)
            return;
        add({val: newValue});
        setNewValue(null);
    }

    function onValueDelete(form, field, remove) {
        const values = form.getFieldValue("values");
        const value = values[field.name];
        if (value.valueId) {
            value.deleted = true;
            form.setFieldsValue({values});
        } else
            remove(field.name);
    }


    return (
        <Status status={loadTask.status} errMsg={loadTask.error && loadTask.error.errMsg}>
            <Form
                {...formItemLayout}
                form={form}
                onFinish={saveTask.execute}
                labelAlign="left"
            >

                <h3>{id?"新建参数":"编辑参数"}</h3>
                <Form.Item name="attributeId" hidden>
                    <Input type="hidden"/>
                </Form.Item>

                <Form.Item name="name" label="名称" rules={[{ required: true, message: "名称不能为空"}]}>
                    <Input/>
                </Form.Item>
                {id ?
                    <Form.Item label="类型" shouldUpdate>
                        {(form) =>
                            <span>{ATTRIBUTE_TYPE[form.getFieldValue("attributeType")]}</span>
                        }
                    </Form.Item>
                    :
                    <Form.Item name="attributeType" label="类型" rules={[{ required: true, message: "类型为必选项" }]}>
                        <Select>
                            <Select.Option value={ATTRIBUTE_TYPE.BASIC}>{ATTRIBUTE_TYPE[ATTRIBUTE_TYPE.BASIC]}</Select.Option>
                            {/*<Select.Option value={1}></Select.Option>*/}
                            <Select.Option value={ATTRIBUTE_TYPE.KEY}>{ATTRIBUTE_TYPE[ATTRIBUTE_TYPE.KEY]}</Select.Option>
                        </Select>
                    </Form.Item>
                }


                <Form.Item name="required" valuePropName="checked" label="是否为必选项">
                    <Switch/>
                </Form.Item>

                <Form.Item label="参数值" shouldUpdate={(prevValues, curValues) => prevValues.values !== curValues.values}>
                    {(form) =>
                        <Form.List name="values">
                            {(fields, {add, remove, move}) => (
                                <>
                                    {fields.map(field => form.getFieldValue("values")[field.name].deleted ?
                                        // (
                                        // <Form.Item  {...field} name={[field.name, 'deleted']} >
                                        //     <Input/>
                                        // </Form.Item>
                                        // )
                                        null
                                     : (
                                        <Reorder key={field.key}
                                                 index={field.name}
                                                 type="AttributeValue"
                                                 onMove={move}
                                                 className="attribute-value-input">
                                                <Form.Item noStyle {...field} name={[field.name, 'val']}>
                                                    <Input style={{flex: "1 1 auto"}}/>
                                                </Form.Item>
                                                <Popconfirm
                                                    placement="topRight"
                                                    title="删除后只影响后续的商品，以前的商品不受影响。确认删除该参数值?"
                                                    onConfirm={() => onValueDelete(form, field, remove)}>
                                                    <Button shape="circle" type="link" icon={<DeleteOutlined/>}/>
                                                </Popconfirm>
                                        </Reorder>
                                    ))}
                                    <div style={{display: "inline-block", width: 200, margin: "0  10px 10px 0"}}>
                                        <div style={{display: "flex", width: 200, margin: "0  10px 10px 0"}}>
                                            <Input placeholder="输入新的值" value={newValue}
                                                   onChange={e => setNewValue(e.target.value)} style={{flex: "1 1 auto"}}/>
                                            <Button type="primary" onClick={() => onValueAdd(add)}
                                                    style={{flex: "0 0 auto"}}>添加</Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form.List>
                    }
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