# Walkthrough - 125% Scaling Fix

I have implemented the scaling fix to counteract the 125% OS display setting.

## Changes
### [globals.css](file:///c:/Projects/asogepes_webapp_2/src/app/globals.css)
Added a CSS media query to detect screens with ~125% pixel density and apply `zoom: 0.8`.

```css
@media (min-resolution: 1.20dppx) and (max-resolution: 1.30dppx) {
    html {
        zoom: 0.8;
    }
}
```

## Verification Steps

1.  **Set Scaling to 125%**:
    *   Go to **Windows Settings** > **System** > **Display**.
    *   Set "Scale and layout" to **125%**.
2.  **Open the Web App**:
    *   Refresh the page.
3.  **Verify**:
    *   The interface should **NOT** look magnified. It should look sharp and "small" (similar to 100% mode).
    *   Check for any layout issues at the bottom or right edges.

## Troubleshooting
- **Not working?** Ensure you are using Chrome or Edge. Firefox does not support the `zoom` property, so this fix targets Chromium-based browsers (Standard for Windows).
- **Too small?** If it looks smaller than intended, let me know, and we can adjust the factor (e.g., to 0.85).
