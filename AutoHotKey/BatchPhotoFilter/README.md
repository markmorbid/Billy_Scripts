# BatchPhotoFilter
This script will loop through all of the images in a target folder and use simulated mouse clicks to apply a specific filter to all images in a program that doesn't support batch processing.

I was very lazy with this script because I didn't feel like learning the intricacies of AutoHotKey in order to optimize the script yet. For example, you have to run the init.ahk in order to be able to start the main script with CTRL+K, it relies heavily on sleep/wait commands that have to be tweaked for each new job, and the only way to stop the script if it has an error is to end the task via Task Manager.

But it's simple, straightforward, and it gets the job done. Mouse coordinates for each step can be determined by using the WindowSpy script included with the latest AutoHotKey download.



Here's a few links I pulled from when researching to building the script:

https://www.reddit.com/r/AutoHotkey/comments/57599u/need_a_little_help_getting_started/

https://www.autohotkey.com/boards/viewtopic.php?t=71902

https://www.autohotkey.com/board/topic/9108-please-help-invalid-hotkey/page-2

https://stackoverflow.com/questions/23836986/autohotkey-how-to-set-up-a-watchdog
