import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined, IdcardTwoTone, TeamOutlined } from '@ant-design/icons';
import { Alert, Checkbox, Card, Popover, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { StateType, UserAccount } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginFrom from './components/Login';

import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting, dispatch } = props;
  const { status, type: loginType, simAccountList = [] } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'login/simAccounts',
      });
    }
  })
  const handleSubmit = (values: LoginParamsType) => {
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };
  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误" />
          )}
          <Popover placement="topLeft" content={simAccountList.length > 0 && (
            <Card title="测试账号" bordered={false} style={{ width: 300 }}>
              <table>
                <thead>
                  <tr>
                    <th>账户</th>
                    <th>密码</th>
                  </tr>
                </thead>
                <tbody>
                  {simAccountList.map((account: UserAccount) => {
                    return (<tr key={account.username}><td>{account.username}</td><td>{account.password}</td></tr>)
                  })}
                </tbody>
              </table>
            </Card>

          )} title="SimAccounts">
            <Button icon={<TeamOutlined />}>测试账户</Button>
          </Popover>

          <UserName
            name="userName"
            placeholder="用户名:"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码:"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Tab key="mobile" tab="手机号登录">
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
        <Submit loading={submitting}>登录</Submit>
        <div className={styles.other}>
          其他登录方式
          <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} />
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
