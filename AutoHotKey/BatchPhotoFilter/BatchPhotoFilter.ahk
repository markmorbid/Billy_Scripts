; AutoHotKey script for repeatedly adding the same photo filter to all images in a folder
Loop, Files, C:\Projects\TargetFolder\*.*
{
SendInput ^o ; Open file menu
sleep, 750
clipboard := A_LoopFileName ; copies the name of the current file into the clipboard
sleep, 100
SendInput ^v{enter} ; paste the file name and press Enter
sleep, 1000
MouseClick, left, 1853, 147 ; Click "Add Look"
sleep, 200
MouseClick, left, 1774, 338 ; Click desired filter
sleep, 200
MouseClick, left, 1774, 338 ; Click amount level 25
sleep, 200
MouseClick, left, 1772, 381 ; Apply the look
sleep, 4000
SendInput ^e ; Export command
sleep, 200
SendInput {enter}
sleep, 200
MouseClick, left, 1137, 612 ; yes it's ok to overwrite
sleep, 500
}
