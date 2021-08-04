import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { FaRegHandSpock } from '@react-icons/all-files/fa/FaRegHandSpock'
import { useTranslation } from 'react-i18next'

export default function Hi({ message }: any) {
  const { name } = useParams() as any

  const history = useHistory()

  const { t } = useTranslation()

  return (
    <div>
      <p className="text-4xl">
        <FaRegHandSpock className="inline-block" />
      </p>
      <p>{t('intro.hi', { name })}</p>
      <p className="text-sm opacity-50">
        <em>{t('intro.dynamic-route')}</em>
      </p>
      <div>
        <button
          className="btn m-3 text-sm mt-8"
          onClick={() => history.goBack()}
        >
          {t('button.back')}
        </button>
      </div>
      Message from API: {message}
    </div>
  )
}
