# Upload-only

## Features

This interface provide those features:

- Upload files on local path
- Create subpath and upload in it
- Interface customizations

## Installation instruction

<!-- prettier-ignore-start -->
!!! Important
    Require S3-Proxy 4.X to work with default templates on target bucket.
    All the other configurations like webhooks, put metadata, ... can be configured as you want.
<!-- prettier-ignore-end -->

- Download interface archive release on <a href="https://github.com/s3-proxy-interfaces/releases" target="_blank">Github releases</a>
- Open archive and extract files
- Upload files in S3 bucket (named `INTERFACE-BUCKET` for the next part)
- Configure S3-Proxy application like the following example

<!-- prettier-ignore-start -->
!!! Note
    The `INTERFACE-BUCKET` and the `FILES-BUCKET` can be the same, you can just manage the bucket prefix to differentiate targets.
<!-- prettier-ignore-end -->

```yaml
# Targets
targets:
  interface:
    mount:
      path:
        - /
    actions:
      GET:
        enabled: true
        config:
          indexDocument: index.html
    bucket:
      name: INTERFACE-BUCKET
      region: eu-west-1
      prefix:
  upload:
    mount:
      path:
        - /upload/
    actions:
      GET:
        enabled: false
      PUT:
        enabled: true
    bucket:
      name: FILES-BUCKET
      region: eu-west-1
      prefix:
```

## ExtraJS

### Purpose

ExtraJS is an object that allow the interface customization.

To do this, you can implement one or many functions showed in the following interface.

You have to edit the `extra-js.js` file at the interface root level.

### Supported interface

```typescript
declare let ExtraJS: {
  // Validation will be call in order to validate upload key on each key pressed
  // Params:
  // - uploadKey: Upload Key value from input
  // - t: function to translate a key
  // Return:
  // Error message that will be displayed. If return is an empty string,
  // result will be interpreted as no error.
  validateUploadKey(uploadKey: string, t: (key: string) => string): string;
  // GenerateEndpoint will be call in order to have the endpoint depending on upload key
  // This is called on each key pressed in upload key input.
  // Params:
  // - uploadKey: Upload Key value from input
  // Return:
  // Will return the upload endpoint.
  generateEndpoint(uploadKey: string): string;
  // GetUploadSettings will allow to get upload settings for Uppy.
  // Return:
  // Partial object that will be spread on Uppy settings.
  getUploadSettings(): object;
  // GetInitialUploadKey will be called to get the initial upload key value.
  // Return:
  // Initial upload key value.
  getInitialUploadKey(): string;
  // GetLogoConfiguration will return the logo configuration.
  // Return:
  // Will return an object with src, image alt, width and height values.
  getLogoConfiguration(): {
    src: string;
    alt: string;
    width: string;
    height: string;
  };
  // GetFooter will be called to get the footer value.
  // Return:
  // Will return a string representing the footer to display.
  getFooter(): string;
  // Initialize will be run on page startup.
  // This is done in order to load some context that can be interesting to you for another function.
  // Return:
  // A promise. When an error is thrown, it is logged in the console and an error message is displayed.
  initialize(): Promise<void>;
  // IsPoweredByEnabled will return boolean value to know if powered by message must be display.
  // Return:
  // Will return boolean value to know if powered by message must be display.
  isPoweredByEnabled(): boolean;
  // GetCustomTheme will return a custom theme.
  // Return:
  // Should returns an object that will be taken by createTheme function.
  // Documentation: https://mui.com/customization/theming/#createtheme-options-args-theme
  getCustomTheme(): object;
};
```
