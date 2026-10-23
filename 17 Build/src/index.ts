import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UmbMediaTreeRepository } from '@umbraco-cms/backoffice/media';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import type { UmbAuthContext } from '@umbraco-cms/backoffice/auth';
import JSZip from 'jszip';

interface MediaInput {
    MediaID: string; // Changed to string (GUID)
    Format?: string;
    FileName?: string;
    OriginalSize: number;
}

interface MediaOutput {
    MediaID: string; // Changed to string (GUID)
    IsResized: boolean;
    IsOriginalSizeBetter: boolean;
    WidthPostResizing: number;
    NewSizeInBytes: number;
    FileSizeReductionPercentage: number;
}

interface MediaItem {
    id: string; // Changed to string (GUID)
    name: string;
    owner: string;
    updateDate: string;
    src: string;
    width: number;
    height: number;
    size: number;
    sizeNotFixed: number;
    fileType: string;
    fileExtension: string;
    folder: string;
    parentId: string;
    resizable: boolean;
    fileSizePostResizing?: number;
    fileSizeReductionPercentage?: number;
    recentlyResizedCorrectly: boolean;
    originalSizeBetter: boolean;
    widthPostResizing?: number;
}

type Section = 'Images' | 'Show Image Previews' | 'Confirmation' | 'Results';
type CompressionLevel = 'none' | 'low' | 'medium' | 'high';

@customElement('media-resizer-dashboard')
export class MediaResizerDashboardElement extends UmbElementMixin(LitElement) {
    @state()
    private _currentSection: Section = 'Images';

    @state()
    private _maxWidth: string = '2400';

    @state()
    private _ignoreMaxWidth: boolean = false;

    @state()
    private _compressionLevel: CompressionLevel = 'medium';

    @state()
    private _sortedMediaItems: MediaItem[] = [];

    @state()
    private _resizableMediaItems: MediaItem[] = [];

    @state()
    private _selectedMediaItems: MediaItem[] = [];

    @state()
    private _isAnalyzing: boolean = false;

    @state()
    private _isProcessing: boolean = false;

    @state()
    private _isDownloadingPreview: boolean = false;

    @state()
    private _tableLimit: number = 50;

    @state()
    private _showDialog: string | null = null;

    @state()
    private _totalItemsFound: number = 0;

    @state()
    private _progressNum: number = 0;

    @state()
    private _numOfSuccessfullyResizedMediaItems: number = 0;

    @state()
    private _mbsSaved: number = 0;

    @state()
    private _originalSize: number = 0;

    @state()
    private _foundFolders: Array<{ id: string; name: string }> = [];

    private _mediaTreeRepository = new UmbMediaTreeRepository(this);
    private _authContext?: UmbAuthContext;

    async connectedCallback() {
        super.connectedCallback();
        window.addEventListener('keydown', this._onKeyDown);
        this._authContext = await this.getContext(UMB_AUTH_CONTEXT);
    }

    disconnectedCallback() {
        window.removeEventListener('keydown', this._onKeyDown);
        super.disconnectedCallback();
    }

    private async _getAuthHeaders(): Promise<Record<string, string>> {
        if (!this._authContext) {
            return {};
        }

        const token = await this._authContext.getLatestToken();
        return {
            'Authorization': `Bearer ${token}`
        };
    }

    // Navigate to section
    private _navigateToSection(section: Section) {
        this._currentSection = section;
    }

    // Analyze images
    private async _analyzeImages() {
        this._isAnalyzing = true;
        this._sortedMediaItems = [];
        this._resizableMediaItems = [];
        this._selectedMediaItems = [];
        this._foundFolders = [];
        this._totalItemsFound = 0;

        await this._processMediaItems(null);

        this._isAnalyzing = false;
        this._navigateToSection('Show Image Previews');
    }

    // Recursively process media items with pagination
    private async _processMediaItems(parentUnique: string | null) {
        let skip = 0;
        const take = 50; // Page size
        let hasMoreItems = true;

        while (hasMoreItems) {
            const args: any = {
                skip,
                take
            };

            // For root level, use requestTreeRootItems
            if (parentUnique === null) {
                const { data } = await this._mediaTreeRepository.requestTreeRootItems(args);

                if (!data || data.items.length === 0) {
                    hasMoreItems = false;
                    break;
                }

                await this._processMediaBatch(data.items);

                // Check if there are more items
                if (data.items.length < take) {
                    hasMoreItems = false;
                } else {
                    skip += take;
                }
            } else {
                // For children, use requestTreeItemsOf
                const { data } = await this._mediaTreeRepository.requestTreeItemsOf({
                    parent: { unique: parentUnique, entityType: 'media' },
                    skip,
                    take
                });

                if (!data || data.items.length === 0) {
                    hasMoreItems = false;
                    break;
                }

                await this._processMediaBatch(data.items);

                // Check if there are more items
                if (data.items.length < take) {
                    hasMoreItems = false;
                } else {
                    skip += take;
                }
            }
        }
    }

    // Process a batch of media items
    private async _processMediaBatch(items: any[]) {
        for (const item of items) {
            // Check if it's a folder by checking the type or hasChildren property
            // In Umbraco, folders typically have a specific content type alias
            const isFolder = item.isFolder || item.hasChildren;

            if (isFolder) {
                this._foundFolders.push({ id: item.unique, name: item.name });
                // Recursively process folder contents
                await this._processMediaItems(item.unique);
            } else {
                this._totalItemsFound++;
                await this._handleMediaItem(item);
            }
        }
    }

    // Handle individual media item - fetch details from backend
    private async _handleMediaItem(item: any) {
        try {
            const authHeaders = await this._getAuthHeaders();
            const headers: Record<string, string> = {
                ...authHeaders,
                'Content-Type': 'application/json'
            };

            // Always fetch from backend API which handles authentication properly
            const response = await fetch(`/umbraco/management/api/v1/mediaprocessor/GetById/${item.unique}`, {
                headers
            });

            if (!response.ok) {
                console.warn(`Could not fetch media details for ${item.unique}:`, response.status);
                return;
            }

            const mediaData = await response.json();

            if (!mediaData) return;

            const src = mediaData.url || '';
            const width = parseInt(mediaData.width) || 0;
            const height = parseInt(mediaData.height) || 0;
            const bytes = parseInt(mediaData.bytes) || 0;
            const fileExtension = mediaData.extension?.toLowerCase() || '';

            const maxWidth = this._ignoreMaxWidth ? 0 : parseInt(this._maxWidth);

            if (width > 0 && (!maxWidth || width > maxWidth)) {
                const folderName = await this._getFolderName(item.parent?.unique || null);

                const mediaItem: MediaItem = {
                    id: item.unique, // Keep as string GUID
                    name: item.name,
                    owner: 'Unknown',
                    updateDate: new Date(item.updateDate).toLocaleDateString(),
                    src: src || '',
                    width,
                    height,
                    size: parseFloat((bytes / 1000000).toFixed(2)),
                    sizeNotFixed: bytes / 1000000,
                    fileType: fileExtension,
                    fileExtension,
                    folder: folderName,
                    parentId: item.parent?.unique || null,
                    resizable: ['jpeg', 'jpg', 'png'].includes(fileExtension),
                    recentlyResizedCorrectly: false,
                    originalSizeBetter: false
                };

                this._sortedMediaItems = [...this._sortedMediaItems, mediaItem];

                if (mediaItem.resizable) {
                    this._resizableMediaItems = [...this._resizableMediaItems, mediaItem];
                    this._selectedMediaItems = [...this._selectedMediaItems, mediaItem];
                }

                // Sort by width
                this._sortedMediaItems.sort((a, b) => b.width - a.width);
            }
        } catch (error) {
            console.error('Error handling media item:', error);
        }
    }

    // Get folder name
    private async _getFolderName(parentUnique: string | null): Promise<string> {
        if (!parentUnique) return '[root]';

        const found = this._foundFolders.find(f => f.id === parentUnique);
        if (found) return found.name;

        return '[root]';
    }

    // Toggle item selection
    private _toggleItemSelection(item: MediaItem) {
        const index = this._selectedMediaItems.findIndex(i => i.id === item.id);

        if (index >= 0) {
            this._selectedMediaItems = this._selectedMediaItems.filter(i => i.id !== item.id);
        } else {
            this._selectedMediaItems = [...this._selectedMediaItems, item];
        }
    }

    // Select all
    private _selectAll() {
        this._selectedMediaItems = [...this._resizableMediaItems];
    }

    // Deselect all
    private _deselectAll() {
        this._selectedMediaItems = [];
    }

    // Resize images
    private async _resizeImages() {
        this._isProcessing = true;
        this._progressNum = 0;
        this._originalSize = 0;
        this._mbsSaved = 0;

        const batchSize = 25;
        for (let i = 0; i < this._selectedMediaItems.length; i += batchSize) {
            const batch = this._selectedMediaItems.slice(i, i + batchSize);
            const formdataList: MediaInput[] = batch.map(item => ({
                MediaID: item.id, // Now a string GUID
                Format: item.fileExtension === 'png' ? 'png' : 'jpg',
                OriginalSize: item.sizeNotFixed * 1024,
                FileName: item.name
            }));

            await this._sendProcessRequest(formdataList);
            this._progressNum = Math.min(i + batchSize, this._selectedMediaItems.length);
        }

        this._numOfSuccessfullyResizedMediaItems = this._selectedMediaItems.filter(
            item => item.recentlyResizedCorrectly
        ).length;

        this._isProcessing = false;
        this._navigateToSection('Results');
    }

    // Send process request
    private async _sendProcessRequest(formdataList: MediaInput[]) {
        const formData = new FormData();
        formData.append('MediaList', JSON.stringify(formdataList));
        formData.append('MaxWidth', this._ignoreMaxWidth ? '0' : this._maxWidth);
        formData.append('CompressionLevel', this._compressionLevel);

        const authHeaders = await this._getAuthHeaders();
        // Only include Authorization header for FormData - browser sets Content-Type automatically
        const headers: Record<string, string> = {
            ...authHeaders
        };

        const response = await fetch('/umbraco/management/api/v1/mediaprocessor/ProcessServer', {
            method: 'POST',
            headers,
            body: formData
        });

        const results: MediaOutput[] = await response.json();

        results.forEach(result => {
            const item = this._selectedMediaItems.find(i => i.id === result.MediaID);
            if (item) {
                item.recentlyResizedCorrectly = result.IsResized;
                item.originalSizeBetter = result.IsOriginalSizeBetter;
                item.widthPostResizing = result.WidthPostResizing;
                item.fileSizePostResizing = result.NewSizeInBytes / 1000000;
                item.fileSizeReductionPercentage = result.FileSizeReductionPercentage;

                this._originalSize += item.size;
                if (result.IsResized) {
                    this._mbsSaved += (item.size - (result.NewSizeInBytes / 1000000));
                }
            }
        });
    }

    // Download preview
    private async _downloadPreview() {
        this._isDownloadingPreview = true;

        const zip = new JSZip();

        const batchSize = 25;
        for (let i = 0; i < this._selectedMediaItems.length; i += batchSize) {
            const batch = this._selectedMediaItems.slice(i, i + batchSize);
            const formdataList: MediaInput[] = batch.map(item => ({
                MediaID: item.id,
                Format: item.fileExtension === 'png' ? 'png' : 'jpg',
                OriginalSize: item.sizeNotFixed * 1024,
                FileName: item.name
            }));

            const formData = new FormData();
            formData.append('MediaList', JSON.stringify(formdataList));
            formData.append('MaxWidth', this._ignoreMaxWidth ? '0' : this._maxWidth);
            formData.append('CompressionLevel', this._compressionLevel);

            const authHeaders = await this._getAuthHeaders();
            const headers: Record<string, string> = {
                ...authHeaders
            };

            const response = await fetch('/umbraco/management/api/v1/mediaprocessor/GetPreview', {
                method: 'POST',
                headers,
                body: formData
            });

            const data = await response.json();

            data.forEach((item: any) => {
                const byteArray = this._base64ToArrayBuffer(item.NewFile);
                zip.file(`preview_${item.FileName}.${item.FileFormat}`, byteArray);
            });
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image_previews.zip';
        link.click();
        URL.revokeObjectURL(url);

        this._isDownloadingPreview = false;
    }

    // Download backup
    private async _downloadBackup() {
        this._showDialog = null;
        this._isProcessing = true;

        const zip = new JSZip();

        const batchSize = 25;
        for (let i = 0; i < this._selectedMediaItems.length; i += batchSize) {
            const batch = this._selectedMediaItems.slice(i, i + batchSize);
            const mediaIds = batch.map(item => item.id).join(','); // Now GUIDs

            const formData = new FormData();
            formData.append('mediaIds', mediaIds);

            const authHeaders = await this._getAuthHeaders();
            // Only include Authorization header for FormData - browser sets Content-Type automatically
            const headers: Record<string, string> = {
                ...authHeaders
            };

            const response = await fetch('/umbraco/management/api/v1/mediaprocessor/BackupMediaItems', {
                method: 'POST',
                headers,
                body: formData
            });

            const data = await response.json();

            data.forEach((item: any) => {
                const byteArray = this._base64ToArrayBuffer(item.fileArray);
                // JSZip can handle Uint8Array directly
                zip.file(item.name, byteArray);
            });
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'selected_images_backup.zip';
        link.click();
        URL.revokeObjectURL(url);

        this._isProcessing = false;
    }

    private _base64ToArrayBuffer(base64: string): Uint8Array {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    render() {
        return html`
      <uui-box headline="Digital Wonderlab Image Resizer">
        ${this._renderCurrentSection()}
      </uui-box>
      ${this._renderDialogs()}
    `;
    }

    private _renderCurrentSection() {
        switch (this._currentSection) {
            case 'Images':
                return this._renderConfigurationSection();
            case 'Show Image Previews':
                return this._renderPreviewSection();
            case 'Confirmation':
                return this._renderConfirmationSection();
            case 'Results':
                return this._renderResultsSection();
            default:
                return nothing;
        }
    }

    private _renderConfigurationSection() {
        return html`
      <div class="section">
        <p>Smaller images load faster. Use this plugin to easily reduce the size of images that have been uploaded at a larger width than you need to a new maximum width of your choice. Then choose a compression level to further reduce the file size.</p>
        
        <div class="settings-container">
          <div class="width-setting">
            <h4>1. Max Width</h4>
            <p class="small-text">Images exceeding this width will be resized while preserving their aspect ratio.</p>
            <uui-input
              type="number"
              .value=${this._maxWidth}
              @change=${(e: any) => this._maxWidth = e.target.value}
              ?disabled=${this._ignoreMaxWidth}
              placeholder="e.g. 2400"
            >
              <span slot="append" class="input-suffix">px</span>
            </uui-input>
            <uui-checkbox
              ?checked=${this._ignoreMaxWidth}
              @change=${(e: any) => this._ignoreMaxWidth = e.target.checked}
              label="Ignore Max Width"
            >
              No thanks, I don't want to change the width of my images.
            </uui-checkbox>
          </div>

          <div class="compression-setting">
            <h4>2. Compression Level</h4>
            <p class="small-text">A higher level of compression will result in a lower file size, but with a greater reduction in image quality.</p>
            <div class="compression-buttons">
              ${this._renderCompressionButton('none', 'None', 'No compression added')}
              ${this._renderCompressionButton('low', 'Minimum', '25% compression added')}
              ${this._renderCompressionButton('medium', 'Medium (recommended)', '50% compression added')}
              ${this._renderCompressionButton('high', 'Maximum', '75% compression added')}
            </div>
          </div>
        </div>

        <div class="actions">
          <uui-button
            look="primary"
            color="positive"
            @click=${this._analyzeImages}
            ?disabled=${this._isAnalyzing}
          >
            ${this._isAnalyzing ? html`
              <uui-loader-circle></uui-loader-circle>
              Analysing... (Found ${this._totalItemsFound} items)
            ` : 'Analyse Images...'}
          </uui-button>
        </div>
      </div>
    `;
    }

    private _renderCompressionButton(level: CompressionLevel, label: string, description: string) {
        const selected = this._compressionLevel === level;
        return html`
      <uui-button
        look=${selected ? 'primary' : 'outline'}
        label=${label}
        @click=${() => this._compressionLevel = level}
        class="compression-btn ${selected ? 'selected' : ''}"
      >
        <span class="compression-btn-content">
          <strong>${label}</strong>
          <span class="compression-btn-description">${description}</span>
        </span>
      </uui-button>
    `;
    }

    private _renderPreviewSection() {
        return html`
      <div class="section">
        <div class="header">
          <div>
            <h3>Images to Resize</h3>
            <p>Found ${this._sortedMediaItems.length} images. ${this._resizableMediaItems.length} can be resized.</p>
          </div>
          <div class="header-actions">
            <uui-button look="default" @click=${() => this._navigateToSection('Images')}>Back</uui-button>
            <uui-button
              look="outline"
              @click=${this._downloadPreview}
              ?disabled=${this._selectedMediaItems.length === 0 || this._isDownloadingPreview}
            >
              ${this._isDownloadingPreview ? html`
                <uui-loader-circle></uui-loader-circle>
                Generating Preview...
              ` : 'Download Preview'}
            </uui-button>
            <uui-button
              look="primary"
              color="positive"
              @click=${() => this._navigateToSection('Confirmation')}
              ?disabled=${this._selectedMediaItems.length === 0}
            >
              Convert ${this._selectedMediaItems.length} Images...
            </uui-button>
          </div>
        </div>

        <div class="table-actions">
          <span class="selection-summary">
            <strong>${this._selectedMediaItems.length}</strong> of ${this._resizableMediaItems.length} resizable images selected
          </span>
          <uui-button
            look="secondary"
            label="Select all"
            ?disabled=${this._resizableMediaItems.length === 0 || this._selectedMediaItems.length === this._resizableMediaItems.length}
            @click=${this._selectAll}
          >Select all</uui-button>
          <uui-button
            look="secondary"
            label="Deselect all"
            ?disabled=${this._selectedMediaItems.length === 0}
            @click=${this._deselectAll}
          >Deselect all</uui-button>
        </div>

        ${this._renderMediaTable()}
      </div>
    `;
    }

    private _renderMediaTable() {
        const itemsToShow = this._sortedMediaItems.slice(0, this._tableLimit);
        const allSelected = this._resizableMediaItems.length > 0
            && this._selectedMediaItems.length === this._resizableMediaItems.length;

        return html`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>
            <uui-checkbox
              label="Select all resizable images"
              label-position="none"
              ?checked=${allSelected}
              ?disabled=${this._resizableMediaItems.length === 0}
              @change=${(e: any) => e.target.checked ? this._selectAll() : this._deselectAll()}
            ></uui-checkbox>
          </uui-table-head-cell>
          <uui-table-head-cell>File Name</uui-table-head-cell>
          <uui-table-head-cell>Type</uui-table-head-cell>
          <uui-table-head-cell>Parent Folder</uui-table-head-cell>
          <uui-table-head-cell>File Size</uui-table-head-cell>
          <uui-table-head-cell>Width</uui-table-head-cell>
        </uui-table-head>
        ${itemsToShow.map(item => this._renderMediaTableRow(item))}
      </uui-table>
    `;
    }

    private _renderMediaTableRow(item: MediaItem) {
        const isSelected = this._selectedMediaItems.some(i => i.id === item.id);

        return html`
      <uui-table-row>
        <uui-table-cell>
          <uui-checkbox
            label="Select ${item.name}"
            label-position="none"
            ?checked=${isSelected}
            ?disabled=${!item.resizable}
            @change=${() => this._toggleItemSelection(item)}
          ></uui-checkbox>
        </uui-table-cell>
        <uui-table-cell>
          <a href="/umbraco/section/media/workspace/media/edit/${item.id}" target="_blank">${item.name}</a>
        </uui-table-cell>
        <uui-table-cell>${item.fileType}</uui-table-cell>
        <uui-table-cell>${item.folder}</uui-table-cell>
        <uui-table-cell>
          <uui-tag color=${item.sizeNotFixed > 1 ? 'danger' : 'positive'}>
            ${item.size}mb
          </uui-tag>
        </uui-table-cell>
        <uui-table-cell>
          <uui-tag color=${item.width > parseInt(this._maxWidth || '2400') ? 'danger' : 'positive'}>
            ${item.width}px
          </uui-tag>
        </uui-table-cell>
      </uui-table-row>
    `;
    }

    private _renderConfirmationSection() {
        return html`
      <div class="section">
        <h3>Confirmation</h3>
        <h4>Are you sure you want to resize ${this._selectedMediaItems.length} images?</h4>
        
        <div class="warning">
          <uui-icon name="alert"></uui-icon>
          <p>Caution: this will modify the selected images. This cannot be undone.</p>
        </div>

        <div class="actions">
          <uui-button look="default" @click=${() => this._navigateToSection('Show Image Previews')}>
            Back
          </uui-button>
          <uui-button look="outline" @click=${() => this._showDialog = 'backup'}>
            Download Backup
          </uui-button>
          <uui-button 
            look="primary" 
            color="positive"
            @click=${this._resizeImages}
            ?disabled=${this._isProcessing}
          >
            ${this._isProcessing ? html`
              <uui-loader-circle></uui-loader-circle>
              Processing... (${this._progressNum}/${this._selectedMediaItems.length})
            ` : `Resize ${this._selectedMediaItems.length} Images`}
          </uui-button>
        </div>
      </div>
    `;
    }

    private _renderResultsSection() {
        return html`
      <div class="section">
        <h3>Resizing Complete</h3>
        <p>
          ${this._numOfSuccessfullyResizedMediaItems} out of ${this._selectedMediaItems.length} images were resized successfully.
          You reduced the collective file sizes by ${this._mbsSaved.toFixed(2)}mb.
        </p>

        <uui-button look="primary" @click=${() => this._navigateToSection('Images')}>
          Done
        </uui-button>

        ${this._renderResultsTable()}
      </div>
    `;
    }

    private _renderResultsTable() {
        return html`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>Status</uui-table-head-cell>
          <uui-table-head-cell>File Name</uui-table-head-cell>
          <uui-table-head-cell>Width</uui-table-head-cell>
          <uui-table-head-cell>File Size</uui-table-head-cell>
          <uui-table-head-cell>Reduction</uui-table-head-cell>
        </uui-table-head>
        ${this._selectedMediaItems.map(item => html`
          <uui-table-row>
            <uui-table-cell>
              ${item.recentlyResizedCorrectly
                ? html`<uui-icon name="check" style="color: green"></uui-icon>`
                : item.originalSizeBetter
                  ? html`<uui-icon name="alert" style="color: rgb(191,33,78); cursor:pointer" @click=${() => this._showDialog = 'size-increased'}></uui-icon>`
                  : html`<uui-icon name="remove" style="color: rgb(191,33,78); cursor:pointer" @click=${() => this._showDialog = 'resize-failed'}></uui-icon>`}
            </uui-table-cell>
            <uui-table-cell>
              <a href="/umbraco/section/media/workspace/media/edit/${item.id}" target="_blank">${item.name}</a>
            </uui-table-cell>
            <uui-table-cell>
              ${item.widthPostResizing ? `${item.width}px → ${item.widthPostResizing}px` : `${item.width}px`}
            </uui-table-cell>
            <uui-table-cell>
              ${item.fileSizePostResizing ? `${item.size}mb → ${item.fileSizePostResizing.toFixed(2)}mb` : `${item.size}mb`}
            </uui-table-cell>
            <uui-table-cell>
              ${item.fileSizeReductionPercentage ? `${item.fileSizeReductionPercentage.toFixed(2)}%` : '-'}
            </uui-table-cell>
          </uui-table-row>
        `)}
      </uui-table>
    `;
    }

    private _closeDialog = () => { this._showDialog = null; };

    private _onBackdropClick(e: Event) {
        if (e.target === e.currentTarget) this._closeDialog();
    }

    private _onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this._showDialog) this._closeDialog();
    };

    private _renderDialogs() {
        if (!this._showDialog) return nothing;

        // Fixed, centred modal with a dimmed backdrop. Closes on backdrop click or Escape.
        return html`
      <div class="dialog-backdrop" @click=${this._onBackdropClick}>
      <uui-dialog role="dialog" aria-modal="true">
        ${this._showDialog === 'backup' ? html`
          <uui-dialog-layout headline="Download Backup">
            <p>This will download a backup of your selected images in their current state.</p>
            <uui-button slot="actions" @click=${() => this._showDialog = null}>Cancel</uui-button>
            <uui-button slot="actions" look="primary" @click=${this._downloadBackup}>Confirm</uui-button>
          </uui-dialog-layout>
        ` : nothing}
        ${this._showDialog === 'size-increased' ? html`
          <uui-dialog-layout headline="The size has increased?">
            <p>When resizing an image, the output is re-encoded using standard compression settings.</p>
            <p>These settings may apply less compression than was originally used on the image, so even though the dimensions are smaller, the re-encoded file can end up larger in size.</p>
            <p>We recommend taking note of this image and running a manual compression on it, or choosing a higher compression level in the settings to ensure the output is smaller.</p>
            <uui-button slot="actions" look="primary" @click=${() => this._showDialog = null}>OK</uui-button>
          </uui-dialog-layout>
        ` : nothing}
        ${this._showDialog === 'resize-failed' ? html`
          <uui-dialog-layout headline="Image could not be processed">
            <p>This image could not be resized. This is most commonly caused by the file being missing or inaccessible in Umbraco's media storage.</p>
            <p>Check that the file exists in the media library and has not been manually removed from the file system. If the problem persists, re-uploading the image through Umbraco should resolve it.</p>
            <uui-button slot="actions" look="primary" @click=${() => this._showDialog = null}>OK</uui-button>
          </uui-dialog-layout>
        ` : nothing}
      </uui-dialog>
      </div>
    `;
    }

    static styles = css`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }

    .section {
      padding: var(--uui-size-space-5);
    }

    .settings-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--uui-size-space-5);
      margin: var(--uui-size-space-5) 0;
    }

    .compression-buttons {
      display: flex;
      gap: var(--uui-size-space-3);
      flex-wrap: wrap;
    }

    .compression-btn {
      min-width: 190px;
      min-height: 110px;
    }

    .compression-btn-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--uui-size-space-2);
      text-align: center;
      white-space: normal;
      padding: var(--uui-size-space-2);
    }

    .compression-btn-description {
      font-size: 0.85em;
      font-weight: normal;
      color: var(--uui-color-text-alt);
    }

    /* On the selected (primary) button the text is light, so the description must follow it */
    .compression-btn.selected .compression-btn-description {
      color: inherit;
      opacity: 0.85;
    }

    .input-suffix {
      display: flex;
      align-items: center;
      padding: 0 var(--uui-size-space-3);
      color: var(--uui-color-text-alt);
    }

    .selection-summary {
      margin-right: auto;
      color: var(--uui-color-text-alt);
    }

    .dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--uui-size-space-5);
      background: rgba(0, 0, 0, 0.5);
    }

    .dialog-backdrop uui-dialog {
      width: 100%;
      max-width: 560px;
      max-height: 90vh;
      overflow: auto;
    }

    .small-text {
      font-size: 0.9em;
      color: var(--uui-color-text-alt);
    }

    .grey-text {
      color: var(--uui-color-text-alt);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--uui-size-space-4);
    }

    .header-actions {
      display: flex;
      gap: var(--uui-size-space-3);
    }

    .table-actions {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      margin-bottom: var(--uui-size-space-4);
    }

    .actions {
      display: flex;
      gap: var(--uui-size-space-3);
      margin-top: var(--uui-size-space-4);
    }

    .warning {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      padding: var(--uui-size-space-4);
      background: var(--uui-color-warning-emphasis);
      border-radius: var(--uui-border-radius);
      margin: var(--uui-size-space-4) 0;
    }

    uui-table {
      margin-top: var(--uui-size-space-4);
    }
  `;
}

declare global {
    interface HTMLElementTagNameMap {
        'media-resizer-dashboard': MediaResizerDashboardElement;
    }
}