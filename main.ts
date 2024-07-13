namespace SeguidordeLinha {
    let leftSensorPin: AnalogPin;
    let centerSensorPin: AnalogPin;
    let rightSensorPin: AnalogPin;

    let whiteLeft: number;
    let blackLeft: number;
    let blackLCenter: number;
    let whiteCenter: number;
    let whiteRight: number;
    let blackRight: number;

    let leftSensorValue: number = 0;
    let centerSensorValue: number = 0;
    let rightSensorValue: number = 0;
    const ALPHA = 0.5; // Współczynnik wygładzania (między 0 a 1)

    //% blockId=Seguidor_de_Linha_create block="crie seguidor de linha com sensor esquerdo em %leftPin|e sensor direito em %rightPin"
    //% weight=100 blockSetVariable=SeguidordeLinha
    export function create(leftPin: AnalogPin, rightPin: AnalogPin): void {
        leftSensorPin = leftPin;
        centerSensorPin = centerPin;
        rightSensorPin = rightPin;
    }

    //% blockId=Seguidor_de_Linha_calibrate block="calibrar sensores"
    //% weight=90
    export function calibrate(): void {
        basic.showString("W");
        while (!input.buttonIsPressed(Button.A)) {
            basic.pause(100);
        }

        whiteLeft = getFilteredReading(leftSensorPin, true);
        whiteCenter = getFilteredReading(centerSensorPin, true);
        whiteRight = getFilteredReading(rightSensorPin, true);

        basic.showString("B");
        while (!input.buttonIsPressed(Button.B)) {
            basic.pause(100);
        }

        blackLeft = getFilteredReading(leftSensorPin, true);
        blackCenter = getFilteredReading(centerSensorPin, true);
        blackRight = getFilteredReading(rightSensorPin, true);

        basic.showIcon(IconNames.Yes);
    }

    //% blockId=Seguidor_de_Linha_read_left block="grave sensor esquerdo"
    //% weight=80
    export function readLeftSensor(): number {
        return Math.round(getFilteredReading(leftSensorPin, false));
    }

    //% blockId=Seguidor_de_Linha_read_right block="grave sensor direito"
    //% weight=80
    export function readRightSensor(): number {
        return Math.round(getFilteredReading(rightSensorPin, false));
    }
 //% blockId=Seguidor_de_Linha_read_center block="grave sensor central"
    //% weight=80
    export function readRightSensor(): number {
        return Math.round(getFilteredReading(centerSensorPin, false));
    }

    //% blockId=Seguidor_de_Linha_is_on_line block="usar sensor %sensor"
    //% weight=70
    export function isOnLine(sensor: SeguidordelinhaSensor): boolean {
        let sensorValue: number;
        let whiteValue: number;
        let blackValue: number;

        if (sensor === SeguidordeLinhaSensor.Left) {
            sensorValue = Math.round(getFilteredReading(leftSensorPin, false));
            whiteValue = whiteLeft;
            blackValue = blackLeft;
        } else if {
            sensorValue = Math.round(getFilteredReading(centerSensorPin, false));
            whiteValue = whiteRight;
            blackValue = blackRight;
        }
          else {
            sensorValue = Math.round(getFilteredReading(rightSensorPin, false));
            whiteValue = whiteRight;
            blackValue = blackRight;
        }
        return (sensorValue > whiteValue && sensorValue < blackValue);
    }

    function getFilteredReading(pin: AnalogPin, isCalibration: boolean): number {
        let currentValue = pins.analogReadPin(pin);

        if (pin === leftSensorPin) {
            if (isCalibration) {
                leftSensorValue = currentValue;
            } else {
                leftSensorValue = ALPHA * currentValue + (1 - ALPHA) * leftSensorValue;
            }
            return leftSensorValue;
        } else {
            if (isCalibration) {
                rightSensorValue = currentValue;
            } else {
                rightSensorValue = ALPHA * currentValue + (1 - ALPHA) * rightSensorValue;
            }
            return rightSensorValue;
        }
    }

    // Enum for sensors
    export enum SeguidordeLinhaSensor {
        //% block="left"
        Left,
        //% block="right"
        Right
    }
}

            basic.pause(duration);
            basic.clearScreen();
        }
    }
}
