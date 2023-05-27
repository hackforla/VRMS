const {addDurationToTime} = require('../addDurationToTime')

describe('addDurationToTime', () => {
    it('adds inputted "0.5" duration to inputted time', () => {
        const inputDuration = "0.5"
        const inputTime = new Date()
        const outputTime = new Date(inputTime.getTime() + (.5*3600000))

        expect(addDurationToTime(inputTime, inputDuration)).toEqual(outputTime)
    })

    it('adds inputted ".5" duration to inputted time', () => {
        const inputDuration = ".5"
        const inputTime = new Date()
        const outputTime = new Date(inputTime.getTime() + (.5*3600000))

        expect(addDurationToTime(inputTime, inputDuration)).toEqual(outputTime)
    })

    it('adds inputted "3" hour duration to inputted time', () => {
        const inputDuration = "3"
        const inputTime = new Date()
        const outputTime = new Date(inputTime.getTime() + (3*3600000))

        expect(addDurationToTime(inputTime, inputDuration)).toEqual(outputTime)
    })

    it('throws an error when there is no valid input', () => {

        expect(addDurationToTime).toThrow(new Error('Error: Cannot calculate endTime.'))
    })
})