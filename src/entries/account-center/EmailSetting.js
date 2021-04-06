import React,{useState,useEffect} from 'react';
import {Steps, Form, Input, Button, Modal, message, Statistic} from 'antd';
import * as api from '../../api';
import "./EmailSetting.less";
const { Step } = Steps;
const {useForm} = Form;
const {Countdown} = Statistic;

//设置账户邮箱
export default function EmailSetting({currentEmail, ...props}) {
    const [form1] = useForm();
    const [form2] = useForm();
    const [current, setCurrent] = useState(0);
    const [countdown1, setCountdown1] = useState(false);
    const [countdown2, setCountdown2] = useState(false);

    const onSendCode1 = ()=> {
        api.sendUpdateEmailVerificationOld()
            .then(res => setCountdown1(true))
            .catch(error => message.error(error.errMsg));
    };

    const onSendCode2 = ()=> {
        api.sendEmailVerification({email: form2.getFieldValue("email")})
            .then(res => setCountdown2(true))
            .catch(error => message.error(error.errMsg));
    };

    const onFinish1 = (values)=> {
        api.validateUpdateEmailVerificationOld(values)
            .then(res => setCurrent(1))
            .catch(error => message.error(error.errMsg));
    };

    const onFinish2 = (values)=> {
        api.updateEmail(values)
            .then(res => setCurrent(2))
            .catch(error => message.error(error.errMsg));
    };

    const onOk = ()=> {
        if (current === 0) {
            form1.submit();
        } else if (current === 1) {
            form2.submit();
        } else {
            props.onOk();
        }
    };

    return (
        <Modal
            onOk={onOk}
            afterClose={props.afterClose}
            onCancel={props.onCancel}
            visible={props.visible}
            title={"修改邮箱"}
            width={800}
            okText={current != 2 ? " 下一步": "完成"}
            maskClosable = {false}
        >
            <div className="email-setting">
                <Steps current={current}>
                    <Step key="1" title="验证原邮箱" />
                    <Step key="2" title="修改邮箱" />
                    <Step key="3" title="修改成功" />
                </Steps>
                <div className="steps-content">
                {
                    current == 0 &&
                    <Form className="email-setting-form"
                          form={form1}
                          onFinish={onFinish1}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 14 }}
                    >
                        <Form.Item label="当前邮箱">
                            <Input disabled value={currentEmail}/>
                        </Form.Item>
                        <Form.Item label="验证码" name="code" rules={[{required:true}]}>
                            <div className="email-setting-code">
                                <Input/>
                                <Button onClick={onSendCode1} disabled={countdown1} className="countdown-btn">
                                    { countdown1 ?
                                        <Countdown value={ Date.now() + 1000 * 120} format="mm:ss" onFinish={()=>setCountdown1(false)} />
                                        :
                                        " 发送验证码"
                                    }
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                }

                {
                    current == 1 &&
                    <Form className="email-setting-form"
                          form={form2}
                          onFinish={onFinish2}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 14 }}
                    >
                        <Form.Item label="新的邮箱" name="email" rules={[{required:true}, {type: 'email'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="验证码" name="code" rules={[{required:true}]}>
                            <div className="email-setting-code">
                                <Input/>
                                <Button onClick={onSendCode2} disabled={countdown2} className="countdown-btn">
                                    { countdown2 ?
                                        <Countdown value={ Date.now() + 1000 * 120} format="mm:ss" onFinish={()=>setCountdown2(false)} />
                                        :
                                        " 发送验证码"
                                    }
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                }

                {
                    current == 2 &&
                        <div className="email-setting-done">
                            邮箱已修改成功！
                        </div>
                }

                </div>
            </div>
        </Modal>
    );
}