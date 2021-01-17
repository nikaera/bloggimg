use dotenv::dotenv;

// mod gyazo の記述を route の前に持ってくる必要があるよ
// route で mod gyazo のモジュールを利用するならね
mod common;
mod gyazo;
mod route;

use route::auth as auth_route;
use route::image as image_route;

use tera::Tera;

use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    HttpServer::new(|| {
        let templates = Tera::new("templates/**/*").unwrap();
        let index = actix_files::Files::new("/", "./build").index_file("index.html");
        App::new()
            .data(templates)
            .service(auth_route::is_signin)
            .service(auth_route::signin)
            .service(auth_route::signout)
            .service(image_route::get)
            .service(image_route::delete)
            .service(image_route::list)
            .service(image_route::post)
            .service(index)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
