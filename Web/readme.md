**Title**: HailuoAI Minimax Video Prompt Queue with Image Support

[View on Greasy Fork](https://greasyfork.org/en/scripts/512177-hailuoai-minimax-video-prompt-queue)

**Description**:
This Tampermonkey script enhances the HailuoAI Video generator website by allowing users to queue multiple prompts and images, set repeat functionality, and start from a specific prompt number in the queue. With this script, you can seamlessly upload up to 5 videos at a time, monitor the queue, and manage your video creation process automatically. It’s designed to handle both text and image prompts efficiently, ensuring smooth batch processing without manual intervention.

**Features**:
- **Multiple Prompt Queue**: Queue multiple prompts (text or image-based) to be processed sequentially.
- **Image Support**: Allows adding images alongside prompts, reading prompts from image metadata if available.
- **Repeat Functionality**: Set how many times the entire prompt list will repeat; use '~' for infinite repeats.
- **Start Prompt Option**: Begin processing from a specific prompt number in the list, ideal for resuming work.
- **Automatic Queue Management**: Detects queue space availability and auto-submits as space allows, removing images only before the next prompt to prevent interference.
- **Visual Indicators**: Displays current batch, prompt number, and total prompts in a user-friendly format.
- **Bulk Download**: Allows selecting and downloading multiple videos at once (including prompts in JSON file). Includes options to download all visible videos, select/deselect individual videos, select videos between two selections, and download only selected videos.

**Usage Instructions**:

1. **Install the Script**:
   - Make sure you have Tampermonkey or a compatible user script manager installed.
   - Install this script from Greasy Fork by clicking on "Install" and then "Confirm Installation" in Tampermonkey.

2. **Navigate to HailuoAI Video Generator**:
   - Open the HailuoAI Video generator website at `https://hailuoai.video/`.
   - Ensure you are logged in and can access the prompt submission area.

3. **Open the Queue Interface**:
   - Click on the "Prompt Queue" button that appears at the top-right corner of the page after installing the script.
   - This opens a panel where you can enter your queue settings and manage prompts.

4. **Add Prompts**:
   - **Text Prompts**: Enter each text prompt in the textarea, separated by "---".
   - **Image Prompts**: Use the "Add Images" button to select images with associated prompts in their metadata. Image paths and prompts can also be manually entered in the textarea if needed, using this format:

     ```
     Prompt 1 description here
     ---
     "path/to/image1.png"
     ---
     Prompt 3 description here
     ```

5. **Set Queue Settings**:
   - **Repeat Count**: Specify the number of times to repeat the prompt list, or use '~' for infinite repeats.
   - **Start Prompt Number**: Set the prompt number to start processing from (helpful for resuming).
   - **Process Counter**: The interface shows the current prompt number out of the total for easy tracking.

6. **Start Queue**:
   - Click "Start Queue" to begin processing. The script will automatically manage the queue, upload prompts and images, submit them, and monitor the queue counter for availability.
   - **Note**: The script will wait for the prompt to be processed, removing images only before entering the next prompt.

7. **Monitoring Progress**:
   - Keep an eye on the queue counter and console logs for any errors or notifications.
   - The script auto-detects when the queue is full and waits until there’s space to continue.
   - You can pause or adjust settings in the panel at any time.

8. **Bulk Download**:
   - Select/Download All Visible Videos
   - Checkboxes to select videos
   - "Select Videos Between" to select all videos between selected checkboxes
   - All downloaded videos have prompts placed in JSON for easy metadata writing

**Additional Notes**:
- If the script encounters a failed upload, it will remove the image and retry uploading.
- The queue counter may take a moment to update, and the script checks both the queue size and loading state to ensure prompts are processed accurately.
- Their website is frequently being updated so this script may break at any time. I'll try to keep it updated for as long as I'm actually using it.

**Troubleshooting**:
- If you notice any issues, open the console (`F12` in most browsers) to view log messages.
- Make sure HailuoAI is accessible and you’re logged in before running the queue.

Enjoy automated video prompt processing with HailuoAI!
