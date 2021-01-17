import { Header, Icon, Image, Button } from 'semantic-ui-react'
import { useEffect, useState } from 'react';

import API from '../API';

import { useRecoilState } from 'recoil'
import { signinState } from '../atom/SigninState'

function PageHeader() {
    const apiClient = new API();
    const [isSignin, setIsSignin] = useRecoilState(signinState);

    useEffect(() => {
        const asyncFunc = async () => {
            const isSignin = await apiClient.isSignin();
            setIsSignin(isSignin);
        };
        asyncFunc();
    }, [isSignin]);

    return <div className="horizontal_area">
        <Header as='h1'>
            <Icon name='images' />
            <Header.Content>
                Bloggimg
                <Header.Subheader>
                    ブログを書く用途に特化した Gyazo を用いた画像管理ツール
                </Header.Subheader>
            </Header.Content>
        </Header>
        <div className="horizontal_area">
            <Button size="small" style={{ marginBottom: "1em" }} onClick={e => window.open(
                "https://nikaera.com/archives/bloggimg-first-release",
                "bloggimg-usage"
            )}><Icon size="big" name="book" />使い方</Button>
            <Button id="login_button" size="small" primary onClick={async e => {
                if (isSignin) {
                    await apiClient.signout();
                    setIsSignin(false);
                } else {
                    const authUrl = process.env.REACT_APP_GYAZO_AUTH_URL;
                    if (authUrl) window.location.href = authUrl;
                }
            }}>
                <Image className="image" src="/gyazo-icon.png" avatar verticalAlign='middle' />
                <span className="title">{isSignin ? "ログアウト" : "ログイン"}</span>
            </Button>
        </div>
    </div>;
}

export default PageHeader;