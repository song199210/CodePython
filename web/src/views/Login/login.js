import React from "react";
import md5 from "js-md5";
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import "./login.scss";
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {form,history}=this.props;
    form.validateFields((err, values) => {
      values.pwd=md5(values.pwd);
      if (!err) {
        window.$common.httpAjax("login","POST",values).then((res)=>{
                if(res.flag === "success"){
                  message.success(res.msg);
                  window.localStorage.setItem("userId",res.data.userid);
                  history.push("/admin");
                }else{
                  message.error(res.msg);
                }
              }).catch((err)=>{
                console.error(err);
              });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="loginBox">
        <div className="container">
          <h3 className="loginTitle">欢迎登录</h3>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('uname', {
                rules: [{ required: true, message: '请输入账号!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" autoComplete="uname" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('pwd', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" autoComplete="pwd" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
              <div>
                <Button style={{"width":"100%"}} type="primary" htmlType="submit" className="login-form-button">登录</Button>
              </div>
            </FormItem>
            <div>
              <a className="login-form-forgot" onClick={()=>{this.props.history.push("setpwd")}}>忘记密码</a> Or <a onClick={()=>{this.props.history.push("regin")}}>去注册!</a>
            </div>          
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm