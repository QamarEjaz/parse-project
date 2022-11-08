import { useEffect, useState } from 'react'
import { ICounterProps } from './Counter.interfaces'

const Counter = ({ start, className }: ICounterProps): JSX.Element => {
  const calculateTimeLeft = () => {
    const difference = +new Date() - +new Date(start)
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        sec: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

  const timerComponents: JSX.Element[] = []

  Object.keys(timeLeft).forEach((interval, index) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return
    }

    timerComponents.push(
      <span key={index}>
        {timeLeft[interval as keyof typeof timeLeft]} {interval}{' '}
      </span>
    )
  })

  return <div className={`whitespace-nowrap font-medium ml-1 ${className}`}>{timerComponents.length ? timerComponents : ''}</div>
}

export default Counter
