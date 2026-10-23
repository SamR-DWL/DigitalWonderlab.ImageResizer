angular.module("umbraco").controller("DWLMediaResizerController", function ($http, $scope, userService, logResource, entityResource, $filter, mediaResource, fileManager) {
    var vm = this;

    // The API is backoffice-only. Umbraco issues the anti-forgery token as a cookie; every request must echo it in this header.
    function backofficeHeaders() {
        const match = document.cookie.match(/(?:^|;\s*)UMB-XSRF-TOKEN=([^;]*)/);
        return match ? { 'X-UMB-XSRF-TOKEN': decodeURIComponent(match[1]) } : {};
    }

    // Umbraco prefixes JSON from authorized API controllers with )]}', to block JSON hijacking. AngularJS strips it; jQuery must do it by hand.
    function stripAngularJsonPrefix(data) {
        return typeof data === 'string' ? data.replace(/^\)\]\}',?\s*/, '') : data;
    }
    $scope.foundFolders = [];
    $scope.maxWidth;
    $scope.maxWidthSpecified = false;
    $scope.compressionLevel = "medium"; // user-defined compression level (none to max)
    $scope.tableLimit = 50; // how many items to show in the table
    $scope.showInnerSection = "";
    vm.currentSortingProperty = "width";
    vm.progressNum = 0; // progress indicator 

    vm.sortedMediaItems = []; // media items which go over the limit(s) (these will be listed on the UI)
    vm.resizableMediaItems = []; // sortedMediaItems which are able to be resized (items which are not on this list will be shown as disabled on the UI)
    vm.selectedMediaItems = []; // resizableMediaItems which have been selected to be resized by the user. These are the files that will ultimately be resized. 

    vm.sizeOfCurrentSelection = 0; // size of the resizableMediaItems

    // stats for final screen
    vm.numOfSuccessfullyResizedMediaItems = 0;
    vm.mbsSaved = 0; // amount saved by resizing selected images (selectedMediaItems)
    vm.originalSize = 0; // the original total of all the selected images
    vm.finalSize = 0; // (originalSize - mbsSaved)
    vm.totalItemsFound = 0; // found items
    vm.isProcessError = false;

    // control the style of the compression level form buttons
    const style = document.createElement('style');
    style.innerHTML = '#button { border: none!important; }';
    const style2 = document.createElement('style');
    style2.innerHTML = '#button { border: none!important; }';
    const style3 = document.createElement('style');
    style3.innerHTML = '#button { border: none!important; }';
    const style4 = document.createElement('style');
    style4.innerHTML = '#button { border: none!important; }';
    document.querySelector(".compression-level-select-button:nth-child(1)").shadowRoot.appendChild(style);
    document.querySelector(".compression-level-select-button:nth-child(2)").shadowRoot.appendChild(style2);
    document.querySelector(".compression-level-select-button:nth-child(3)").shadowRoot.appendChild(style3);
    document.querySelector(".compression-level-select-button:nth-child(4)").shadowRoot.appendChild(style4);

    let debounceTimeout = null;
    let errorTimeout = null;

    // show/hide section
    $scope.toggleSection = function (section) {
        if ($scope.showSection == section) return; // ignore when that section is already showing
        $scope.showSection = section === 'Everything' ? section : ($scope.showSection === section ? '' : section);
    };
    $scope.toggleSection('Images'); // select default

    $scope.togglePreviewState = function (state) {
        $scope.previewListState = state;
    };

    // expand preview table 
    $scope.expandTable = function () {
        const loaderOverlay = document.querySelector(".loader-overlay");
        const previewList = document.querySelector(".preview-list");

        // hide/show UI elements
        loaderOverlay.classList.remove("hidden");
        previewList.classList.add("hide-list");
        $scope.togglePreviewState('expanded'); // hide "view all" button

        $scope.tableLimit = vm.sortedMediaItems.length; // increase limit

        updateUICheckboxesAfterTableUIChange(); // update checkboxes UI

        // remove loader
        setTimeout(() => {
            loaderOverlay.classList.add("hidden");
            previewList.classList.remove("hide-list");
        }, 700); // delay is added as new list items aren't added immediately 
    };

    $scope.showHideDialog = function (dialog) {
        if ($scope.showDialog == dialog) {
            $scope.showDialog = 'none';
        } else {
            $scope.showDialog = dialog;
        }
    };

    function toggleShowOnlyResizableFiles(e) {
        e.preventDefault();
        const toggle = document.querySelector(".show-files-toggle");
        if (toggle.checked) {
            // show all files
            $scope.showFiles = "all";
            toggle.removeAttribute("checked");
        } else {
            // show only resizable files
            $scope.showFiles = "resizable";
            toggle.setAttribute("checked", "");
        }
    }

    function toggleShowOnlyRecommended(e) {
        e.preventDefault();
        var definedWidth = 2400;
        if ($scope.maxWidth !== "")
        {
            definedWidth = Number($scope.maxWidth);
        }
        const toggle = document.querySelector(".show-only-recommended-toggle");
        if (toggle.checked) {
            // show all files
            $scope.showRecommendedFiles = "all";
            toggle.removeAttribute("checked");
            $(vm.sortedMediaItems).each(function (i, element)
            {
                if (element.width <= definedWidth && element.sizeNotFixed <= 1)
                {
                    document.querySelector('#table-item-' + element.id).style.display = "table-row";
                }
            });
            
        } else {
            // show only resizable files
            $scope.showRecommendedFiles = "recommended";
            toggle.setAttribute("checked", "");
            $(vm.sortedMediaItems).each(function (i, element)
            {
                if (element.width <= definedWidth && element.sizeNotFixed <= 1) {
                    document.querySelector('#table-item-' + element.id).style.display = "none";
                    document.querySelector('#checkbox-' + element.id).removeAttribute("checked", "");
                    let selectedItemIndex = vm.selectedMediaItems.findIndex(x => x.id === element.id);
                    if (selectedItemIndex) {
                        vm.selectedMediaItems.splice(selectedItemIndex, 1);
                    }
                }
            });
        }
    }
    $scope.showFiles = "all"; // default value

    $scope.changeCompressionLevel = function (newLevel) {
        $scope.compressionLevel = newLevel;

        // set ui
        document.querySelectorAll(".compression-level-select-button").forEach((item) => {
            item.classList.remove("selected");
        });

        if (newLevel == "high") {
            document.querySelector(".compression-level-select-button:nth-child(4)").classList.add("selected");
        } else if (newLevel == "medium") {
            document.querySelector(".compression-level-select-button:nth-child(3)").classList.add("selected");
        } else if (newLevel == "low") {
            document.querySelector(".compression-level-select-button:nth-child(2)").classList.add("selected");
        } else {
            document.querySelector(".compression-level-select-button:nth-child(1)").classList.add("selected");
        }
    };

    // download csv file of the preview table
    vm.downloadCSVOfPreviewTable = function () {
        let csv = "File,File Name,Type,Parent Folder,Owner,Last Modified,File Size (mb), Width (px)\n";  //headers
        let protocol = window.location.protocol;  // e.g., "https:"
        let host = window.location.host;  // e.g., "localhost" or "mysite.com"
        let baseUrl = protocol + '//' + host;

        vm.sortedMediaItems.forEach(item => {
            let row = [
                baseUrl + item.src,
                item.name,
                item.fileType,
                item.folder,
                item.owner,
                item.updateDate,
                item.size,  // using 'size' since it gives size in MB.
                item.width
            ];

            csv += '"' + row.join('","') + '"\n';  // Surround each field with quotes to handle commas within data.
        });

        let blob = new Blob([csv], { type: 'text/csv' });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'files_listed_for_resize.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // download csv file of the results table 
    vm.downloadCSVOfResults = function () {
        let csv = "Resized Successfully?,File,File Name,Type,Parent Folder,Owner,File Size Reduction Percentage\n";  //headers
        let protocol = window.location.protocol;  // e.g., "https:"
        let host = window.location.host;  // e.g., "localhost" or "mysite.com"
        let baseUrl = protocol + '//' + host;

        vm.selectedMediaItems.forEach(item => {
            let row = [
                (item.recentlyResizedCorrectly) ? "Yes" : "No",
                baseUrl + item.src,
                item.name,
                item.fileType,
                item.folder,
                item.owner,
                item.fileSizeReductionPercentage,
            ];
            csv += '"' + row.join('","') + '"\n';  // Surround each field with quotes to handle commas within data.
        });

        let blob = new Blob([csv], { type: 'text/csv' });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'resizing_results.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // allows the user to switch between sorting the table by file size and sorting it by width
    $scope.switchTableSort = function (newSortingProperty) {
        if (newSortingProperty == "width") {
            // sort table by width (default)
            vm.sortedMediaItems.sort(function (a, b) {
                return b.width - a.width;  // descending order, from largest to smallest
            });

            // update UI
            document.querySelector(".width-table-head .sorting-chevron").style.display = "inline";
            document.querySelector(".file-size-table-head .sorting-chevron").style.display = "none";
        } else {
            // sort table by file size
            vm.sortedMediaItems.sort(function (a, b) {
                return b.size - a.size;  // descending order, from largest to smallest
            });

            // update UI
            document.querySelector(".width-table-head .sorting-chevron").style.display = "none";
            document.querySelector(".file-size-table-head .sorting-chevron").style.display = "inline";
        }

        vm.currentSortingProperty = newSortingProperty;

        updateUICheckboxesAfterTableUIChange(); // update checkboxes UI
    }

    // selects / deselects all items listed
    function selectDeselectAll(e) {
        e.preventDefault();
        document.querySelector(".master-checkbox").checked ? deselectAll() : selectAll();
    }

    function selectAll() {
        // set UI
        angular.forEach(document.querySelectorAll(".preview-list uui-checkbox"), function (element) {
            if (!element.disabled) element.setAttribute("checked", "");
        });
        // add all to the array
        vm.selectedMediaItems = vm.resizableMediaItems;

        setContinueButtonUI()
    }

    function deselectAll() {
        // set UI
        angular.forEach(document.querySelectorAll(".preview-list uui-checkbox"), function (element) {
            if (!element.disabled) element.removeAttribute("checked");
        });
        // remove all from the array
        vm.selectedMediaItems = [];

        setContinueButtonUI()
    }

    // select/deselect single item in preview list 
    function selectDeselectSingleItem(e) {
        e.preventDefault();
        let selectedItemID = Number(e.srcElement.classList[2]); // get item ID (embedded into checkbox classlist)
        // looks to see if the item is in the selectedMediaItems list 
        let result = vm.selectedMediaItems.find(obj => {
            return obj.id === selectedItemID;
        });
        if (result) {
            let itemIndex = vm.selectedMediaItems.findIndex(x => x.id === selectedItemID);
            vm.selectedMediaItems.splice(itemIndex, 1);

            // set UI
            e.srcElement.removeAttribute("checked", "");
        } else {
            // add to list ...

            // add to array
            let item = vm.sortedMediaItems.find(obj => {
                return obj.id === selectedItemID;
            });
            vm.selectedMediaItems.push(item);

            // set UI
            e.srcElement.setAttribute("checked", "");
        }

        setContinueButtonUI();
    }

    // sets the disabled / enabled state for the continue button on the preview screen 
    function setContinueButtonUI() {
        const button = document.querySelector(".continue-button");
        vm.selectedMediaItems.length > 0 ? button.disabled = false : button.disabled = true;
    }

    // make sure checkboxes are in select/deselect state according to vm.selectedMediaItems after clicking the "view all" button or changing the table sorting method
    // It does not update the master 'select/deselect all' checkbox (on purpose)
    function updateUICheckboxesAfterTableUIChange() {
        // timeout required as items being added to table in DOM isn't immediate 
        setTimeout(() => {
            angular.forEach(document.querySelectorAll(".preview-list uui-checkbox"), function (element) {
                if (!element.disabled && !element.classList.contains("master-checkbox")) {
                    let selectedItemID = Number(element.classList[2]); // get item ID (embedded into checkbox classlist)
                    // looks to see if the item is in the selectedMediaItems list 
                    let result = vm.selectedMediaItems.find(obj => {
                        return obj.id === selectedItemID;
                    });
                    // set UI
                    if (!result) {
                        element.removeAttribute("checked", "");
                    } else {
                        element.setAttribute("checked", "");
                    }
                }
            });

            // add event listeners to new checkboxes in DOM 
            let singleCheckboxes = document.querySelectorAll(".preview-list .single-checkbox");
            angular.forEach(singleCheckboxes, function (checkbox) {
                checkbox.removeEventListener("click", selectDeselectSingleItem);
                checkbox.addEventListener("click", selectDeselectSingleItem, false);
            });
        }, 200);
    }

    // used to sort each media item found 
    async function handleMediaItem(item) {
        const folderName = await $scope.getFolderNameFromID(item.parentId);

        let mediaType = determineMediaType(item);
        let fileExtension = determineMediaType(item, true);

        let srcProp = item.properties.find(p => p.alias === "umbracoFile");
        let bytesProp = item.properties.find(p => p.alias === "umbracoBytes");
        let widthProp = item.properties.find(p => p.alias === "umbracoWidth"); // Assuming the alias for width
        let heightProp = item.properties.find(p => p.alias === "umbracoHeight"); // Assuming the alias for height
        let fileTypeProp = item.properties.find(p => p.alias === "umbracoExtension"); // Assuming the alias for file type

        let tempMediaItem = {
            mediaType: mediaType,
            fileExtension: fileExtension,
            id: item.id,
            name: item.name,
            owner: item.owner.name,
            updateDate: item.updateDate,
            srcObj: srcProp,
            resizable: undefined,
            fileSizePostResizing: undefined,
            get fileSizePostResizingFixed() {
                return this.fileSizePostResizing != undefined ? Number(this.fileSizePostResizing.toFixed(2)) : null;
            },
            fileSizeReductionPercentage: undefined,
            recentlyResizedCorrectly: false, // used for the results screen to determine which items have been resized
            originalSizeBetter: false, // used for the results screen to determine whether the original size is better than what we can produce
            focalPointRecentlyReset: false, // also used for the results screen 
            get src() {
                return this.srcObj && this.srcObj.value ? (typeof this.srcObj.value === 'string' ? this.srcObj.value : this.srcObj.value.src) : null;
            },
            widthObj: widthProp,
            get width() {
                return this.widthObj ? Number(this.widthObj.value) : null;
            },
            widthPostResizing: undefined,
            heightObj: heightProp,
            get height() {
                return this.heightObj ? Number(this.heightObj.value) : null;
            },
            bytesObj: bytesProp,
            get size() {
                return this.bytesObj ? Number((this.bytesObj.value / 1000000).toFixed(2)) : null; // returns size in MB
            },
            get sizeNotFixed() {
                return this.bytesObj ? Number(this.bytesObj.value / 1000000) : 0; // returns size in MB not pre-fixed or 0 if undefined
            },
            fileTypeObj: fileTypeProp,
            get fileType() {
                return this.fileTypeObj ? this.fileTypeObj.value : null;
            },
            get folder() {
                return item.parentId == -1 ? "[root]" : folderName;
            },
            get parentId() {
                return item.parentId;
            }
        };

        // only mark as resizable if the file type is compatible with our resizing process
        (tempMediaItem.fileExtension == "jpeg" || tempMediaItem.fileExtension == "jpg" || tempMediaItem.fileExtension == "png") ? tempMediaItem.resizable = true : tempMediaItem.resizable = false;

        // Only add the image to the sortedMediaItems list if its width exceeds the max width specified by the user, unless no max width is provided
        if (((tempMediaItem.width > $scope.maxWidth && $scope.maxWidthSpecified) || !$scope.maxWidthSpecified) && mediaType == "image" && tempMediaItem.width != 0) {
            vm.sortedMediaItems.push(tempMediaItem);
            if (tempMediaItem.resizable) { // is it resizable?
                vm.resizableMediaItems.push(tempMediaItem);
                vm.selectedMediaItems.push(tempMediaItem); // items are selected by default in the UI so they should be added to this array also by default
                vm.sizeOfCurrentSelection += tempMediaItem.sizeNotFixed; // to display on the UI the current total of the resizable media items
            }
        }

        vm.sortedMediaItems.sort(function (a, b) {
            return b.width - a.width;  // descending order, from largest to smallest width
        });
    }

    $scope.getFolderNameFromID = function (id) {
        return new Promise(function (resolve, reject) {
            let found = false;
            angular.forEach($scope.foundFolders, function (folder) {
                if (folder.id == id) {
                    resolve(folder.name);
                    found = true;
                }
            });
            if (!found) {
                resolve("[root]"); // returns "[root]" to show that the file is not in any subfolder  
            }
        });
    }

    // initial function that runs when the user clicks the "preview files" button on the first screen
    $scope.previewAffectedFiles = function () {
        // form validation
        if (!document.getElementById("ignore-max-width").checked && (document.getElementById('max-width').value == "" || document.getElementById('max-width').value == null)) {
            return;
        }

        //set ui
        document.querySelector(".loader.preview-loader").style.display = "inline-flex";
        document.querySelector(".preview-affected-files-button").style.display = "none";

        // reset
        vm.sortedMediaItems = [];
        vm.resizableMediaItems = [];
        vm.selectedMediaItems = [];
        vm.sizeOfCurrentSelection = 0;
        $scope.foundFolders = []; // store their ID and name
        vm.mbsSaved = Number(0);
        vm.originalSize = Number(0);
        vm.finalSize = Number(0);
        vm.totalItemsFound = 0;

        // Recursive function to process media items
        async function processMediaItems(parentId) {
            let response = await mediaResource.getChildren(parentId);
            let mediaItems = response.items;

            if (mediaItems && Array.isArray(mediaItems)) { // This check ensures mediaItems is indeed an array
                for (let item of mediaItems) {
                    if (item.contentTypeAlias === "Folder") {
                        $scope.foundFolders.push({ id: item.id, name: item.name });  // Using $scope.foundFolders
                        await processMediaItems(item.id);  // Recursive call for folder
                    } else {
                        vm.totalItemsFound = vm.totalItemsFound + 1;
                        await handleMediaItem(item); // process individual media item
                    }
                }
            } else {
                //console.error("Unexpected structure for mediaItems:", mediaItems);
            }
        }

        // "-1" is used as it's the parent ID for the root folder
        processMediaItems(-1).then(() => {
            vm.sizeOfCurrentSelection = vm.sizeOfCurrentSelection.toFixed(2);
            $scope.toggleSection('Show Image Previews');
            // set default UI 
            document.querySelector(".loader.preview-loader").style.display = "none";
            document.querySelector(".preview-affected-files-button").style.display = "inline-flex";
            $scope.$apply(); 

            // add event listeners 
            document.querySelector(".master-checkbox").addEventListener("click", selectDeselectAll, false);

            let singleCheckboxes = document.querySelectorAll(".preview-list .single-checkbox");
            angular.forEach(singleCheckboxes, function (checkbox) {
                checkbox.addEventListener("click", selectDeselectSingleItem, false);
            });

            document.querySelector(".show-only-recommended-toggle").addEventListener("click", toggleShowOnlyRecommended, false);
            document.querySelector(".show-files-toggle").addEventListener("click", toggleShowOnlyResizableFiles, false);

            var isAllResizable = true;
            vm.sortedMediaItems.forEach((item, i) => {
                if (!item.resizable) {
                    isAllResizable = false;
                }
            });
            if (isAllResizable) {
                document.querySelector(".show-files-toggle").style.display = "none";
            }
        });
    }

    // set event listeners
    document.getElementById('preview-button').addEventListener('click', function () {
        $scope.maxWidth = document.getElementById('max-width').value;
        ($scope.maxWidth != "" && $scope.maxWidth != 0) ? $scope.maxWidthSpecified = true : $scope.maxWidthSpecified = false; // note if the max width has been specified
    });

    // event listener for the "ignore max width" checkbox on first screen
    document.getElementById('ignore-max-width').addEventListener('click', function (e) {
        e.preventDefault();

        if (document.getElementById('ignore-max-width').checked) {
            // is checked... uncheck and enable field
            document.getElementById('ignore-max-width').removeAttribute("checked");
            document.getElementById('max-width').removeAttribute("disabled");
        } else {
            // is unchecked... check and disable field
            document.getElementById('ignore-max-width').setAttribute("checked", "true");
            document.getElementById('max-width').value = "";
            document.getElementById('max-width').setAttribute("disabled", "");
        }
    });

    // returns the media type of a media item
    function determineMediaType(item, returnExtension = false) {
        const srcProp = item.properties.find(p => p.alias === "umbracoFile");

        if (!srcProp || !srcProp.value) {
            return 'other';
        }

        let filePath = '';

        if (typeof srcProp.value === 'string') {
            filePath = srcProp.value;
        } else if (srcProp.value.src) {
            filePath = srcProp.value.src;
        } else {
            //console.warn("Item does not have a valid src structure. srcProp.value type:", typeof srcProp.value, "srcProp.value value:", srcProp.value, "Complete item:", item);
            return 'other';
        }

        const extension = filePath.split('.').pop().toLowerCase();

        if (returnExtension) return extension; // will just return the file extension 

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return 'image';
            case 'mp4':
            case 'mov':
            case 'wmv':
            case 'avi':
                return 'video';
            default:
                return 'other';
        }
    }
    // triggers when the user clicks the "resize and download" button
    $scope.previewResize = async function () {
        $scope.showInnerSection = "Preview";
        $scope.showHideDialog('DownloadPreviewConfirmation') // hide dialog
        // set UI
        SetConfirmPageProcessUI();
        $scope.updateProgressIndicator(true);

        const previewLimit = 20;
        let formdataList = [];
        let mediaIDList = [];
        for (let i = 0; i < vm.selectedMediaItems.length + 25; i += 25) {
            for (let j = i; j < 25 + i; j++) {
                if (!vm.selectedMediaItems[j]) continue;
                let item = vm.selectedMediaItems[j];
                let format = GetFormatFromItem(item);
                let fileName = (format == "jpg") ? (item.fileExtension == "jpeg") ? item.name + ".jpeg" : item.name + ".jpg" : item.name + ".png";
                mediaIDList.push(item.id);
                formdataList.push({ MediaID: item.id, Format: format, OriginalSize: item.sizeNotFixed * 1024, FileName: fileName });
                if (formdataList.length > previewLimit) {
                    formdataList.sort((a, b) => b.OriginalSize - a.OriginalSize);
                    formdataList.pop();
                }
            }
        }
        SendPreviewRequest(mediaIDList, formdataList, $scope.maxWidth, $scope.compressionLevel).then(async results => {
            ResetUIForConfirmPage();
            const zip = new JSZip();
            results.forEach((item, index) => {
                const base64Data = item.NewFile;  
                zip.file(`${item.FileName}`, base64Data, { base64: true });
            });
            const zipBlob = await zip.generateAsync({ type: "blob" });

            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "resized_images_preview.zip";
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    function SendPreviewRequest(mediaIDList, formdataList, maxWidth, compressionLevel) {
        var newFormData = new FormData();
        newFormData.append("MediaList", JSON.stringify(formdataList));
        newFormData.append("MaxWidth", maxWidth);
        newFormData.append("CompressionLevel", compressionLevel);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/umbraco/backoffice/DWLMediaResizer/MediaResizer13/GetPreview`,
                method: 'POST',
                headers: backofficeHeaders(),
                dataFilter: stripAngularJsonPrefix,
                processData: false,
                contentType: false,
                data: newFormData,
                success: function (statusData) {
                    mediaIDList.forEach((id, i) => {
                        const selectedItem = vm.selectedMediaItems.find(item => item.id === id);
                        if (selectedItem) {
                            selectedItem.recentlyResizedCorrectly = true;
                            selectedItem.focalPointRecentlyReset = false;
                        }
                    });
                    resolve(statusData);
                },
                error: function (error) {
                    console.error('Error posting media item data:', error);
                    reject();
                }
            });
        });
    }

    // triggers when the user clicks the "resize and download" button
    $scope.resizeAndDownloadFiles = async function () {
        $scope.showInnerSection = "Resize";
        SetConfirmPageProcessUI();
        $scope.updateProgressIndicator(true);
        vm.finalSize = 0;
        vm.originalSize = 0;
        vm.mbsSaved = 0;
        vm.isProcessError = false;

        //length is not 0 based, ensure to start with correct i before looping through lots of 25
        for (let i = 0; i < (vm.selectedMediaItems.length -1) + 25; i += 25) {
            let formdataList = [];
            let mediaIDList = [];

            for (let j = i; j < 25 + i; j++) {
                if (!vm.selectedMediaItems[j]) continue;
                let item = vm.selectedMediaItems[j];
                let format = GetFormatFromItem(item);
                let fileName = (format == "image/jpeg") ? (item.fileExtension == "jpeg") ? item.name + ".jpeg" : item.name + ".jpg" : item.name + ".png";
                mediaIDList.push(item.id);
                formdataList.push({ MediaID: item.id, Format: format, OriginalSize: item.sizeNotFixed * 1024, FileName: fileName });
            }

            await SendProcessRequest(mediaIDList, formdataList, $scope.maxWidth, $scope.compressionLevel);

            $scope.updateProgressIndicator(); // add 25 to progess indicator
        }

        if (vm.isProcessError)
        {
            ResetUIForConfirmPage();
        }
        else
        {
            vm.numOfSuccessfullyResizedMediaItems = vm.selectedMediaItems.filter(item => item.recentlyResizedCorrectly === true).length;

            vm.finalSize = Number((vm.originalSize - vm.mbsSaved).toFixed(2));
            vm.mbsSaved = vm.mbsSaved.toFixed(2);
            // set UI
            $scope.toggleSection('Results');
            $scope.$apply(); // Ensure the view updates (sometimes needed in async contexts)
            $scope.updateProgressIndicator(true); // reset progess indicator 
            ResetUIForConfirmPage();
        }
    }

    function SendProcessRequest(mediaIDList, formdataList, maxWidth, compressionLevel) {
        var newFormData = new FormData();
        newFormData.append("MediaList", JSON.stringify(formdataList));
        newFormData.append("MaxWidth", maxWidth);
        newFormData.append("CompressionLevel", compressionLevel);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/umbraco/backoffice/DWLMediaResizer/MediaResizer13/ProcessServer`,
                method: 'POST',
                headers: backofficeHeaders(),
                dataFilter: stripAngularJsonPrefix,
                processData: false,
                contentType: false,
                data: newFormData,
                success: function (statusData) {
                    // populate 'recentlyResizedCorrectly' and 'focalPointRecentlyReset' field
                    mediaIDList.forEach((id, i) => {
                        const selectedItem = vm.selectedMediaItems.find(item => item.id === id);
                        var result = statusData.find(item => item.MediaID === selectedItem.id);;
                        if (selectedItem && result) {
                            selectedItem.recentlyResizedCorrectly = result.IsResized;
                            selectedItem.focalPointRecentlyReset = false;
                            selectedItem.widthPostResizing = result.WidthPostResizing;
                            selectedItem.fileSizePostResizing = Number(result.NewSizeInBytes / 1000000);
                            selectedItem.fileSizeReductionPercentage = result.FileSizeReductionPercentage;
                            selectedItem.originalSizeBetter = result.IsOriginalSizeBetter;
                            vm.originalSize += selectedItem.size;
                            if (selectedItem.fileSizePostResizingFixed !== 0)
                            {
                                vm.mbsSaved += (selectedItem.size - selectedItem.fileSizePostResizingFixed);
                            }
                        }
                    });
                    resolve();
                },
                error: function (error) {
                    console.error('Error posting media item data:', error);
                    vm.isProcessError = true;
                    resolve();
                }
            });
        });
    }

    $scope.updateProgressIndicator = function (reset = false, numToAdd = 25, customText = "") {
        const progressIndicator = document.querySelector(".progress-indicator");
        if (customText == "") {
            reset ? vm.progressNum = 0 : vm.progressNum += numToAdd;
            if (vm.progressNum > vm.selectedMediaItems.length) vm.progressNum = vm.selectedMediaItems.length;
            progressIndicator.innerHTML = reset ? '' : `(${vm.progressNum}/${vm.selectedMediaItems.length})`;
        } else {
            progressIndicator.innerHTML = `(${customText})`;
        }
    }

    // download the selected images in their current state as a backup (downloads a zip folder)
    $scope.downloadBackup = function () {
        $scope.showHideDialog('DownloadBackupConfirmation') // hide dialog

        // set UI
        document.querySelector(".download-backup-button").setAttribute("disabled", "");
        document.querySelector(".download-preview-button").setAttribute("disabled", "");
        document.querySelector(".resize-button").style.display = "none";
        document.querySelector(".final-back-button").style.display = "none";
        document.querySelector(".loader.resize-loader").style.display = "inline-flex";

        $scope.updateProgressIndicator(true); // reset progress indicator 

        const zip = new JSZip();

        async function getBlobs() {
            const promises = [];

            for (let i = 0; i < vm.selectedMediaItems.length + 25; i += 25) {
                let mediaItemIDs = [];
                var formdata = new FormData();
                for (let j = i; j < 25 + i; j++) {
                    if (vm.selectedMediaItems[j]) mediaItemIDs.push(vm.selectedMediaItems[j].id); // push the selectedMediaItems ID's within range 
                }

                if (mediaItemIDs.length == 0) continue; // skip if there are no more items left 
                formdata.append("mediaIds", mediaItemIDs);

                const promise = new Promise((resolve, reject) => {
                    $.ajax({
                        url: `/umbraco/backoffice/DWLMediaResizer/MediaResizer13/BackupMediaItems`,
                        method: 'POST',
                        headers: backofficeHeaders(),
                        dataFilter: stripAngularJsonPrefix,
                        processData: false,
                        contentType: false,
                        data: formdata,
                        responseType: 'arraybuffer',
                        success: function (returnData, headers) {
                            returnData.forEach((item) => {
                                // The authorized API serialises with PascalCase; accept either casing
                                var returnArray = base64ToArrayBuffer(item.fileArray ?? item.FileArray);
                                // Convert the byte array to a Blob
                                var blob = new Blob([returnArray]);
                                // add file to zip
                                zip.file(item.name ?? item.Name, blob, { binary: true });
                            });
                            $scope.updateProgressIndicator(); // adds 25 to the progess indicator 
                            $scope.$apply();
                            resolve();
                        },
                        error: function (error) {
                            console.error('Error posting media item data:', error);
                            reject(error);
                        }
                    });
                });

                promises.push(promise);
            }
            // Wait for all promises to resolve before continuing
            await Promise.all(promises);
        }

        getBlobs().then(() => {
            zip.generateAsync({ type: 'blob' }).then(function (content) {
                const link = document.createElement('a');
                const url = URL.createObjectURL(content);
                link.href = url;
                link.download = 'selected_images_backup.zip';
                link.click();

                // Revoke the Object URL to release browser resources
                URL.revokeObjectURL(url);

                // set UI
                document.querySelector(".loader.resize-loader").style.display = "none";
                document.querySelector(".download-preview-button").removeAttribute("disabled");
                document.querySelector(".download-backup-button").removeAttribute("disabled");
                document.querySelector(".resize-button").style.display = "inline-flex";
                document.querySelector(".final-back-button").style.display = "inline-flex";

                $scope.updateProgressIndicator(true); // reset progress indicator 
            });
        }).catch(error => {
            console.error("An error occurred during AJAX requests:", error);
        });
    }
});

function ResetUIForConfirmPage() {
    document.querySelector(".loader.resize-loader").style.display = "none";
    document.querySelector(".loader.resize-loader").style.display = "none";
    document.querySelector(".resize-button").style.display = "inline-flex";
    document.querySelector(".final-back-button").style.display = "inline-flex";
    document.querySelector(".download-preview-button").removeAttribute("disabled");
    document.querySelector(".download-backup-button").removeAttribute("disabled");
}

function SetConfirmPageProcessUI() {
    document.querySelector(".download-backup-button").setAttribute("disabled", "");
    document.querySelector(".download-preview-button").setAttribute("disabled", "");
    document.querySelector(".resize-button").style.display = "none";
    document.querySelector(".final-back-button").style.display = "none";
    document.querySelector(".loader.resize-loader").style.display = "inline-flex";
}

function GetFormatFromItem(item) {
    let format;
    if (item.fileExtension == "jpeg" || item.fileExtension == "jpg") {
        format = "jpg";
    } else if (item.fileExtension == "png") {
        format = "png";
    }
    else {
        format = "IGNORE";
    }
    return format;
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

const percentageDifference = (a, b) => ((a - b) / Math.max(a, b)) * 100;