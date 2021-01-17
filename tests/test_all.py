from pyautogui import typewrite,press
from time import sleep

prefix = 'juakoto '

sleep(5)

def test_enqueue_nat ():
    msg = prefix + 'p nandemonaiya'
    typewrite(msg)
    press('enter')
    sleep(3)

def test_enqueue_link ():
    msg = prefix + "p https://www.youtube.com/watch?v=n89SKAymNfA"
    typewrite(msg)
    press('enter')
    sleep(3)


def test_enqueue_invalid_link ():
    msg = prefix + "p https://www.youtube.com/watch?v=n89SKAymNf"
    #? Why does typewrite bug //?
    typewrite(msg)
    press('enter')
    sleep(3)

def test_enqueue_playlist ():
    msg = prefix + "p https://www.youtube.com/watch?v=mw5r_LIM2ZQ&list=RDMM&start_radio=1&rv=Nr7LD6vGxnw"
    typewrite(msg)
    press('enter')
    sleep(3)