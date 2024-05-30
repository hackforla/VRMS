// const {addDurationToTime} = require('../addDurationToTime')
import {addDurationToTime} from '../addDurationToTime'
import {test, expect} from 'vitest'

    test('adds inputted "0.5" duration to inputted time', () => {
        const inputDuration = "0.5"
        const inputTime = new Date()
        const outputTime = new Date(inputTime.getTime() + (.5*3600000))

        expect(addDurationToTime(inputTime, inputDuration)).toEqual(outputTime)
    })

    test('adds inputted ".5" duration to inputted time', () => {
        const inputDuration = ".5"
        const inputTime = new Date()
        const outputTime = new Date(inputTime.getTime() + (.5*3600000))

        expect(addDurationToTime(inputTime, inputDuration)).toEqual(outputTime)
    })

    test('adds inputted "3" hour duration to inputted time', () => {
        const inputDuration = "3"
        const inputTime = new Date()
        const outputTime = new Date(inputTime.getTime() + (3*3600000))

        expect(addDurationToTime(inputTime, inputDuration)).toEqual(outputTime)
    })

    test('throws an error when there is no valid input', () => {

        expect(addDurationToTime).toThrow(new Error('Error: Cannot calculate endTime.'))
    })