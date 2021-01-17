use actix_web::cookie::{Cookie, SameSite};
use actix_web::http::header;
use actix_web::{delete, get, web, Error, HttpRequest, HttpResponse};
use serde::Serialize;
use tera;
use tera::Tera;

use time::OffsetDateTime;

use crate::common;
use crate::gyazo::auth;

#[derive(Serialize)]
struct IsSigninResponseBody {
    is_signin: bool,
}

#[get("/is_signin")]
async fn is_signin(req: HttpRequest) -> Result<HttpResponse, Error> {
    let access_token = common::get_access_token(req);
    let response_body = IsSigninResponseBody {
        is_signin: !access_token.is_empty(),
    };
    let response_body_string = serde_json::to_string(&response_body).unwrap();
    return Ok(HttpResponse::Ok().body(response_body_string));
}

#[delete("/signout")]
async fn signout() -> Result<HttpResponse, Error> {
    let cookie: Cookie = Cookie::build("access_token", "deleted")
        .path("/")
        .secure(common::is_release_build())
        .http_only(true)
        .expires(OffsetDateTime::now_utc())
        .same_site(SameSite::Strict)
        .finish();
    return Ok(HttpResponse::Ok()
        .header("Set-Cookie", cookie.to_string())
        .body(""));
}

#[get("/signin")]
async fn signin(
    req: HttpRequest,
    query: web::Query<auth::GyazoTokenRequestQuery>,
    tmpl: web::Data<Tera>,
) -> Result<HttpResponse, Error> {
    let access_token = common::get_access_token(req);
    if !access_token.is_empty() {
        return Ok(HttpResponse::TemporaryRedirect()
            .header(header::LOCATION, "/")
            .body(""));
    }

    let code = &query.code;
    if code.to_string().is_empty() {
        return Ok(HttpResponse::BadRequest().body(""));
    }

    let request_body = auth::GyazoTokenRequestBody {
        client_id: common::get_env("CLIENT_ID"),
        client_secret: common::get_env("CLIENT_SECRET"),
        redirect_uri: common::get_env("REDIRECT_URI"),
        grant_type: "authorization_code".to_string(),
        code: code.to_string(),
    };

    let response = auth::get_token(request_body);
    if let Some(json) = response {
        let cookie: Cookie = Cookie::build("access_token", json.access_token)
            .path("/")
            .secure(common::is_release_build())
            .http_only(true)
            .same_site(SameSite::Strict)
            .finish();
        let ctx = tera::Context::new();
        let view = tmpl
            .render("get_token.html.tera", &ctx)
            .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

        return Ok(HttpResponse::Ok()
            .content_type("text/html")
            .header("Set-Cookie", cookie.to_string())
            .body(view));
    }

    return Ok(HttpResponse::InternalServerError().body(""));
}
