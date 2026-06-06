import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./database/prisma.module";
import { GlobalExceptionFilter } from "./common/filters/http-exception.filter";
import { StoriesModule } from "./stories/stories.module";
import { CoursesModule } from "./courses/courses.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "public", "cdn"),
      serveRoot: "/cdn",
    }),
    PrismaModule,
    StoriesModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}

