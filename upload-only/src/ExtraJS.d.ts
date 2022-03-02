// Declare ExtraJS type
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
  // Will return an object with src and image alt value.
  getLogoConfiguration(): { src: string; alt: string };
  // GetFooter will be called to get the footer value.
  // Return:
  // Will return a string representing the footer to display.
  getFooter(): string;
  // Initialize will be run on page startup.
  // This is done in order to load some context that can be interesting to you for another function.
  // Return:
  // A promise. When an error is thrown, it is logged in the console and an error message is displayed.
  initialize(): Promise<void>;
};
