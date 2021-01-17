from pyautogui import press, typewrite
from time import sleep

PREFIX = 'juakoto'

sleep(5)

def test_happy_path ():
    msg = PREFIX + "alias nande https://www.youtube.com/watch?v=n89SKAymNfA"
    typewrite(msg)
    press('enter')

#With pytest this isn`t necessary
test_happy_path()


