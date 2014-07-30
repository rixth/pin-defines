# pin-defines

This small utility generates a header file for AVR projects with a bunch of macros to help with general IO.

## Installation

`npm install -g pin-defines`

## Usage

You will need: an input file. The default path is `src/pins.yaml`. It looks something like this:

    ---
      led: 2
      btn: 3

Here, you are defining that "led" is on pin 2 of the AVR, and "btn" is on pin 3. Next, run: `pin-defines --device attiny85 --out-to-stdout`. A header file will be output to your terminal.

You can also define `--out` to output to a file (default: `src/pins.h`) and `--in` to specify an alternate input file.

Don't forget to include your header file in your project.

## The macros

Say you define "led" on pin 2 of an ATTiny85. You'll get output that looks something like this.

    #define LED_DDR        DDRB
    #define LED_PORT       PORTB
    #define LED_PIN        PINB
    #define LED_MASK       (1 << 2)

    #define LED_ToOutput() LED_DDR |= LED_MASK
    #define LED_ToInput()  LED_DDR &= ~LED_MASK

    #define LED_High()     LED_PORT |= LED_MASK
    #define LED_Low()      LED_PORT &= ~LED_MASK

    #define LED_Read()     LED_PIN & LED_MASK
    #define LED_IsLow()    !LED_Read()
    #define LED_IsHigh()   LED_Read()

    #define LED_LoopUntilHigh() do { } while (LED_IsLow())
    #define LED_LoopUntilLow()  do { } while (LED_IsHigh())


## Adding new devices

Create a new yaml file in src/devices following the structure of an existing device file, then add it to map.yaml (this is needed because multiple AVRs share the same pinout).

Pull requests welcome.

