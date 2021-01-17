use reqwest::blocking::Client;
use reqwest::StatusCode;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct GyazoImagePath {
    pub image_id: String,
}

#[derive(Deserialize)]
pub struct GyazoUploadImageRequestQuery {
    pub collection_id: String,
}

pub struct Image {
    pub token: String,
}

impl Image {
    pub fn get(&self, id: &String) -> Option<String> {
        let result = Client::new()
            .get(&format!("https://api.gyazo.com/api/images/{}", id))
            .header(
                reqwest::header::AUTHORIZATION,
                format!("Bearer {}", self.token),
            )
            .send();
        let resp = result.unwrap();
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
        return None;
    }

    pub fn list(&self) -> Option<String> {
        let result = Client::new()
            .get("https://api.gyazo.com/api/images")
            .header(
                reqwest::header::AUTHORIZATION,
                format!("Bearer {}", self.token),
            )
            .send();
        let resp = result.unwrap();
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
        return None;
    }

    pub fn delete(&self, id: &String) -> Option<String> {
        let result = Client::new()
            .delete(&format!("https://api.gyazo.com/api/images/{}", id))
            .header(
                reqwest::header::AUTHORIZATION,
                format!("Bearer {}", self.token),
            )
            .send();
        let resp = result.unwrap();
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
        return None;
    }
}
