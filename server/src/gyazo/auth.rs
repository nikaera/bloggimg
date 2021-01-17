use reqwest::blocking::Client;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct GyazoTokenRequestQuery {
    #[serde(default)]
    pub code: String,
}

#[derive(Serialize)]
pub struct GyazoTokenRequestBody {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
    pub grant_type: String,
    pub code: String,
}

#[derive(Deserialize)]
pub struct GyazoTokenResponseBody {
    pub access_token: String,
}

pub fn get_token(req: GyazoTokenRequestBody) -> Option<GyazoTokenResponseBody> {
    let request_body_string = serde_json::to_string(&req).unwrap();

    let result = Client::new()
        .post("https://api.gyazo.com/oauth/token")
        .header(reqwest::header::CONTENT_TYPE, "application/json")
        .body(request_body_string)
        .send();
    let resp = result.unwrap();
    match resp.status() {
        StatusCode::OK => {
            return Some(resp.json::<GyazoTokenResponseBody>().unwrap());
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
