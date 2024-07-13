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
            led.plotBrightness(0, 0, brightness);
            led.plotBrightness(1, 0, brightness);
            led.plotBrightness(2, 0, brightness);
            led.plotBrightness(3, 0, brightness);
            led.plotBrightness(4, 0, brightness);
            led.plotBrightness(0, 1, brightness);
            led.plotBrightness(1, 1, brightness);
            led.plotBrightness(2, 1, brightness);
            led.plotBrightness(3, 1, brightness);
            led.plotBrightness(4, 1, brightness);
            led.plotBrightness(0, 2, brightness);
            led.plotBrightness(1, 2, brightness);
            led.plotBrightness(2, 2, brightness);
            led.plotBrightness(3, 2, brightness);
            led.plotBrightness(4, 2, brightness);
            led.plotBrightness(0, 3, brightness);
            led.plotBrightness(1, 3, brightness);
            led.plotBrightness(2, 3, brightness);
            led.plotBrightness(3, 3, brightness);
            led.plotBrightness(4, 3, brightness);
            led.plotBrightness(0, 4, brightness);
            led.plotBrightness(1, 4, brightness);
            led.plotBrightness(2, 4, brightness);
            led.plotBrightness(3, 4, brightness);
            led.plotBrightness(4, 4, brightness);
            basic.pause(duration);
            led.unplot(0, 0);
            led.unplot(1, 0);
            led.unplot(2, 0);
            led.unplot(3, 0);
            led.unplot(4, 0);
            led.unplot(0, 1);
            led.unplot(1, 1);
            led.unplot(2, 1);
            led.unplot(3, 1);
            led.unplot(4, 1);
            led.unplot(0, 2);
            led.unplot(1, 2);
            led.unplot(2, 2);
            led.unplot(3, 2);
            led.unplot(4, 2);
            led.unplot(0, 3);
            led.unplot(1, 3);
            led.unplot(2, 3);
            led.unplot(3, 3);
            led.unplot(4, 3);
            led.unplot(0, 4);
            led.unplot(1, 4);
            led.unplot(2, 4);
            led.unplot(3, 4);
            led.unplot(4, 4);

        }}}
// Importar dependências necessárias
// Por exemplo, importar RobotBit para controlar motores
//import RobotBit from 'robotbit';

// Função para ler o sensor de linha
// Exemplo básico para um sensor de linha conectado a P0
  export function lerSensorLinha(): boolean {
    return pins.digitalReadPin(DigitalPin.P0) == 1;
}

// Função para ler o sensor ultrassônico
// Exemplo básico para sensor ultrassônico conectado a P1 (trigger) e P2 (echo)
  export function lerSensorUltrassonico(): number {
    // Implementar lógica para medir distância
    return 0;
}

// Função para controlar o carrinho seguidor de linha
  export function controlarCarrinho(): void {
    // Implementar lógica para seguir a linha usando os sensores de linha
    // e ajustar a direção conforme necessário
}

// Definir blocos personalizados para o MakeCode
// Exemplo:
// blocks.block('ler_sensor_linha', 'ler sensor de linha', lerSensorLinha);

