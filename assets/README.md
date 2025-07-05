# Icons Placeholder

This directory should contain application icons for different platforms:

- `icon.ico` - Windows icon (256x256 or multiple sizes)
- `icon.icns` - macOS icon (512x512 recommended)
- `icon.png` - Linux icon (512x512 recommended)

You can create these icons using your preferred image editor or online icon generators.

## Icon Requirements

### Windows (.ico)
- Recommended sizes: 16x16, 32x32, 48x48, 256x256
- Format: ICO file with multiple embedded sizes

### macOS (.icns)
- Recommended size: 512x512 (will be scaled automatically)
- Format: ICNS file

### Linux (.png)
- Recommended size: 512x512
- Format: PNG with transparency support

## Online Icon Generators

- [favicon.io](https://favicon.io/) - Generate icons from text, images, or emojis
- [realfavicongenerator.net](https://realfavicongenerator.net/) - Comprehensive icon generator
- [iconifier.net](https://iconifier.net/) - Simple icon converter

## Creating Icons

1. Design your icon at 512x512 pixels
2. Use the online generators or tools like GIMP, Photoshop, or Sketch
3. Place the generated files in this directory
4. The build process will automatically include them in the packaged app
