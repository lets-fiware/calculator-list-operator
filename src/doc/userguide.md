## Introduction

The Calculator list operator is a WireCloud operator that allows to calculate a value of a formula which is set in settings with value list which comes from input endpoint.

## Settings

- **formula:** Set a formula. It's able to use arithmetic operators, parentheses and 'A' for the input value. e.g. (100*A)+1
- **Action when an invalid value:** Action when an invalid value received. Throw exception, remove value or pass through.
- **Math:** Math function for roundfing off. No operation, Math.round, Math.floor, Math.ceil or Math.trunc.
- **Decimal point:** Rounding digits, Integer, first decimal place, second decimal place or third decimal place.
- **Send Nulls:** Enable this option to propagate null values, leave it disable to filter null events.

## Wiring

### Input Endpoints

- Input : List of Number e.g. [123, "567"]

### Output Endpoints

- Output : List of Number calculated and rounded off  e.g. [1230, 5670]

## Usage

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
