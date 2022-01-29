import { Event } from '../types'

const ready: Event = {
    name: 'ready',
    once: true,
    execute() {
        console.log('Ready')
    }
}

export default ready
