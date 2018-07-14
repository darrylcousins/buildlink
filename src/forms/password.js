/**
 * @file Provides an `PasswordInput` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Field } from 'react-form'

import Settings from '../settings'
import InputWrapper from './input_wrapper'

const PasswordField = props => (
  // Use the form field and your custom input together to create your very own input!
  <Field validate={props.validate} field={props.field}>
    { fieldApi => {

      // Remember to pull off everything you dont want ending up on the <input>
      // thats why we pull off onChange, onBlur, and field
      // Note, the ...rest is important because it allows you to pass any
      // additional fields to the internal <input>.
      const { validate, onChange, onBlur, field, ...rest } = props

      const { value, setValue, setTouched } = fieldApi

      return (
        <div>
          <input
            {...rest}
            value={value || ''}
            type="password"
            autoComplete="current-password"
            onChange={e => {
                setValue(e.target.value)
                if (onChange) {
                  onChange(e.target.value, e)
                }
              }}
              onBlur={e => {
                setTouched()
                if (onBlur) {
                  onBlur(e)
                }
              }}
          />
        </div>
      )
    }}
  </Field>
)

export default (props) => {

  const { formApi, name, title, help_text, validate } = props

  let style = Settings.style
  let inputStyle = style.inputDefault

  if (formApi.errors && name in formApi.errors) inputStyle = style.inputError
  if (formApi.warnings && name in formApi.warnings) inputStyle = style.inputWarning
  if (formApi.success && name in formApi.success) inputStyle = style.inputSuccess

  return (
    <InputWrapper
      formApi={ formApi }
      name={ name }
      title={ title }
      help_text={ help_text }
      validate={ validate }
    >
      <PasswordField
        field={ name }
        id={ name }
        validate={ validate }
        aria-describedby={ name + "-help-text" }
        className={ inputStyle }
      />
    </InputWrapper>
  )
}
