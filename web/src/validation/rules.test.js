import { rangedDecimal } from './rules';
import {  Decimal } from "decimal.js-light";

describe('rangeDecimal', () => {
        it('should return error when from value is bigger than to without single mode', () => {
            let value = {to: new Decimal(30), from: new Decimal(205), mode: 'NOT_SINGLE_MODE'}
            expect(rangedDecimal(value)).toEqual('Second value has to be bigger or same')
        });
        it('should return undefined when from value is equal to to value without single mode', () => {
            let value = {to: new Decimal(205), from: new Decimal(205), mode: 'NOT_SINGLE_MODE'}
            expect(rangedDecimal(value)).toEqual(undefined)
        });
        it('should return undefined when from value is less than to value without single mode', () => {
            let value = {to: new Decimal(205), from: new Decimal(25), mode: 'NOT_SINGLE_MODE'}
            expect(rangedDecimal(value)).toEqual(undefined)
        });
        it('should return error in case of undefined to and from value', () => {
            let value = {to: undefined, from: undefined, mode: 'NOT_SINGLE_MODE'}
            expect(rangedDecimal(value)).toEqual('First value is required')
        })
        it('should return error in case of undefined to value without single mode', () => {
            let value = {to: undefined, from: new Decimal(30), mode: 'NOT_SINGLE_MODE'}
            expect(rangedDecimal(value)).toEqual('Second value is required')
        })
        it('should return undefined in case of undefined to value with single mode', () => {
            let value = {to: undefined, from: new Decimal(30), mode: 'SINGLE_MODE'}
            expect(rangedDecimal(value)).toEqual(undefined)
        })
        it('should return error in case of undefined from value', () => {
            let value = {to: new Decimal(30), from: undefined, mode: 'NOT_SINGLE_MODE' }
            expect(rangedDecimal(value)).toEqual('First value is required')
        })
        it('should return error in case of inappropriate types instead of decimal types', () => {
            let value = {to: 1, from: 1, mode: 'NOT_SINGLE_MODE'}
            expect(rangedDecimal(value)).toEqual('First value is required')
        })
});