import './Home.css';

import { useEffect, useState } from 'react';
import { Header, Container, Loader, Input, Icon, Button, Dimmer } from 'semantic-ui-react'

import { isRightCollectionId } from '../Common';
import { ImageData } from '../dto/ImageData';

import API from '../API';
import ImageUploadArea from '../components/ImageUploadArea';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import ImageList from '../components/ImageList';
import ShowImageDialog from '../components/ShowImageDialog';
import DeleteImageDialog from '../components/DeleteImageDialog';

import { useRecoilValue } from 'recoil'
import { signinState } from '../atom/SigninState'

function Home() {
    const signin = useRecoilValue(signinState);

    const [isLoadingImageList, setIsLoadingImageList] = useState(false);
    const [showImageId, setShowImageId] = useState('');
    const [deleteImageId, setDeleteImageId] = useState('');
    const [imageList, setImageList] = useState(Array<ImageData>())
    const [collectionId, setCollectionId] = useState('')

    const onSelectedFile = async (files: Array<File>) => {
        if (files.length > 0) {
            if (isRightCollectionId(collectionId)) {
                const apiClient = new API();
                for (const file of files) {
                    const form = new FormData();
                    form.append('file', file);

                    try {
                        const _ = await apiClient.uploadImage(collectionId, form);
                        await reloadImageList();
                    } catch (e) {
                        console.error("error", e);
                    }
                }
            } else {
                alert("コレクション ID には何も指定しないか、半角英数 32 文字を入力してください。\nコレクション ID の詳細は画面右上の使い方からご確認いただけます。")
            }
        }
    }

    useEffect(() => {
        if (signin) reloadImageList();
    }, [signin]);

    const reloadImageList = async () => {
        setIsLoadingImageList(true);
        const imageList = await new API().imageList();
        setImageList(imageList);
        setIsLoadingImageList(false);
    }

    const deleteImage = async (imageId: string) => {
        const _ = await new API().deleteImage(imageId);
        await reloadImageList();
    }

    const onChangeCollectionId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value as string;
        setCollectionId(text);
    }

    const deleteImageData = imageList.find(e => e.image_id === deleteImageId);
    const showImageData = imageList.find(e => e.image_id === showImageId);

    return (
        <div id="container">
            <Dimmer active={isLoadingImageList}>
                <Loader>最新の画像をロード中...</Loader>
            </Dimmer>
            <PageHeader />

            <div style={{ textAlign: "center" }} className="ui_parts horizontal_area">
                <Input id="input_collection_id" error={!isRightCollectionId(collectionId)} icon='images outline' iconPosition='left' placeholder='(任意) コレクション ID を入力してください (半角英数 32 文字)' onChange={e => onChangeCollectionId(e)} />
            </div>

            <Container text fluid>
                <ImageUploadArea onSelectedFiles={onSelectedFile} />
            </Container>

            <div className="horizontal_area">
                <Header as='h3' id="recent_image_label">最新の画像 20 件&nbsp;<Icon name="history" /></Header>
                <Button id="refresh_button" onClick={() => reloadImageList()}>
                    <Icon name='refresh' /> 画像の再読み込み
                </Button>
            </div>

            <ImageList imageList={imageList}
                onClickThumb={imageId => setShowImageId(imageId)}
                onClickDelete={imageId => setDeleteImageId(imageId)}
                onClickCopyMarkdown={markdown => navigator.clipboard.writeText(markdown)} />

            <ShowImageDialog isOpen={showImageId.length > 0}
                imageData={showImageData}
                onClose={() => setShowImageId('')} />
            <DeleteImageDialog isOpen={deleteImageId.length > 0}
                imageData={deleteImageData}
                onClickCancel={() => setDeleteImageId('')}
                onClickDelete={() => {
                    deleteImage(deleteImageData!.image_id);
                    setDeleteImageId('');
                }} />

            <PageFooter />
        </div >
    );
}

export default Home;
