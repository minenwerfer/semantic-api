import type { ApiFunction } from '@semantic-api/api'
import type { Person } from '../person.description'

type Props = Pick<Person,
  'name'
  | 'job'
>

const hello: ApiFunction<Props> = (props, { validate }) => {
  validate(props, [
    'name',
    'job'
  ])

  const treatment = (() => {
    switch( props.job ) {
      case 'doctor': return 'Dr.'
      default: return 'Mr.'
    }
  })()

  return {
    message: `Hello, ${treatment} ${props.name}!`
  }
}

export default hello
