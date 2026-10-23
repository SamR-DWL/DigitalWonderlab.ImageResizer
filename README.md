# Image Resizer for Umbraco

A backoffice dashboard that finds oversized images in your media library and shrinks them. Set a maximum width, pick a compression level, review the list, and resize in one go. Resizing and compression use SixLabors.ImageSharp.

### Features
- Scans the whole media library and lists every image wider than your chosen maximum width, or every image if you choose to ignore width
- Resizes images down to the maximum width while preserving aspect ratio. Images are never upscaled
- Four compression levels: none (keeps the source JPEG quality), minimum, medium and maximum
- Download a preview zip of the resized output before changing anything
- Download a backup zip of the originals
- Never makes an image larger: where the re-encoded file would exceed the original, the image is left untouched and flagged in the results
- Results screen showing the size saved per image, with CSV export on Umbraco 13
- Handles JPEG and PNG

### Compatibility
- Umbraco 13, 15, 16 and 17
- .NET 8.0, .NET 9.0 and .NET 10.0
- Umbraco 14 is not supported

### Installation
- Install via NuGet https://www.nuget.org/packages/DigitalWonderlab.ImageResizer/latest
- Go to the Media section and click the Image Resizer tab. On Umbraco 13 the tab is shown to admin users only

### Usage
1. Set a maximum width. 2400px suits most sites. Tick "Ignore Max Width" to list every image instead
2. Choose a compression level. Medium is the recommended default
3. Click Analyse Images, review the list and untick anything you want to leave alone
4. Optionally download a preview zip or a backup zip
5. Click Resize. The original media files are overwritten and this cannot be undone, so take a backup first

### Notes
- Resizing re-encodes the image. If an image was already heavily compressed by another tool, the output can come out larger. Those images are skipped and marked in the results
- Processing runs on the web server in batches of 25 and loads each image into memory, so very large libraries take a while

### Issues / Suggestions
- To report an issue or suggest a feature, contact Digital Wonderlab at https://digitalwonderlab.com
<!-- TODO: replace with the GitHub issue tracker link once the public repository exists -->

### Screenshots
![Image Resizer dashboard](https://i.postimg.cc/FzgSL9Xf/Screenshot-2026-10-23-163651.png)
