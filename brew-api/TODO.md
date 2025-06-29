1. (X) Шари — окремі файли: dto/BrewDTO.js, services/brews.service.js, controllers/brews.controller.js, routes/brews.routes.js.
2. (X) Awilix DI — інстанс BrewsService реєструється й інжектиться у контролер. 
3. (X) In‑memory store — усі дані тримаються всередині BrewsService (без глобальних змінних). 
4. (X) Zod‑валідація + validate() middleware; помилки -> 400 з описом. 
5. (X) Swagger UI на /docs; схеми генеруються із Zod через @asteasolutions/zod-to-openapi. 
6. (X) Query‑фільтр для getAll за method та ratingMin обробляється; валідується Zod‑схемою. Самі query-параметри не обовʼязкові, якщо їх нема віддається весь список 
7. (X) Security middleware: helmet, cors, compression. 
8. (X) Rate limit: 10 POST‑ів/60с → HTTP 429. 
9. (X) Логування: morgan('dev') у dev; pino-http JSON у prod. 
10. (X) Graceful shutdown при SIGINT/SIGTERM (закрити HTTP‑сервер, container.dispose()).
11. (X) ESBuild‑bundle (npm run build) → dist/server.mjs запускається без помилок. 
12. Dockerfile multi‑stage; образ 50МБ, стартує командою docker run -p 3000:3000 brew‑api.
