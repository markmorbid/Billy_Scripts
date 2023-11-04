; Define a hotkey to start the script
F1::
; Set the initial number to 01
num := 01
; Loop indefinitely
Loop
{
    ; Press F7
    Send, {F7}
    ; Paste the clipboard content
    Send, ^v
    ; Type the number with leading zero
    Send, % Format("{:02}", num)
    ; Press Enter
    Send, {Enter}
    ; Press Shift+3 to focus on the timeline
    Send, +{3}
    ; Press Ctrl+Down
    Send, ^{Down}
    ; Increment the number by 1
    num++
    ; Check if the number is greater than 99
    if (num > 99)
    {
        ; Reset the number to 01
        num := 01
    }
    ; Wait for 0.5 seconds
    Sleep, 500
    ; Check if the script is paused
    if (pause)
    {
        ; Wait until the script is unpaused
        while (pause)
        {
            Sleep, 100
        }
    }
}
return

; Define a hotkey to pause the script
F2::
; Toggle the pause variable
pause := !pause
return


