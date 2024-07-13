// Definição de bloco para a extensão
// Bloco para acender todos os LEDs do Microbit
// @param ledOn se true, acende os LEDs; se false, apaga os LEDs
// @param brightness brilho dos LEDs, de 0 a 255
// @param duration duração em milissegundos para manter os LEDs acesos

//% weight=100 color=#0fbc11 icon=""
namespace seguelinha {
    /**
     * Acende todos os LEDs do Microbit com o brilho especificado por uma duração determinada.
     * @param ledOn se true, acende os LEDs; se false, apaga os LEDs
     * @param brightness brilho dos LEDs, de 0 a 255
     * @param duration duração em milissegundos para manter os LEDs acesos
     */
    //% block="acender LEDs do Microbit | ligado $ledOn | brilho $brightness | duração (ms) $duration"
    //% ledOn.shadow="toggleOnOff"
    //% brightness.min=0 brightness.max=255
    //% brightness.defl=100
    //% duration.min=0
    export function acenderLEDs(ledOn: boolean, brightness: number, duration: number): void {
        if (ledOn) {
            led.setBrightness(brightness);
            for (let x = 0; x < 5; x++) {
                for (let y = 0; y < 5; y++) {
                    led.plotBrightness(x, y, brightness);
                }
            }
            basic.pause(duration);
            basic.clearScreen();
        }
    }
}
