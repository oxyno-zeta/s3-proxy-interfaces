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
  // GetUploadSettings will allow to get upload settings for Uppy.
  // Return:
  // Partial object that will be spread on Uppy settings.
  getUploadSettings(): object;
  // GetLogoConfiguration will return the logo configuration.
  // Return:
  // Will return an object with src.
  getLogoConfiguration(): { src: string };
  // GetTitle will return the page title.
  // Return:
  // Will return the page title.
  getTitle(): string;
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
  // IsDeleteFeatureEnabled will allow to know if delete feature is enabled.
  // Params:
  // - path: actual ui path
  // Return:
  // Will return a boolean to know if delete feature is enabled.
  isDeleteFeatureEnabled(path: string): boolean;
  // IsUploadFeatureEnabled will allow to know if upload feature is enabled.
  // Params:
  // - path: actual ui path
  // Return:
  // Will return a boolean to know if upload feature is enabled.
  isUploadFeatureEnabled(path: string): boolean;
  // GetCustomTheme will return a custom theme.
  // Return:
  // Should returns an object that will be taken by createTheme function.
  // Documentation: https://mui.com/customization/theming/#createtheme-options-args-theme
  getCustomTheme(): object;
};
