/**
 * @file Provides an `Input` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Text } from 'react-form'

import Settings from '../settings'
import InputWrapper from './input_wrapper'

export default (props) => {

  const { formApi, name, title, help_text, defaultValue, validate, asyncValidate } = props

  let style = Settings.style
  let inputStyle = style.inputDefault

  if (formApi.errors && name in formApi.errors) inputStyle = style.inputError
  if (formApi.asyncErrors && name in formApi.asyncErrors) inputStyle = style.inputError
  if (formApi.warnings && name in formApi.warnings) inputStyle = style.inputWarning
  if (formApi.asyncWarnings && name in formApi.asyncWarnings) inputStyle = style.inputWarning
  if (formApi.successes && name in formApi.successes) inputStyle = style.inputSuccess
  if (formApi.asyncSuccesses && name in formApi.asyncSuccesses) inputStyle = style.inputSuccess

  return (
    <InputWrapper
      formApi={ formApi }
      name={ name }
      title={ title }
      help_text={ help_text }
    >
      <Text
        field={ name }
        name={ name }
        defaultValue={ defaultValue }
        id={ name }
        label={ name }
        validate={ validate }
        asyncValidate={ asyncValidate }
        autoComplete={ name }
        aria-describedby={ name + "-help-text" }
        className={ inputStyle }
      />
    </InputWrapper>
  )
}
