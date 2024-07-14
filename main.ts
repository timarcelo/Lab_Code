const enum DistanceUnit {
    //% block="cm"
    CM = 58, // Duration of echo round-trip in Microseconds (uS) for two centimeters, 343 m/s at sea level and 20°C
    //% block="inch"
    INCH = 148, // Duration of echo round-trip in Microseconds (uS) for two inches, 343 m/s at sea level and 20°C
}

//% color=#1ebed6 icon="\u272a" block="<LAB_CODE>"
//% category="LABCODE"
namespace LAB_CODE {
    const MICROBIT_LABCODE_ULTRASSONICO_OBJETO_DETECTADO_ID = 798;
    const caminho_maximo = 300 * DistanceUnit.CM;
    const MEDICOES_ULTRASSONICAS = 3;

    interface UltrasonicRoundTrip {
            ts: number;
    rtt: number;
}

interface UltrasonicDevice {
    trig: DigitalPin | undefined;
    roundTrips: UltrasonicRoundTrip[];
    medianRoundTrip: number;
    travelTimeObservers: number[];
}

let ultrasonicState: UltrasonicDevice;

/**
 * Configures the ultrassonic distance sensor and measures continuously in the background.
 * @param trig pin connected to trig, eg: DigitalPin.P12
 * @param echo pin connected to echo, eg: DigitalPin.P13
 */
//% subcategory="Ultrassônico"
//% blockId="labcode_ultrassonico_connectado"
//% block="conecte o sensor ultrassônico | em Trig em %trig | e Echo em %echo"
//% trig.fieldEditor="gridpicker"
//% trig.fieldOptions.columns=4
//% trig.fieldOptions.tooltips="false"
//% echo.fieldEditor="gridpicker"
//% echo.fieldOptions.columns=4
//% echo.fieldOptions.tooltips="false"
//% weight=80
export function connectUltrasonicDistanceSensor(
    trig: DigitalPin,
    echo: DigitalPin
): void {
    if (ultrasonicState && ultrasonicState.trig) {
        return;
    }

    if (!ultrasonicState) {
        ultrasonicState = {
            trig: trig,
            roundTrips: [{ ts: 0, rtt: caminho_maximo }],
            medianRoundTrip: caminho_maximo,
            travelTimeObservers: [],
        };
    } else {
        ultrasonicState.trig = trig;
    }

    pins.onPulsed(echo, PulseValue.High, () => {
        if (
            pins.pulseDuration() < caminho_maximo &&
            ultrasonicState.roundTrips.length <= MEDICOES_ULTRASSONICAS
        ) {
            ultrasonicState.roundTrips.push({
                ts: input.runningTime(),
                rtt: pins.pulseDuration(),
            });
        }
    });

    control.inBackground(measureInBackground);
}

/**
 * Do something when an object is detected the first time within a specified range.
 * @param distance distance to object, eg: 20
 * @param unit unit of distance, eg: DistanceUnit.CM
 * @param handler body code to run when the event is raised
 */
//% subcategory="Ultrassônico"
//% blockId=labcode_ultrasonic_on_object_detected
//% block="Objeto detectado a | %distance | %unit"
//% weight=69
export function onUltrasonicObjectDetected(
    distance: number,
    unit: DistanceUnit,
    handler: () => void
) {
    if (distance <= 0) {
        return;
    }

    if (!ultrasonicState) {
        ultrasonicState = {
            trig: undefined,
            roundTrips: [{ ts: 0, rtt: caminho_maximo }],
            medianRoundTrip: caminho_maximo,
            travelTimeObservers: [],
        };
    }

    const travelTimeThreshold = Math.imul(distance, unit);

    ultrasonicState.travelTimeObservers.push(travelTimeThreshold);

    control.onEvent(
        MICROBIT_LABCODE_ULTRASSONICO_OBJETO_DETECTADO_ID,
        travelTimeThreshold,
        () => {
            handler();
        }
    );
}

/**
 * Returns the distance to an object in a range from 1 to 300 centimeters or up to 118 inch.
 * The maximum value is returned to indicate when no object was detected.
 * -1 is returned when the device is not connected.
 * @param unit unit of distance, eg: DistanceUnit.CM
 */
//% subcategory="Ultrassônico"
//% blockId="labcode_ultrasSonico_distancia"
//% block="A distância é %unit"
//% weight=60
export function getUltrasonicDistance(unit: DistanceUnit): number {
    if (!ultrasonicState) {
        return -1;
    }
    basic.pause(0); // yield to allow background processing when called in a tight loop
    return Math.idiv(ultrasonicState.medianRoundTrip, unit);
}

/**
 * Returns `true` if an object is within the specified distance. `false` otherwise.
 *
 * @param distance distance to object, eg: 20
 * @param unit unit of distance, eg: DistanceUnit.CM
 */
//% subcategory="Ultrassônico"
//% blockId="labcode_ultrasonic_less_than"
//% block="A distância é menor que | %distance | %unit"
//% weight=50
export function isUltrasonicDistanceLessThan(
    distance: number,
    unit: DistanceUnit
): boolean {
    if (!ultrasonicState) {
        return false;
    }
    basic.pause(0); // yield to allow background processing when called in a tight loop
    return Math.idiv(ultrasonicState.medianRoundTrip, unit) < distance;
}

function triggerPulse() {
    // Reset trigger pin
    pins.setPull(ultrasonicState.trig, PinPullMode.PullNone);
    pins.digitalWritePin(ultrasonicState.trig, 0);
    control.waitMicros(2);

    // Trigger pulse
    pins.digitalWritePin(ultrasonicState.trig, 1);
    control.waitMicros(10);
    pins.digitalWritePin(ultrasonicState.trig, 0);
}

function getMedianRRT(roundTrips: UltrasonicRoundTrip[]) {
    const roundTripTimes = roundTrips.map((urt) => urt.rtt);
    return median(roundTripTimes);
}

// Returns median value of non-empty input
function median(values: number[]) {
    values.sort((a, b) => {
        return a - b;
    });
    return values[(values.length - 1) >> 1];
}

function measureInBackground() {
    const trips = ultrasonicState.roundTrips;
    const TIME_BETWEEN_PULSE_MS = 145;

    while (true) {
        const now = input.runningTime();

        if (trips[trips.length - 1].ts < now - TIME_BETWEEN_PULSE_MS - 10) {
            ultrasonicState.roundTrips.push({
                ts: now,
                rtt: caminho_maximo,
            });
        }

        while (trips.length > MEDICOES_ULTRASSONICAS) {
            trips.shift();
        }

        ultrasonicState.medianRoundTrip = getMedianRRT(
            ultrasonicState.roundTrips
        );

        for (let i = 0; i < ultrasonicState.travelTimeObservers.length; i++) {
            const threshold = ultrasonicState.travelTimeObservers[i];
            if (threshold > 0 && ultrasonicState.medianRoundTrip <= threshold) {
                control.raiseEvent(
                    MICROBIT_LABCODE_ULTRASSONICO_OBJETO_DETECTADO_ID,
                    threshold
                );
                // use negative sign to indicate that we notified the event
                ultrasonicState.travelTimeObservers[i] = -threshold;
            } else if (
                threshold < 0 &&
                ultrasonicState.medianRoundTrip > -threshold
            ) {
                // object is outside the detection threshold -> re-activate observer
                ultrasonicState.travelTimeObservers[i] = -threshold;
            }
        }

        triggerPulse();
        basic.pause(TIME_BETWEEN_PULSE_MS);
    }}
  //% subcategory="Seguidor de Linha"
    namespace sensoreslinha {
        let leftSensorPin: AnalogPin;
        let rightSensorPin: AnalogPin;

        let whiteLeft: number;
        let blackLeft: number;
        let whiteRight: number;
        let blackRight: number;

        let leftSensorValue: number = 0;
        let rightSensorValue: number = 0;
        const ALPHA = 0.5; // Współczynnik wygładzania (między 0 a 1)

        //% blockId=criando_sensores_linha block="Criando o sensor esquedo em %leftPin| e o sensor direito em %rightPin"
        //% weight=100 blockSetVariable=sensorlinha
        export function create(leftPin: AnalogPin, rightPin: AnalogPin): void {
            leftSensorPin = leftPin;
            rightSensorPin = rightPin;
        }

        //% blockId=CALIBRANDO_SENSOR_LINHA block="calibrando sensores"
        //% weight=90
        export function calibrate(): void {
            basic.showString("B");
            while (!input.buttonIsPressed(Button.A)) {
                basic.pause(100);
            }

            whiteLeft = getFilteredReading(leftSensorPin, true);
            whiteRight = getFilteredReading(rightSensorPin, true);

            basic.showString("P");
            while (!input.buttonIsPressed(Button.B)) {
                basic.pause(100);
            }

            blackLeft = getFilteredReading(leftSensorPin, true);
            blackRight = getFilteredReading(rightSensorPin, true);

            basic.showIcon(IconNames.Yes);
        }

        //% blockId=GRAVANDO_SENSOR_ESQUERDO block="Gravando sensor esquerdo"
        //% weight=80
        export function readLeftSensor(): number {
            return Math.round(getFilteredReading(leftSensorPin, false));
        }

        //% blockId=GRAVANDO_SENSOR_DIREITO block="Gravando sensor direito"
        //% weight=80
        export function readRightSensor(): number {
            return Math.round(getFilteredReading(rightSensorPin, false));
        }

        //% blockId=ativando_sensores block="sensor ativo %sensor"
        //% weight=70
        export function isOnLine(sensor: LineFollowerSensor): boolean {
            let sensorValue: number;
            let whiteValue: number;
            let blackValue: number;

            if (sensor === LineFollowerSensor.Left) {
                sensorValue = Math.round(getFilteredReading(leftSensorPin, false));
                whiteValue = whiteLeft;
                blackValue = blackLeft;
            } else {
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
        export enum LineFollowerSensor {
            //% block="esquerdo"
            Left,
            //% block="direito"
            Right
        }
    }

    }