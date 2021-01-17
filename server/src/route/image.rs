use actix_multipart::Multipart;
use actix_web::{delete, get, post, web, HttpRequest, HttpResponse, Responder};

use crate::gyazo::image;
use crate::gyazo::upload_image;

use crate::route::cookie;

#[get("/images/{image_id}")]
async fn get(req: HttpRequest, info: web::Path<image::GyazoImagePath>) -> impl Responder {
    let access_token = cookie::get_access_token(req);
    format!("Got access_token = '{}'", &access_token);
    let gyazo_image_client = image::Image {
        token: access_token,
    };

    let response = gyazo_image_client.get(&info.image_id);
    if let Some(json) = response {
        return HttpResponse::Ok().body(json);
    }
    return HttpResponse::InternalServerError().body("");
}

#[delete("/images/{image_id}")]
async fn delete(req: HttpRequest, info: web::Path<image::GyazoImagePath>) -> impl Responder {
    let access_token = cookie::get_access_token(req);
    format!("Got access_token = '{}'", &access_token);
    let gyazo_image_client = image::Image {
        token: access_token,
    };

    let response = gyazo_image_client.delete(&info.image_id);
    if let Some(json) = response {
        return HttpResponse::Ok().body(json);
    }
    return HttpResponse::InternalServerError().body("");
}

#[get("/images")]
async fn list(req: HttpRequest) -> impl Responder {
    let access_token = cookie::get_access_token(req);
    format!("Got access_token = '{}'", &access_token);
    let gyazo_image_client = image::Image {
        token: access_token,
    };

    let response = gyazo_image_client.list();
    if let Some(json) = response {
        return HttpResponse::Ok().body(json);
    }
    return HttpResponse::InternalServerError().body("");
}

#[post("/images")]
async fn post(
    req: HttpRequest,
    query: web::Query<image::GyazoUploadImageRequestQuery>,
    payload: Multipart,
) -> impl Responder {
    let access_token = cookie::get_access_token(req);
    format!("Got access_token = '{}'", &access_token);
    let gyazo_upload_image_client = upload_image::UploadImage {
        token: access_token,
    };

    let response = gyazo_upload_image_client.post(query.collection_id.to_string(), payload);
    if let Some(json) = response.await {
        return HttpResponse::Ok().body(json);
    }
    return HttpResponse::InternalServerError().body("");
}
