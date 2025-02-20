import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const result = errors.map((error: ValidationError) => {
          // Ensure `constraints` exists and has at least one key
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

        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
