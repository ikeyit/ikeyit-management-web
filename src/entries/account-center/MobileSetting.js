import React,{useState} from 'react';
import {Steps, Form, Input, Button} from 'antd';
import "./MobileSetting.less";
const { Step } = Steps;

function Step1() {
    return (
        <Form className="mobile-setting-form"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
        >
            <Form.Item label="当前手机号" name="mobile">
                <Input/>
            </Form.Item>
            <Form.Item label="验证码" name="code">
                <div className="mobile-setting-code">
                    <Input/>
                    <Button>发送验证码</Button>
                </div>
            </Form.Item>
            <Form.Item wrapperCol = {{offset: 4}}>
                <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
    );
}

function Step2() {
    return (
        <Form className="mobile-setting-form"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
        >
            <Form.Item label="新手机号" name="mobile">
                <Input/>
            </Form.Item>
            <Form.Item label="验证码" name="code">
                <div className="mobile-setting-code">
                    <Input/>
                    <Button>发送验证码</Button>
                </div>
            </Form.Item>
            <Form.Item wrapperCol = {{offset: 4}}>
                <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
    );
}


function Step3() {
    return (
      <div>
          修改成功
      </div>
    );
}



export default function MobileSetting() {
    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: '验证原手机号',
            content: <Step1/>,
        },
        {
            title: '修改手机号',
            content:  <Step2/>,
        },
        {
            title: '修改成功',
            content:  <Step3/>,
        },
    ];

    return (
        <div className="mobile-setting">
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
        </div>
    );
}