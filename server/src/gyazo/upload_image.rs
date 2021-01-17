use actix_multipart::Multipart;
use actix_web::web;
use futures::{StreamExt, TryStreamExt};
use reqwest::blocking::Client;
use reqwest::StatusCode;

use reqwest::blocking::multipart::Form;
use std::fs;
use std::io::Write;
use uuid::Uuid;

pub struct UploadImage {
    pub token: String,
}

impl UploadImage {
    pub async fn post(&self, collection_id: String, mut payload: Multipart) -> Option<String> {
        while let Ok(Some(mut field)) = payload.try_next().await {
            let content_type = field.content_disposition().unwrap();
            let filename = content_type.get_filename().unwrap();
            let filepath = format!(
                "./tmp/{}-{}",
                Uuid::new_v4().to_simple().to_string(),
                sanitize_filename::sanitize(&filename)
            );
            let imagedata = format!("{}", filepath);
            let del_filepath = format!("{}", filepath);
            let mut f = web::block(|| std::fs::File::create(filepath))
                .await
                .unwrap();
            while let Some(chunk) = field.next().await {
                let data = chunk.unwrap();
                f = web::block(move || f.write_all(&data).map(|_| f))
                    .await
                    .unwrap();
            }
            let access_token = self.token.to_string();
            let collection_id = format!("{}", collection_id);
            let form = Form::new()
                .text("title", format!("{}", filename))
                .text("collection_id", collection_id)
                .text("access_token", access_token)
                .file("imagedata", imagedata)
                .unwrap();
            let result = Client::new()
                .post("https://upload.gyazo.com/api/upload")
                .multipart(form)
                .send();
            fs::remove_file(del_filepath).unwrap_or_else(|why| {
                println!("remove_tmp_file: {:?}", why.kind());
            });
            match result {
                Ok(resp) => {
                    match resp.status() {
                        StatusCode::OK => {
                            return Some(resp.text().unwrap());
                        }
                        StatusCode::PAYLOAD_TOO_LARGE => {
                            println!("Request payload is too large!");
                        }
                        s => {
                            println!(
                                "Received response status: {:?}, {}",
                                s,
                                resp.text().unwrap()
                            );
                        }
                    };
                }
                Err(e) => println!("error: {}", e),
            }
            break;
        }

        return None;
    }
}
