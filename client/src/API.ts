import axios, { AxiosInstance } from 'axios';
import { ImageData } from './dto/ImageData'
import { UploadImageData } from './dto/UploadImageData'

export default class API {
    readonly client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10 * 1000, // 10sec
          });
    }

    async isSignin(): Promise<boolean> {
        const response = await this.client.get<{ is_signin: boolean }>('/is_signin');
        return response.data.is_signin;
    }

    async signout() {
        await this.client.delete('/signout')
    }

    async deleteImage(imageId: string) {
        await this.client.delete(`/images/${imageId}`);
    }

    async uploadImage(collectionId: string, form: FormData) {
        const _ = await this.client.post<UploadImageData>('/images', form, {
            params: {
                collection_id: collectionId
            },
            headers: {
                'content-type': 'multipart/form-data',
            }
        });
    }

    async imageList(): Promise<Array<ImageData>> {
        const response = await this.client.get<Array<ImageData>>('/images');
        return response.data;
    }
}