import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOperationOptions,
} from '@nestjs/swagger';
import { ApiException } from '../api-exception.vm';

export const ApiErrors = () => {
  function decorator(
    target: any,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    ApiNotFoundResponse({ type: ApiException, description: 'Not found' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBadRequestResponse({ type: ApiException, description: 'Bad Request' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiInternalServerErrorResponse({
      type: ApiException,
      description: 'Internal Server Error',
    })(target, propertyKey, descriptor);
  }

  return decorator as any;
};

export const ApiOperationId = (options?: ApiOperationOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const controllerName = target.constructor.name;
    const operationId = `${controllerName.substr(
      0,
      controllerName.indexOf('Controller'),
    )}_${propertyKey}`;

    ApiOperation({
      ...options,
      operationId,
    })(target, propertyKey, descriptor);
  };
};
