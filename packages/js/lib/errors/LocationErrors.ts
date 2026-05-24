export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocationError";
  }
}

export class LocationNotFoundError extends LocationError {
  constructor(locationType: string, identifier: string) {
    super(`${locationType} with identifier "${identifier}" not found`);
    this.name = "LocationNotFoundError";
  }
}

export class InvalidLocationCodeError extends LocationError {
  constructor(code: string) {
    super(`Invalid location code format: ${code}`);
    this.name = "InvalidLocationCodeError";
  }
}

export class SearchError extends LocationError {
  constructor(message: string) {
    super(`Search error: ${message}`);
    this.name = "SearchError";
  }
}

export class DataValidationError extends LocationError {
  constructor(message: string) {
    super(`Data validation error: ${message}`);
    this.name = "DataValidationError";
  }
}

export class ConfigurationError extends LocationError {
  constructor(message: string) {
    super(`Configuration error: ${message}`);
    this.name = "ConfigurationError";
  }
}
