export interface ImageData {
    image_id: string,
    permalink_url: string,
    thumb_url: string,
    type: string
    created_at: string,
    metadata: {
        app: string,
        title: string,
        url: string,
        desc: string
    },
    ocr: {
        locale: string,
        description: string
    }
}