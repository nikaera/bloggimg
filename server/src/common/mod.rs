use actix_web::HttpRequest;
use std::env;

pub fn get_access_token(req: HttpRequest) -> String {
    let cookie_header = req.headers().get("cookie");

    if let Some(v) = cookie_header {
        let cookie: Vec<&str> = v.to_str().unwrap().split(";").collect();

        let map: Vec<&str> = cookie
            .into_iter()
            .filter(|each| {
                let body: Vec<&str> = each.trim().split("=").collect();

                body[0] == "access_token"
            })
            .collect();

        if map.len() > 0 {
            let mut iter = map[0].splitn(2, '=');
            let _ = iter.next().unwrap();
            let value = iter.next().unwrap();

            return value.to_string();
        }
    }
    "".to_string()
}

pub fn get_env(key: &str) -> String {
    match env::var(key) {
        Ok(value) => return value,
        Err(e) => println!("ENV: ERR {:?}", e),
    }

    return "".to_string();
}

pub fn is_release_build() -> bool {
    return get_env("RELEASE") == "1";
}
