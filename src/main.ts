import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CatchEverythingFilter } from './common/filters/catch_everything_filter';
import { ResponseService } from './response/response.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const responseService = app.get(ResponseService);
  app.useGlobalFilters(new CatchEverythingFilter(responseService));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error: ValidationError) => {
          const firstConstraintKey = error.constraints
            ? Object.keys(error.constraints)[0]
            : null;
          const message =
            firstConstraintKey && error.constraints
              ? error.constraints[firstConstraintKey]
              : 'Invalid value';

          return {
            property: error.property,
            message,
          };
        });

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors, // Send structured errors
        });
      },
      stopAtFirstError: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
