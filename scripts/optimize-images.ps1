# Image optimization script for Windows using ImageMagick
# Usage: Open PowerShell, cd to this project folder and run:
#   ./scripts/optimize-images.ps1
# Requirements: ImageMagick (magick.exe) must be in PATH
# This script will take common image files in the project root and generate
# resized, optimized WebP and resized JPG copies in the ./images-optimized folder.

$srcFolder = Get-Location
$dstFolder = Join-Path $srcFolder 'images-optimized'
if (!(Test-Path $dstFolder)) { New-Item -ItemType Directory -Path $dstFolder | Out-Null }

# Sizes to generate (max width in px)
$sizes = @(1600, 1200, 800, 400)

# File extensions to process
$exts = @('jpg','jpeg','png','webp')

Get-ChildItem -Path $srcFolder -File | Where-Object { $exts -contains ($_.Extension.TrimStart('.').ToLower()) } | ForEach-Object {
    $file = $_
    $base = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    foreach ($w in $sizes) {
        $outNameJpg = "{0}-{1}.jpg" -f $base, $w
        $outNameWebp = "{0}-{1}.webp" -f $base, $w
        $outPathJpg = Join-Path $dstFolder $outNameJpg
        $outPathWebp = Join-Path $dstFolder $outNameWebp
        Write-Host "Processing $($file.Name) -> $outNameJpg, $outNameWebp (width $w)"
        try {
            # Resize and save as optimized JPEG
            magick convert "$($file.FullName)" -resize ${w}x -strip -interlace Plane -quality 82 "$outPathJpg"
            # Save as optimized WebP (lossy)
            magick convert "$($file.FullName)" -resize ${w}x -strip -quality 80 "$outPathWebp"
        } catch {
            Write-Warning "Failed to process $($file.Name): $_"
        }
    }
}

Write-Host "Done. Optimized images saved to: $dstFolder"
