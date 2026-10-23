#if !NET8_0
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Extensions;
using Image = SixLabors.ImageSharp.Image;
using Umbraco.Cms.Api.Management.Routing;

namespace DigitalWonderlab.MediaResizer.Controllers;

[ApiController]
[VersionedApiBackOfficeRoute("mediaprocessor")]
[ApiExplorerSettings(GroupName = "Media Processor Dashboard")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
public class MediaProcessorController(
    IMediaService mediaService,
    MediaFileManager mediaFileManager,
    IShortStringHelper shortStringHelper,
    IContentTypeBaseServiceProvider contentTypeBaseServiceProvider,
    MediaUrlGeneratorCollection mediaUrlGeneratorCollection,
    ILogger<MediaProcessorController> logger) : ControllerBase
{
    private readonly IMediaService _mediaService = mediaService;
    private readonly MediaFileManager _mediaFileManager = mediaFileManager;
    private readonly IShortStringHelper _shortStringHelper = shortStringHelper;
    private readonly IContentTypeBaseServiceProvider _contentTypeBaseServiceProvider = contentTypeBaseServiceProvider;
    private readonly MediaUrlGeneratorCollection _mediaUrlGeneratorCollection = mediaUrlGeneratorCollection;
    private readonly ILogger<MediaProcessorController> _logger = logger;
    private JpegEncoder? _jpgEncoder;
    private PngEncoder? _pngEncoder;

    public record AjaxResponse(string Name, byte[] FileArray);

    [HttpPost("ProcessServer")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(List<MediaOutput>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public IActionResult ProcessServer(
        [FromForm] string MaxWidth,
        [FromForm] string MediaList,
        [FromForm] string? CompressionLevel)
    {
        var mediaInput = JsonSerializer.Deserialize<List<MediaInput>>(MediaList) ?? [];
        if (!int.TryParse(MaxWidth, out int maxWidth))
            maxWidth = 0;
        if (maxWidth < 0)
            return BadRequest(new { error = "MaxWidth must be 0 (no resizing) or a positive number of pixels." });

        SetCompressionLevels(CompressionLevel);

        List<IMedia> mediaItemsToSave = [];
        List<MediaOutput> outputList = [];

        foreach (MediaInput input in mediaInput)
        {
            MediaOutput resultOutput = RunResizing(maxWidth, input, out IMedia? mediaToSave);

            if (mediaToSave != null && resultOutput.IsResized && !resultOutput.IsOriginalSizeBetter)
            {
                mediaItemsToSave.Add(mediaToSave);
            }

            outputList.Add(resultOutput);
        }

        if (mediaItemsToSave.Count == 0)
            return Ok(outputList);

        var result = _mediaService.Save(mediaItemsToSave);
        if (!result.Success)
            return StatusCode(500, new { error = "Failed to save media items", details = result.Result });

        return Ok(outputList);
    }

    [HttpGet("GetById/{id:guid}")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public IActionResult GetById(Guid id)
    {
        try
        {
            var mediaItem = _mediaService.GetById(id);

            if (mediaItem == null)
            {
                return NotFound(new { error = $"Media item with ID {id} not found" });
            }

            mediaItem.Properties.TryGetValue("umbracoBytes", out var umbracoBytes);
            mediaItem.Properties.TryGetValue("umbracoWidth", out var umbracoWidth);
            mediaItem.Properties.TryGetValue("umbracoHeight", out var umbracoHeight);
            mediaItem.Properties.TryGetValue("umbracoExtension", out var umbracoExtension);

            var url = GetFilePath(mediaItem) ?? "";

            return Ok(new
            {
                url,
                width = umbracoWidth?.Values.FirstOrDefault()?.EditedValue,
                height = umbracoHeight?.Values.FirstOrDefault()?.EditedValue,
                bytes = umbracoBytes?.Values.FirstOrDefault()?.EditedValue,
                extension = umbracoExtension?.Values.FirstOrDefault()?.EditedValue
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting media by ID: {Id}", id);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    [HttpPost("GetPreview")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(List<PreviewOutput>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetPreview([FromForm] string MaxWidth, [FromForm] string MediaList, [FromForm] string? CompressionLevel)
    {
        var mediaInput = JsonSerializer.Deserialize<List<MediaInput>>(MediaList) ?? [];
        if (!int.TryParse(MaxWidth, out int maxWidth))
        {
            maxWidth = 0;
        }
        if (maxWidth < 0)
            return BadRequest(new { error = "MaxWidth must be 0 (no resizing) or a positive number of pixels." });

        SetCompressionLevels(CompressionLevel);

        List<PreviewOutput> outputList = [];

        foreach (MediaInput input in mediaInput)
        {
            PreviewOutput resultOutput = RunResizingPreview(maxWidth, input);
            if (resultOutput.IsResized && !resultOutput.IsOriginalSizeBetter)
            {
                outputList.Add(resultOutput);
            }
        }

        return Ok(outputList);
    }

    [HttpPost("BackupMediaItems")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(List<AjaxResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public List<AjaxResponse> BackupMediaItems([FromForm] string mediaIds)
    {
        try
        {
            // Split by comma and parse as GUIDs
            string[] mediaIdsArray = mediaIds.Split(',');
            Guid[] mediaGuidIds = mediaIdsArray.Select(Guid.Parse).ToArray();
            List<AjaxResponse> returnList = new();

            foreach (Guid mediaId in mediaGuidIds)
            {
                IMedia? mediaItem = _mediaService.GetById(mediaId);

                if (mediaItem != null)
                {
                    var filePath = GetFilePath(mediaItem);

                    mediaItem.Properties.TryGetValue("umbracoExtension", out var umbracoExtension);
                    var fileExtensionValue = umbracoExtension?.Values.FirstOrDefault()?.EditedValue;

                    if (!string.IsNullOrEmpty(filePath))
                    {
                        using Stream currentStream = _mediaService.GetMediaFileContentStream(filePath);
                        using MemoryStream tempMemoryStream = new();
                        currentStream.CopyTo(tempMemoryStream);

                        returnList.Add(new(mediaItem.Name + "." + fileExtensionValue, tempMemoryStream.ToArray()));
                        currentStream.Close();
                        tempMemoryStream.Close();
                    }
                }
            }

            return returnList;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error backing up media items");
            return new List<AjaxResponse>();
        }
    }

    private PreviewOutput RunResizingPreview(int maxWidth, MediaInput input)
    {
        PreviewOutput resultOutput = new(input.MediaID);
        if (!IsSupportedFormat(input.Format))
        {
            _logger.LogWarning("Unsupported image format '{Format}' for media {MediaId}; item skipped.", input.Format, input.MediaID);
            return resultOutput;
        }

        var mediaItem = _mediaService.GetById(Guid.Parse(input.MediaID));

        if (mediaItem != null)
        {
            string? filePath = GetFilePath(mediaItem);

            if (!string.IsNullOrEmpty(filePath))
            {
                var currentStream = _mediaService.GetMediaFileContentStream(filePath);
                if (currentStream != null && currentStream.Length > 0)
                {
                    using MemoryStream outstream = new();
                    double originalFileSize = currentStream.Length;
                    using Image image = Image.Load(currentStream);

                    // Only shrink: an image already narrower than MaxWidth is left at its size and just re-encoded
                    if (maxWidth != 0 && image.Width > maxWidth)
                    {
                        image.Mutate(x => x.Resize(maxWidth, 0));
                    }

                    switch (input.Format)
                    {
                        case ("jpg"):
                            var previewJpgEncoder = _jpgEncoder ?? new JpegEncoder()
                            {
                                Quality = image.Metadata.GetFormatMetadata(JpegFormat.Instance)?.Quality ?? 85
                            };
                            image.Save(outstream, previewJpgEncoder);
                            break;
                        case ("png"):
                            image.Save(outstream, _pngEncoder!);
                            break;
                        default: break;
                    }

                    currentStream.Close();
                    outstream.Seek(0, SeekOrigin.Begin);

                    // An empty output stream means nothing was encoded; never treat that as a successful resize
                    if (outstream.Length > 0 && originalFileSize > outstream.Length)
                    {
                        resultOutput.IsResized = true;
                        resultOutput.NewFile = outstream.ToArray();
                        resultOutput.FileName = input.FileName ?? "";
                        resultOutput.FileFormat = input.Format ?? "";
                    }
                    else
                    {
                        resultOutput.IsOriginalSizeBetter = true;
                    }

                    outstream.Close();
                }
                else
                {
                    _logger.LogWarning("Null Stream detected, most likely cause is that the media is missing. Media ID: {mediaId}. FilePath: {filePath}", input.MediaID, filePath);
                }
            }
        }

        return resultOutput;
    }

    private MediaOutput RunResizing(int maxWidth, MediaInput input, out IMedia? mediaToSave)
    {
        MediaOutput resultOutput = new(input.MediaID);
        mediaToSave = null;
        if (!IsSupportedFormat(input.Format))
        {
            _logger.LogWarning("Unsupported image format '{Format}' for media {MediaId}; item skipped.", input.Format, input.MediaID);
            return resultOutput;
        }

        mediaToSave = _mediaService.GetById(Guid.Parse(input.MediaID));

        if (mediaToSave != null)
        {
            string? filePath = GetFilePath(mediaToSave);

            if (!string.IsNullOrEmpty(filePath))
            {
                var currentStream = _mediaService.GetMediaFileContentStream(filePath);
                if (currentStream != null && currentStream.Length > 0)
                {
                    using MemoryStream outstream = new();
                    double originalFileSize = currentStream.Length;
                    var identifyInfo = Image.Identify(currentStream);
                    using Image reloadedImage = ReloadImageBasedOnPixelType(identifyInfo, currentStream);

                    // Only shrink: an image already narrower than MaxWidth is left at its size and just re-encoded
                    if (maxWidth != 0 && reloadedImage.Width > maxWidth)
                    {
                        reloadedImage.Mutate(x => x.Resize(maxWidth, 0));
                        resultOutput.WidthPostResizing = maxWidth;
                    }
                    else
                    {
                        resultOutput.WidthPostResizing = reloadedImage.Width;
                    }

                    switch (input.Format)
                    {
                        case ("jpg"):
                            var jpgEncoder = _jpgEncoder ?? new JpegEncoder()
                            {
                                Quality = identifyInfo.Metadata.GetFormatMetadata(JpegFormat.Instance)?.Quality ?? 85
                            };
                            reloadedImage.Save(outstream, jpgEncoder);
                            break;
                        case ("png"):
                            reloadedImage.Save(outstream, _pngEncoder!);
                            break;
                        default: break;
                    }

                    currentStream.Close();
                    outstream.Seek(0, SeekOrigin.Begin);

                    // An empty output stream means nothing was encoded; never treat that as a successful resize
                    if (outstream.Length > 0 && originalFileSize > outstream.Length)
                    {
                        resultOutput.IsResized = true;
                        resultOutput.NewSizeInBytes = outstream.Length;
                        resultOutput.FileSizeReductionPercentage = Math.Round((originalFileSize - outstream.Length) / originalFileSize * 100, 2);

                        mediaToSave.SetValue(
                            _mediaFileManager,
                            _mediaUrlGeneratorCollection,
                            _shortStringHelper,
                            _contentTypeBaseServiceProvider,
                            Constants.Conventions.Media.File,
                            filePath.Split('/').Last(),
                            outstream
                        );
                    }
                    else
                    {
                        resultOutput.IsOriginalSizeBetter = true;
                    }

                    outstream.Close();
                }
                else
                {
                    _logger.LogWarning("Null Stream detected, most likely cause is that the media is missing. Media ID: {mediaId}. FilePath: {filePath}", input.MediaID, filePath);
                }
            }
        }

        return resultOutput;
    }

    // Only formats with an encoder configured in SetCompressionLevels may be processed
    private static bool IsSupportedFormat(string? format) => format is "jpg" or "png";

    private static Image ReloadImageBasedOnPixelType(ImageInfo image, Stream currentStream)
    {
        currentStream.Position = 0;
        return image.PixelType.BitsPerPixel switch
        {
            32 => Image.Load<Rgba32>(currentStream),
            24 => Image.Load<Rgb24>(currentStream),
            16 => Image.Load<Bgr565>(currentStream),
            8 => Image.Load<L8>(currentStream),
            _ => Image.Load(currentStream),
        };
    }

    /// <summary>
    /// Resolves the stored file path of a media item. The Image Cropper editor stores JSON
    /// ({"src":"/media/...","crops":[...]}) whereas the plain Upload editor stores the bare path.
    /// Returns null when no usable path is present.
    /// </summary>
    private static string? GetFilePath(IMedia media)
    {
        media.Properties.TryGetValue("umbracoFile", out var umbracoFile);
        var raw = umbracoFile?.Values.FirstOrDefault()?.EditedValue?.ToString()?.Trim();
        if (string.IsNullOrEmpty(raw))
            return null;

        if (!raw.StartsWith('{'))
            return raw;

        try
        {
            using JsonDocument doc = JsonDocument.Parse(raw);
            if (doc.RootElement.TryGetProperty("src", out JsonElement srcElement) &&
                srcElement.ValueKind == JsonValueKind.String)
            {
                return srcElement.GetString();
            }
        }
        catch (JsonException)
        {
            // Not valid JSON despite the leading brace; treat as unusable rather than failing the batch
        }

        return null;
    }

    private void SetCompressionLevels(string? CompressionLevel)
    {
        var pngCompressionLevel = PngCompressionLevel.DefaultCompression;

        switch (CompressionLevel)
        {
            case ("high"):
                _jpgEncoder = new JpegEncoder() { Quality = 25 };
                pngCompressionLevel = PngCompressionLevel.Level7;
                break;
            case ("medium"):
                _jpgEncoder = new JpegEncoder() { Quality = 50 };
                pngCompressionLevel = PngCompressionLevel.Level5;
                break;
            case ("low"):
                _jpgEncoder = new JpegEncoder() { Quality = 75 };
                pngCompressionLevel = PngCompressionLevel.Level2;
                break;
            default:
                // null signals "preserve source quality", resolved per-image at encode time
                _jpgEncoder = null;
                break;
        }

        _pngEncoder = new PngEncoder()
        {
            CompressionLevel = pngCompressionLevel
        };
    }

    public class MediaInput
    {
        [JsonPropertyName("MediaID")]
        public string MediaID { get; set; } = string.Empty;

        [JsonPropertyName("Format")]
        public string? Format { get; set; }

        [JsonPropertyName("FileName")]
        public string? FileName { get; set; }

        [JsonPropertyName("OriginalSize")]
        public double OriginalSize { get; set; }
    }

    public class MediaOutput
    {
        [JsonPropertyName("MediaID")]
        public string MediaID { get; set; } = string.Empty;

        [JsonPropertyName("IsResized")]
        public bool IsResized { get; set; } = false;

        [JsonPropertyName("IsOriginalSizeBetter")]
        public bool IsOriginalSizeBetter { get; set; } = false;

        [JsonPropertyName("WidthPostResizing")]
        public int WidthPostResizing { get; set; } = 0;

        [JsonPropertyName("NewSizeInBytes")]
        public long NewSizeInBytes { get; set; } = 0;

        [JsonPropertyName("FileSizeReductionPercentage")]
        public double FileSizeReductionPercentage { get; set; } = 0;

        public MediaOutput(string mediaID)
        {
            MediaID = mediaID;
        }
    }

    public class PreviewOutput
    {
        [JsonPropertyName("MediaID")]
        public string MediaID { get; set; } = string.Empty;

        [JsonPropertyName("IsResized")]
        public bool IsResized { get; set; } = false;

        [JsonPropertyName("IsOriginalSizeBetter")]
        public bool IsOriginalSizeBetter { get; set; } = false;

        [JsonPropertyName("NewFile")]
        public byte[] NewFile { get; set; } = [];

        [JsonPropertyName("FileName")]
        public string FileName { get; set; } = "";

        [JsonPropertyName("FileFormat")]
        public string FileFormat { get; set; } = "";

        public PreviewOutput(string mediaID)
        {
            MediaID = mediaID;
        }
    }
}
#endif
