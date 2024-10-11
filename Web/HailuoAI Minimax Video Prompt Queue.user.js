// ==UserScript==
// @name         HailuoAI Minimax Video Prompt Queue
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Allows queuing multiple prompts and images for HailuoAI Video generator. Visit https://github.com/BillarySquintin/Billy_Scripts/
// @author       Billary
// @match        https://hailuoai.video/*
// @downloadURL https://update.greasyfork.org/scripts/512177/HailuoAI%20Minimax%20Video%20Prompt%20Queue%20with%20Image%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/512177/HailuoAI%20Minimax%20Video%20Prompt%20Queue%20with%20Image%20Support.user.js
// @grant        none
// @license MIT
// ==/UserScript==


(function() {
    'use strict';

    if (!window.location.href.startsWith('https://hailuoai.video/')) {
        return;
    }

    // Create the Prompt Queue button
    const queueButton = document.createElement("button");
    queueButton.innerHTML = "Prompt Queue";
    queueButton.style.position = "fixed";
    queueButton.style.top = "10px";
    queueButton.style.right = "10px";
    queueButton.style.zIndex = "1000";
    queueButton.style.backgroundColor = "#4CAF50";
    queueButton.style.color = "white";
    queueButton.style.border = "none";
    queueButton.style.padding = "10px";
    queueButton.style.borderRadius = "5px";
    queueButton.style.cursor = "pointer";
    document.body.appendChild(queueButton);

    // Create a container div for the prompt queue
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.right = '10px';
    container.style.zIndex = '10000';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.padding = '10px';
    container.style.maxWidth = '400px';
    container.style.overflowY = 'auto';
    container.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    container.style.borderRadius = '8px';
    container.style.display = 'none';

    // Create a close button for the container
    var closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
        container.style.display = 'none';
    });
    container.appendChild(closeButton);

    // Create a label for the textarea
    var label = document.createElement('label');
    label.textContent = 'Enter your prompts here (JSON format for images), separated by "---":';
    label.style.display = 'block';
    label.style.marginBottom = '5px';
    container.appendChild(label);

    // Create a textarea for prompts
    var textarea = document.createElement('textarea');
    textarea.rows = 10;
    textarea.cols = 40;
    textarea.placeholder = 'Enter your prompts here, separated by "---"';
    textarea.style.width = '100%';
    textarea.style.boxSizing = 'border-box';
    container.appendChild(textarea);

    // Create a label and input for Repeat Count
    var repeatLabel = document.createElement('label');
    repeatLabel.textContent = 'Repeat Count (default 1, "~" for infinity):';
    repeatLabel.style.display = 'block';
    repeatLabel.style.marginTop = '10px';
    container.appendChild(repeatLabel);

    var repeatInput = document.createElement('input');
    repeatInput.type = 'text';
    repeatInput.value = '1';
    repeatInput.style.width = '100%';
    container.appendChild(repeatInput);

    // Create a label and input for Starting Prompt Number
    var startPromptLabel = document.createElement('label');
    startPromptLabel.textContent = 'Starting Prompt Number (default 1):';
    startPromptLabel.style.display = 'block';
    startPromptLabel.style.marginTop = '10px';
    container.appendChild(startPromptLabel);

    var startPromptInput = document.createElement('input');
    startPromptInput.type = 'number';
    startPromptInput.value = '1';
    startPromptInput.min = '1';
    startPromptInput.style.width = '100%';
    container.appendChild(startPromptInput);

    // Create a label to display the current batch number
    var batchLabel = document.createElement('label');
    batchLabel.textContent = 'Current Batch: 0';
    batchLabel.style.display = 'block';
    batchLabel.style.marginTop = '10px';
    container.appendChild(batchLabel);

    // Create a label to display the current prompt number
    var promptCounterLabel = document.createElement('label');
    promptCounterLabel.textContent = 'Current Prompt: 0 / 0';
    promptCounterLabel.style.display = 'block';
    promptCounterLabel.style.marginTop = '10px';
    container.appendChild(promptCounterLabel);

    // Create an "Add Images" button
    var addImagesButton = document.createElement('button');
    addImagesButton.textContent = 'Add Images';
    addImagesButton.style.marginTop = '10px';
    addImagesButton.style.marginRight = '10px';
    addImagesButton.style.padding = '5px 10px';
    addImagesButton.style.cursor = 'pointer';
    container.appendChild(addImagesButton);

    // Create a start button
    var startButton = document.createElement('button');
    startButton.textContent = 'Start Queue';
    startButton.style.marginTop = '10px';
    startButton.style.padding = '5px 10px';
    startButton.style.cursor = 'pointer';
    container.appendChild(startButton);

    // Append the container to the body
    document.body.appendChild(container);

    // Add an event listener to the queueButton to toggle the prompt queue container
    queueButton.addEventListener('click', function() {
        container.style.display = (container.style.display === 'none') ? 'block' : 'none';
    });

    // Store images added via "Add Images" button
    var imagesMap = new Map();

    // Handle adding images through file selection
    addImagesButton.addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg,.jpeg,.png';
        fileInput.multiple = true;
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function(event) {
            var files = event.target.files;
            if (files.length === 0) return;

            Array.from(files).forEach(function(file) {
                imagesMap.set(file.name, file);
            });

            alert('Images have been added. Please ensure the filenames in your JSON input match the selected images.');
        });

        fileInput.click();
    });

    // Initialize variables
    var promptQueue = [];
    var originalPromptQueue = [];
    var totalRepeatCount = 1;
    var currentRepeat = 0;
    var startingPromptIndex = 1;
    var currentPromptNumber = 0;
    var totalPromptCount = 0;
    var totalPrompts = 0;

    // Now, when the start button is clicked, we start processing the prompts
    startButton.addEventListener('click', function() {
        // Clear previous queue
        promptQueue = [];

        var content = textarea.value.trim();

        if (!content) {
            alert('Please enter prompts or image-prompt pairs in the textarea.');
            return;
        }

        var repeatCountInput = repeatInput.value.trim();
        var repeatCount = 1;
        if (repeatCountInput === '~') {
            repeatCount = Infinity;
        } else {
            repeatCount = parseInt(repeatCountInput, 10);
            if (isNaN(repeatCount) || repeatCount < 1) {
                repeatCount = 1;
            }
        }

        var startPromptInputValue = parseInt(startPromptInput.value.trim(), 10);
        startingPromptIndex = isNaN(startPromptInputValue) || startPromptInputValue < 1 ? 1 : startPromptInputValue;

        var items = content.split('---').map(item => item.trim()).filter(item => item.length > 0);

        totalPrompts = items.length;

        processTextareaItems(items, function() {
            if(promptQueue.length === 0) {
                alert('No valid prompts or images to process.');
                return;
            }

            // Duplicate the promptQueue based on repeat count
            totalRepeatCount = repeatCount;
            currentRepeat = 0;

            originalPromptQueue = promptQueue.slice(); // Make a copy of the original prompts

            // Initialize prompt counters
            totalPromptCount = originalPromptQueue.length;

            // Adjust the prompt queue based on the starting prompt index
            startingPromptIndex = Math.min(startingPromptIndex, promptQueue.length);
            startingPromptIndex = Math.max(1, startingPromptIndex);
            promptQueue = promptQueue.slice(startingPromptIndex - 1);

            // Update the batch label
            batchLabel.textContent = 'Current Batch: ' + (currentRepeat + 1);

            // Set the current prompt number
            currentPromptNumber = startingPromptIndex;

            updatePromptCounterLabel();

            // Disable the start button to prevent multiple clicks
            startButton.disabled = true;

            // Start processing the prompts
            processPrompts();
        });
    });

    // Function to update the prompt counter label
    function updatePromptCounterLabel() {
        promptCounterLabel.textContent = 'Current Prompt: ' + currentPromptNumber + ' / ' + totalPromptCount;
    }

    // Function to process items from textarea
    function processTextareaItems(items, callback) {
        items.forEach(function(item) {
            try {
                // Try to parse item as JSON
                var jsonItem = JSON.parse(item);
                if (Array.isArray(jsonItem)) {
                    jsonItem.forEach(function(entry) {
                        processJsonEntry(entry);
                    });
                } else if (typeof jsonItem === 'object' && jsonItem !== null) {
                    // Single JSON object
                    processJsonEntry(jsonItem);
                } else {
                    alert('Invalid JSON format. Expected an object or an array of objects.');
                }
            } catch (e) {
                // Not JSON, treat as text prompt
                promptQueue.push({ type: 'text', content: item });
            }
        });

        callback();
    }

    function processJsonEntry(entry) {
        if (entry.filename && entry.prompt) {
            // Check if the image has been added via "Add Images"
            if (imagesMap.has(entry.filename)) {
                promptQueue.push({
                    type: 'image',
                    file: imagesMap.get(entry.filename),
                    prompt: entry.prompt
                });
            } else {
                alert(`Image "${entry.filename}" has not been added via "Add Images". Please add it.`);
            }
        } else {
            alert('Invalid JSON entry. Each entry must have "filename" and "prompt".');
        }
    }

    // Function to set the value of a textarea in a way that React recognizes
    function setNativeValue(element, value) {
        const lastValue = element.value;
        element.value = value;
        const event = new Event('input', { bubbles: true });
        // Hack to make React notice the change
        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }

    // Process the queue based on item type
    // Remove the uploaded image before entering the next prompt
    function processPrompts() {
        if (promptQueue.length === 0) {
            currentRepeat++;
            if (currentRepeat < totalRepeatCount || totalRepeatCount === Infinity) {
                // Reset the promptQueue to original and start over
                promptQueue = originalPromptQueue.slice();
                // Update the batch label
                batchLabel.textContent = 'Current Batch: ' + (currentRepeat + 1);
                // Reset the current prompt number
                currentPromptNumber = 1;
                updatePromptCounterLabel();
                processPrompts();
            } else {
                alert('All prompts have been processed.');
                startButton.disabled = false;
                // Reset the batch label and prompt counter
                batchLabel.textContent = 'Current Batch: 0';
                promptCounterLabel.textContent = 'Current Prompt: 0 / 0';
            }
            return;
        }

        // Remove the uploaded image before entering the next prompt
        removeUploadedImage();

        var item = promptQueue.shift();

        // Update current prompt number
        updatePromptCounterLabel();

        // Wait for queue space before proceeding
        waitForQueueSpace(function() {
            if (item.type === 'text') {
                processTextPrompt(item.content, function() {
                    currentPromptNumber++;
                    processPrompts();
                });
            } else if (item.type === 'image') {
                revealUploadPane(function() {
                    processImagePrompt(item, function() {
                        currentPromptNumber++;
                        processPrompts();
                    });
                });
            }
        });
    }

    // Adjust the waitForQueueSpace function to handle different queue counter text
    function waitForQueueSpace(callback) {
        var maxQueueSize = 5; // Assuming the max queue size is 5
        var checkQueue = setInterval(function() {
            var queueCounter = document.querySelector('div.font-medium'); // Adjust selector if necessary
            var submitButtonLoading = document.querySelector('img[src="/assets/img/dark-loading.png"]');

            var queueReady = false;
            var submitButtonReady = false;

            // Check queue size
            if (queueCounter) {
                var queueText = queueCounter.textContent.trim();
                var match = queueText.match(/(\d+)\s+jobs?\s+in\s+queue/);
                if (match) {
                    var currentQueueSize = parseInt(match[1], 10);
                    if (currentQueueSize < maxQueueSize) {
                        queueReady = true;
                    } else {
                        console.log('Queue is full (' + currentQueueSize + '/' + maxQueueSize + '). Waiting...');
                    }
                } else if (queueText.includes('you can queue 5 jobs at once')) {
                    // Queue is full when this message appears
                    var currentQueueSize = maxQueueSize;
                    console.log('Queue is full (' + currentQueueSize + '/' + maxQueueSize + '). Waiting...');
                } else {
                    console.error('Unable to parse queue size from text:', queueText);
                    // Assume queue is not full to prevent script from stalling
                    queueReady = true;
                }
            } else {
                // If the queue counter element is not found, assume the queue is empty
                console.log('Queue counter element not found. Assuming queue is empty.');
                queueReady = true;
            }

            // Check if submit button is not loading
            if (!submitButtonLoading) {
                submitButtonReady = true;
            } else {
                console.log('Submit button is loading. Waiting...');
            }

            // Proceed if both conditions are met
            if (queueReady && submitButtonReady) {
                clearInterval(checkQueue);
                callback();
            }
        }, 2000);
    }

    // Function to process text prompt
    function processTextPrompt(prompt, callback) {
        var promptTextarea = document.querySelector('.description_wrap textarea');
        if(!promptTextarea) {
            alert('Could not find prompt textarea on the page.');
            startButton.disabled = false;
            return;
        }

        setNativeValue(promptTextarea, prompt);

        waitForSubmitButton(function(submitButton) {
            submitButton.click();
            // No need to wait for video completion since we are queuing videos
            setTimeout(callback, 2000);
        });
    }
    // Function to process image prompt
    function processImagePrompt(item, callback) {
        var promptTextarea = document.querySelector('.description_wrap textarea');
        if (!promptTextarea) {
            alert('Could not find prompt textarea on the page.');
            startButton.disabled = false;
            return;
        }

        setNativeValue(promptTextarea, item.prompt);
        uploadImage(item.file, function(success) {
            if (!success) {
                alert('Failed to upload image.');
                callback();
                return;
            }

            waitForSubmitButton(function(submitButton) {
                submitButton.click();
                // No need to wait for video completion since we are queuing videos
                setTimeout(function() {
                    // Proceed to the next prompt without removing the image here
                    callback();
                }, 2000);
            });
        });
    }

    // Function to reveal the upload pane
    function revealUploadPane(callback) {
        var uploadTrigger = document.querySelector('.relative.mr-2.cursor-pointer.group');
        if (uploadTrigger) {
            uploadTrigger.click();
            setTimeout(callback, 500); // Adjust delay if necessary
        } else {
            alert('Could not find the image upload trigger on the page.');
            callback(false);
        }
    }

    // Function to remove any uploaded image
    function removeUploadedImage() {
        var removeButton = document.querySelector('span.hover\\:cursor-pointer');
        if (removeButton) {
            removeButton.click();
        }
    }

    // Adjust the uploadImage function to remove unnecessary retries
    function uploadImage(file, callback) {
        var uploadInput = document.querySelector('.ant-upload input[type="file"]');
        if (!uploadInput) {
            alert('Could not find image upload input on the page.');
            callback(false);
            return;
        }

        var dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        uploadInput.files = dataTransfer.files;

        uploadInput.dispatchEvent(new Event('change', { bubbles: true }));

        // Wait for image to finish uploading
        waitForImageUpload(function(success) {
            if (success) {
                callback(true);
            } else {
                // If it times out after retries, we can decide whether to skip or retry
                alert('Image upload failed after multiple attempts.');
                callback(false);
            }
        });
    }

    // Function to wait until the image has finished uploading
    function waitForImageUpload(callback) {
        var maxRetries = 30; // Adjust retries as necessary
        var retries = 0;
        var checkUpload = setInterval(function() {
            var uploadedImage = document.querySelector('img[alt="uploaded image"]');
            if (uploadedImage) {
                // Get the closest parent div with class 'relative'
                var parentDiv = uploadedImage.closest('div.relative');
                if (parentDiv) {
                    // Check if there is a child div.absolute (the overlay with the spinner or error)
                    var overlayDiv = parentDiv.querySelector('div.absolute');
                    if (overlayDiv) {
                        // Check if the retry button is present
                        var retryButton = overlayDiv.querySelector('svg.fill-\\[\\#F55762\\]');
                        if (retryButton) {
                            console.log('Image upload failed. Retrying...');
                            // Click the retry button
                            var retryButtonParent = retryButton.closest('div.cursor-pointer');
                            if (retryButtonParent) {
                                retryButtonParent.click();
                            } else {
                                console.log('Retry button parent not found.');
                            }
                        } else {
                            console.log('Image is still uploading...');
                        }
                    } else {
                        clearInterval(checkUpload);
                        console.log('Image upload successful.');
                        callback(true);
                    }
                } else {
                    console.log('Cannot find parent div of the uploaded image.');
                    retries++;
                }
            } else {
                console.log('Uploaded image element not found.');
                retries++;
            }

            if (retries >= maxRetries) {
                clearInterval(checkUpload);
                console.log('Image upload timed out.');
                callback(false);
            }
        }, 2000);
    }
    // Function to check if the submit button is available
    function isSubmitButtonAvailable() {
        var submitButton = getSubmitButton();
        return submitButton !== null;
    }

    // Function to get the submit button
    function getSubmitButton() {
        var buttons = document.querySelectorAll('div.cursor-pointer');
        for (var i = 0; i < buttons.length; i++) {
            var img = buttons[i].querySelector('img[alt="hilo ai video create icon"]');
            if (img) {
                return buttons[i];
            }
        }
        return null;
    }

    // Function to wait for the submit button to be available
    function waitForSubmitButton(callback) {
        var checkButton = setInterval(function() {
            if (isSubmitButtonAvailable()) {
                clearInterval(checkButton);
                var submitButton = getSubmitButton();
                callback(submitButton);
            }
        }, 1000);
    }

})();
